import React from 'react';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'
import { IStatementData, StatementsData, StatementsSelector } from '../FileSelector';
import { artistsFromSheetData, statementDatesFromRows } from './utility';
import { ArtistsManager, getArtistsManager } from '../artists/ArtistsManager';
import { ArtistsImport } from '../artists/ArtistsImport';
import { ConfirmCommitButton } from '../utility/ConfirmCommitButton';
import { getStatementsManager, StatementsManager } from './StatementsManager';
import { Platform } from './statements';

export function StatementsImport() {
  const [statementData, setStatementData] = React.useState<StatementsData>({})
  const [artistManager, setArtistManager] = React.useState<ArtistsManager>()
  const [statementsManager, setStatementsManager] = React.useState<StatementsManager>()

  React.useEffect(() => {
    getArtistsManager().then(setArtistManager)
    getStatementsManager().then(setStatementsManager)
  }, [])

  if (!artistManager || !statementsManager) return <Box>Loading...</Box>

  return <Box>
    <Box>Statements Import</Box>
    <Box><StatementsSelector label={'Import File Data'} onStatementsSelect={setStatementData} /></Box>
    <Box>{Object.entries(statementData).map(([name, data]) => {
      return <StatementImport key={name} name={name} data={data} artistManager={artistManager} statementsManager={statementsManager} />
    })}</Box>
  </Box>
}

function StatementImport({ name, data: { rows, sheetHeaders }, artistManager, statementsManager }: {
  name: string
  data: IStatementData
  artistManager: ArtistsManager
  statementsManager: StatementsManager
}) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [statementArtists, setStatementArtists] = React.useState<string[]>([])
  const [dates, setDates] = React.useState<{fromDate?: string; toDate?: string}>({})
  const [identifiedPlatform, setIdentifiedPlatform] = React.useState<string>()

  React.useEffect(() => {
    setStatementArtists(artistsFromSheetData(rows))
    setDates(statementDatesFromRows(rows))
  }, [rows])

  React.useEffect(() => {
    const platformId = statementsManager.platformIdForHeaders(sheetHeaders)
    setIdentifiedPlatform(platformId)
  }, [sheetHeaders, statementsManager])

  function importStatement() {
    const artistNames = rows.map(({ Artist }) => Artist)
    const { artists } = artistManager.sortNames(artistNames)
    statementsManager.importStatementData({rows, sheetHeaders}, artists)
  }

  return <Box padding={'10px'} border={'1px solix'}>
    <Box style={{backgroundColor: 'lightGrey'}} padding={'5px'}>
      <Button onClick={() => setShowDetails(!showDetails)}>{`File: ${name}`}</Button>
      <Box>
        {identifiedPlatform && <b>{statementsManager.platformForId(identifiedPlatform)?.name}</b>}
        &nbsp;{rows.length} Rows
        &nbsp;{statementArtists.length} Artists
      </Box>
      <Box>{`From ${dates.fromDate} To ${dates.toDate}`}</Box>
    </Box>
    {showDetails && <Box>
      <ArtistsImport manager={artistManager} statementArtists={statementArtists} />
      <PlatformImport
        headers={sheetHeaders}
        statementsManager={statementsManager}
        identifiedPlatform={identifiedPlatform || ''}
      />
    </Box>}
    {identifiedPlatform && <ConfirmCommitButton onClick={importStatement}>Import</ConfirmCommitButton>}
  </Box>
}

function PlatformImport({ headers, statementsManager, identifiedPlatform }: {
  headers: string[]
  statementsManager: StatementsManager
  identifiedPlatform: string
}) {
  const [missingHeaders, setMissingHeaders] = React.useState<string[]>([])
  const [newPlatform, setNewPlatform] = React.useState('')
  const [showImport, setShowImport] = React.useState(false)
  const [selectedPlatform, setSelectedPlatform] = React.useState(identifiedPlatform)
  const [existingPlatforms, setExistingPlatforms] = React.useState<{[id: string]: Platform}>({})

  React.useEffect(() => {
    setMissingHeaders(statementsManager.getMissingHeaders(...headers))
  }, [headers, statementsManager])

  React.useEffect(() => {
    setExistingPlatforms(statementsManager.platformsById)
  }, [statementsManager])

  function importHeaders() {
    statementsManager.importMissingHeaders(...headers).then(() => {
      setMissingHeaders(statementsManager.getMissingHeaders(...headers))
    })
  }

  function addPlatform() {
    statementsManager.createPlatform({ name: newPlatform }).then(() => {
      setExistingPlatforms(statementsManager.platformsById)
    })
  }

  function importStatementHeaders() {
    const platform = existingPlatforms[selectedPlatform]
    if (!platform) return
    statementsManager.addPlatformHeaders(platform, headers)
  }

  return <Box>
    <Box>
      <Button disabled={!!identifiedPlatform} onClick={() => setShowImport(!identifiedPlatform && !showImport)}>
        Platform
      </Button>
      {!!identifiedPlatform && existingPlatforms[identifiedPlatform]?.name}
    </Box>
    {showImport && <Box>
      <TextField value={newPlatform} onChange={({ target }) => setNewPlatform(target.value)}/>
      <Box>
        <ConfirmCommitButton onClick={addPlatform}>Add Platform</ConfirmCommitButton>
        <ConfirmCommitButton disabled={!selectedPlatform} onClick={importStatementHeaders}>Platform Headers</ConfirmCommitButton>
        <Box>{missingHeaders.join(', ')}</Box>
      </Box>
      <Select
        value={selectedPlatform}
        onChange={({ target }) => setSelectedPlatform(target.value as string)}
      >
        {Object.entries(existingPlatforms).map(([id, platform]) => {
          return <MenuItem key={id} value={id}>{platform.name}</MenuItem>
        })}
      </Select>
    </Box>}
    {!!missingHeaders.length && <Box>
      <Box>Unrecognized Headers</Box>
      <Box>{missingHeaders.join(', ')}</Box>
      <Box><ConfirmCommitButton onClick={importHeaders}>Import Headers</ConfirmCommitButton></Box>
    </Box>}
  </Box>
}

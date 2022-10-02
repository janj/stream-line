import React from 'react';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'
import { IStatementData, StatementsData, StatementsSelector } from '../FileSelector';
import { artistsFromSheetData, statementDatesFromRows } from './utility';
import { ArtistsManager, getArtistsManager } from '../artists/ArtistsManager';
import { ArtistsImport } from '../artists/ArtistsImport';
import { ConfirmCommitButton } from '../utility/ConfirmCommitButton';
import { getStatementsManager, StatementsManager } from './StatementsManager'
import { Platform } from './statements';
import { filterExisting, TransactionsManager } from './TransactionsManager'
import { StatementRow } from '../../types/Types'
import { Transaction } from './transactions'
import AutoDisableButton from '../utility/AutoDisableButton'
import { UserContext } from '../contexts'

export function StatementsImport() {
  const [statementData, setStatementData] = React.useState<StatementsData>({})
  const [artistManager, setArtistManager] = React.useState<ArtistsManager>()
  const [statementsManager, setStatementsManager] = React.useState<StatementsManager>()
  const [transactionsManager, setTransactionsManager] = React.useState<TransactionsManager>()

  const { currentUser } = React.useContext(UserContext)

  React.useEffect(() => {
    getArtistsManager().then(setArtistManager)
    getStatementsManager().then(setStatementsManager)
  }, [])

  React.useEffect(() => {
    if (!statementsManager || !artistManager || !currentUser) return
    const artists = Object.values(artistManager.artistsByName)
    setTransactionsManager(new TransactionsManager(currentUser, artists, statementsManager.platforms))
  }, [statementsManager, artistManager, currentUser])

  if (!artistManager || !statementsManager || !transactionsManager) return <Box>Loading...</Box>

  return <Box>
    <Box>Statements Import</Box>
    <Box><StatementsSelector label={'Import File Data'} onStatementsSelect={setStatementData} /></Box>
    <Box>{Object.entries(statementData).map(([name, data]) => {
      return <StatementImport key={name} name={name} data={data} artistManager={artistManager} statementsManager={statementsManager} transactionsManager={transactionsManager} />
    })}</Box>
  </Box>
}

function StatementImport({ name, data: { rows, sheetHeaders }, artistManager, statementsManager, transactionsManager }: {
  name: string
  data: IStatementData
  artistManager: ArtistsManager
  statementsManager: StatementsManager
  transactionsManager: TransactionsManager
}) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [statementArtists, setStatementArtists] = React.useState<string[]>([])
  const [dates, setDates] = React.useState<{fromDate?: string; toDate?: string}>({})
  const [identifiedPlatform, setIdentifiedPlatform] = React.useState<Platform>()

  React.useEffect(() => {
    setStatementArtists(artistsFromSheetData(rows))
    setDates(statementDatesFromRows(rows))
  }, [rows])

  React.useEffect(() => {
    setIdentifiedPlatform(statementsManager.platformForHeaders(sheetHeaders))
  }, [sheetHeaders, statementsManager])

  function importRowsFunc(platform: Platform) {
    return (rows: StatementRow[], completed: (done: number) => void) => transactionsManager.importStatementData(rows, platform, artistManager.artistsByName, completed)
  }

  return <Box padding={'10px'} border={'1px solix'}>
    <Box style={{backgroundColor: 'lightGrey'}} padding={'5px'}>
      <Button onClick={() => setShowDetails(!showDetails)}>{`File: ${name}`}</Button>
      <Box>
        {identifiedPlatform && <b>{identifiedPlatform.name}</b>}
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
        identifiedPlatform={identifiedPlatform}
      />
    </Box>}
    {identifiedPlatform && <ManagedImport
      transactionsManager={transactionsManager}
      platform={identifiedPlatform}
      rows={rows}
      statementsImport={importRowsFunc(identifiedPlatform)}
    />}
  </Box>
}

function ManagedImport({ transactionsManager, platform, rows, statementsImport }: {
  transactionsManager: TransactionsManager
  platform: Platform
  rows: StatementRow[]
  statementsImport: (rows: StatementRow[], progress: (done: number) => void) => Promise<unknown>
}) {
  const [toImport, setToImport] = React.useState<StatementRow[]>([])
  const [toExclude, setToExclude] = React.useState<StatementRow[]>([])
  const [dupTransactions, setDupTransactions] = React.useState<Transaction[]>([])
  const [completed, setCompleted] = React.useState(0)

  function importStatement() {
    return statementsImport(rows, setCompleted).then(() => {
      transactionsManager.getTransactions().then((trx) => {
        const { toImport, toExclude, dupTransactions } = filterExisting(platform, trx, rows)
        setToImport(toImport)
        setToExclude(toExclude)
        setDupTransactions(dupTransactions)
      })
    })
  }

  React.useEffect(() => {
    transactionsManager.getTransactions().then((trx) => {
      const { toImport, toExclude, dupTransactions } = filterExisting(platform, trx, rows)
      setToImport(toImport)
      setToExclude(toExclude)
      setDupTransactions(dupTransactions)
    })
  }, [transactionsManager, platform, rows])

  return <Box>
    <Box>{`Importing ${toImport.length}`}</Box>
    <Box>{`Excluding ${toExclude.length}`}</Box>
    {!!dupTransactions.length && <Box>{`${dupTransactions.length} Existing Dups`}</Box>}
    <AutoDisableButton stayDisabled onClick={importStatement}>Import</AutoDisableButton>
    {!!completed && `${completed} Imported`}
  </Box>
}

function PlatformImport({ headers, statementsManager, identifiedPlatform }: {
  headers: string[]
  statementsManager: StatementsManager
  identifiedPlatform?: Platform
}) {
  const [missingHeaders, setMissingHeaders] = React.useState<string[]>([])
  const [newPlatform, setNewPlatform] = React.useState('')
  const [showImport, setShowImport] = React.useState(false)
  const [selectedPlatform, setSelectedPlatform] = React.useState(identifiedPlatform?.id || '')
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
      {identifiedPlatform?.name}
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

import React from 'react';
import { Box, Button } from '@material-ui/core'
import { IStatementData, StatementsData, StatementsSelector } from '../FileSelector';
import { artistsFromSheetData } from './utility';
import { ArtistsManager, getManager } from '../artists/ArtistsManager';
import { ArtistsImport } from '../artists/ArtistsImport';

export function StatementsImport() {
  const [statementData, setStatementData] = React.useState<StatementsData>({})
  const [artistManager, setArtistManager] = React.useState<ArtistsManager>()

  React.useEffect(() => {
    getManager().then(setArtistManager)
  }, [])

  if (!artistManager) return <Box>Loading...</Box>

  return <Box>
    <Box>Statements Import</Box>
    <Box><StatementsSelector label={'Import File Data'} onStatementsSelect={setStatementData} /></Box>
    <Box>{Object.entries(statementData).map(([name, data]) => {
      return <StatementImport name={name} data={data} artistManager={artistManager} />
    })}</Box>
  </Box>
}

function StatementImport({ name, data: { rows, sheetHeaders }, artistManager }: {
  name: string
  data: IStatementData
  artistManager: ArtistsManager
}) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [statementArtists, setStatementArtists] = React.useState<string[]>([])

  React.useEffect(() => {
    setStatementArtists(artistsFromSheetData(rows))
  }, [rows])

  return <Box>
    <Box>
      <Button onClick={() => setShowDetails(!showDetails)}>{name}</Button>
    </Box>
    {showDetails && <Box>
      <ArtistsImport manager={artistManager} statementArtists={statementArtists} />
      <PlatformImport headers={sheetHeaders} />
    </Box>}
  </Box>
}

function PlatformImport({ headers }: { headers: string[] }) {
  return <Box>{headers.join(', ')}</Box>
}

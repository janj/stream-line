import React from 'react'
import { Box } from '@material-ui/core'
import { StatementsSelector } from '../FileSelector'
import { StatementRow } from '../../Types'
import { artistsFromSheetData } from '../statements/utility'
import { ArtistsImport } from './ArtistsImport'
import { getArtists } from './artist'
import { getMappings } from './artistMapping'
import { ArtistsManager } from './ArtistsManager'

export function Management() {
  const [statementArtists, setStatementArtists] = React.useState<string[]>([])
  const [manager, setManager] = React.useState<ArtistsManager>()

  React.useEffect(() => {
    Promise.all([getArtists(), getMappings()])
      .then(([artists, mappings]) => {
      setManager(new ArtistsManager(artists, mappings))
    })
  }, [])

  function statementImport(data: StatementRow[]) {
    setStatementArtists(artistsFromSheetData(data))
  }

  if (!manager) return <Box>Loading...</Box>

  return <Box>
    <Box>Artist Management</Box>
    <Box><StatementsSelector label={'Import From Statements'} onStatementsSelect={statementImport} /></Box>
    <ArtistsImport manager={manager} statementArtists={statementArtists} />
  </Box>
}

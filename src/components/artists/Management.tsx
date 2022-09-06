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
    getArtists().then((allArtists) => {
      return getMappings(allArtists).then((mappings) => {
        setManager(new ArtistsManager(allArtists, mappings))
      })
    })
  }, [])

  function statementImport(data: StatementRow[]) {
    setStatementArtists(artistsFromSheetData(data))
  }

  if (!manager) return <Box>Loading...</Box>

  return <Box>
    <Box>Artist Management</Box>
    <Box><StatementsSelector label={'Import File Data'} onStatementsSelect={statementImport} /></Box>
    <ArtistsImport manager={manager} statementArtists={statementArtists} />
  </Box>
}

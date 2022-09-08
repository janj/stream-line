import React from 'react'
import { Box } from '@material-ui/core'
import { StatementsData, StatementsSelector } from '../FileSelector'
import { StatementRow } from '../../types/Types'
import { artistsFromSheetData } from '../statements/utility'
import { ArtistsImport } from './ArtistsImport'
import { ArtistsManager, getManager } from './ArtistsManager'

export function Management() {
  const [statementArtists, setStatementArtists] = React.useState<string[]>([])
  const [manager, setManager] = React.useState<ArtistsManager>()

  React.useEffect(() => {
    getManager().then(setManager)
  }, [])

  function statementImport(data: StatementsData) {
    const allRows = Object.values(data).reduce((acc: StatementRow[], { rows }) => {
      acc.push(...rows)
      return acc
    }, [])
    setStatementArtists(artistsFromSheetData(allRows))
  }

  if (!manager) return <Box>Loading...</Box>

  return <Box>
    <Box>Artist Management</Box>
    <Box><StatementsSelector label={'Import File Data'} onStatementsSelect={statementImport} /></Box>
    <ArtistsImport manager={manager} statementArtists={statementArtists} />
  </Box>
}

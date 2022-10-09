import { useState, useEffect } from 'react';
import { Box } from '@mui/material'
import { StatementsData, StatementsSelector } from '../FileSelector'
import { StatementRow } from '../../types/Types'
import { artistsFromSheetData } from '../statements/utility'
import { ArtistsImport } from './ArtistsImport'
import { ArtistsManager, getArtistsManager } from './ArtistsManager'

export function Management() {
  const [statementArtists, setStatementArtists] = useState<string[]>([])
  const [manager, setManager] = useState<ArtistsManager>()

  useEffect(() => {
    getArtistsManager().then(setManager)
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

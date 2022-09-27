import React from 'react'
import { ITransactionData, StatementRow } from '../types/Types'
import { StatementsData, StatementsSelector } from './FileSelector'
import TrackDetails from './transactionViews/TrackDetails'
import Retailers from './transactionViews/Retailers'
import Locations from './transactionViews/Locations'
import { Box } from '@mui/material'
import { getMappings, IArtistMapping } from './artists/artistMapping'
import { getArtists } from './artists/artist'

function toTransactionData(statementRow: StatementRow): ITransactionData {
  return {
    artistName: statementRow.Artist,
    platformName: statementRow.Distributor,
    trackTitle: statementRow.TrackTitle,
    date: statementRow.Date,
    revenue: +statementRow.Revenue,
    isrc: statementRow.ISRC,
    territory: statementRow.Territory,
    quantity: +statementRow.Quantity
  }
}

function mapArtists(rows: StatementRow[], mapping: {[name: string]: IArtistMapping}) {
  return rows.map((row) => {
    row.Artist = mapping[row.Artist]?.mappedTo.name || row.Artist
    return row
  }).map(toTransactionData)
}

export default function Home() {
  const [sheet, setSheet] = React.useState<ITransactionData[]>([])
  const [mappings, setMappings] = React.useState<{[name: string]: IArtistMapping}>()

  React.useState(() => {
    getArtists().then((allArtists) => {
      getMappings(allArtists).then(setMappings)
    })
  })

  if (!mappings) return <Box>Loading...</Box>

  function onStatementsSelect(data: StatementsData) {
    const allRows = Object.values(data).reduce((acc: StatementRow[], { rows }) => {
      acc.push(...rows)
      return acc
    }, [])
    if (!mappings) {
      setSheet(allRows.map(toTransactionData))
    } else {
      setSheet(mapArtists(allRows, mappings))
    }
  }

  return <Box style={{ padding: 25 }}>
    <Box>Upload statement files to see graphs, log in to store statements.</Box>
    <Box style={{ padding: 25 }}>
      <StatementsSelector onStatementsSelect={onStatementsSelect} />
    </Box>
    {!!sheet.length && <Box style={{ padding: 25, border: 'solid 1px' }}>
      Tracks
      <div style={{ padding: 25 }}>
        <TrackDetails transactions={sheet} />
      </div>
      Retailers
      <div style={{ padding: 25 }}>
        <Retailers transactions={sheet} />
      </div>
      Locations
      <div style={{ padding: 25 }}>
        <Locations transactions={sheet} />
      </div>
    </Box>
    }
  </Box>
}

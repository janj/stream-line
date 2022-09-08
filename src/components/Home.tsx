import React from 'react'
import { StatementRow } from '../types/Types'
import { StatementsData, StatementsSelector } from './FileSelector'
import TrackDetails from './TrackDetails'
import Retailers from './Retailers'
import Locations from './Locations'
import { Box } from '@material-ui/core'
import { getMappings, IArtistMapping } from './artists/artistMapping'
import { getArtists, mapArtists } from './artists/artist'

export default function Home() {
  const [sheet, setSheet] = React.useState<StatementRow[]>([])
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
      setSheet(allRows)
    } else {
      setSheet(mapArtists(allRows, mappings))
    }
  }

  return <Box style={{ padding: 25 }}>
    <Box style={{ padding: 25 }}>
      <StatementsSelector onStatementsSelect={onStatementsSelect} />
    </Box>
    {!!sheet.length && <Box style={{ padding: 25, border: 'solid 1px' }}>
      Tracks
      <div style={{ padding: 25 }}>
        <TrackDetails sheet={sheet} />
      </div>
      Retailers
      <div style={{ padding: 25 }}>
        <Retailers sheet={sheet} />
      </div>
      Locations
      <div style={{ padding: 25 }}>
        <Locations sheet={sheet} />
      </div>
    </Box>
    }
  </Box>
}

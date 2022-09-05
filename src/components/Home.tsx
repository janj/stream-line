import React from 'react'
import { StatementRow } from '../Types'
import { StatementsSelector } from './FileSelector'
import TrackDetails from './TrackDetails'
import Retailers from './Retailers'
import Locations from './Locations'
import { Box } from '@material-ui/core'

export default function Home() {
  const [sheet, setSheet] = React.useState<StatementRow[]>([])

  return <Box style={{ padding: 25 }}>
    <Box style={{ padding: 25 }}>
      <StatementsSelector onStatementsSelect={setSheet} />
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

import React from 'react';
import { AmpSheetRow } from '../Types'
import { loadAMPsuite } from './Helpers'
import FileSelector from './FileSelector'
import TrackDetails from './TrackDetails'
import Retailers from './Retailers'
import Locations from './Locations'

export default function Home() {
  const [sheet, setSheet] = React.useState<AmpSheetRow[]>([])

  function fileSelected(data: any) {
    const rows: AmpSheetRow[] = []
    Object.values(data).forEach((sheetData) => {
      rows.push(...loadAMPsuite(sheetData))
    })
    setSheet(rows)
  }

  return <div style={{ padding: 25 }}>
    <div style={{ padding: 25 }}>
      <FileSelector onLoad={fileSelected} />
    </div>
    {!!sheet.length && <div style={{ padding: 25, border: 'solid 1px' }}>
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
    </div>
    }
  </div>
}

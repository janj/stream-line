import { DataGrid, GridColDef, GridRowData, GridRowsProp } from '@material-ui/data-grid'
import { AmpSheetRow } from '../Types'
import { getByIsrc } from './Helpers'

export default function TrackDetails({ sheet }: { sheet: AmpSheetRow[]}) {
  const cols: GridColDef[] = [
    { field: 'col1', headerName: 'Title', width: 150 },
    { field: 'col2', headerName: 'Quantity', width: 150 },
    { field: 'col3', headerName: 'Revenue', width: 150 }
  ]

  const byIsrc = getByIsrc(sheet)
  const rows: GridRowsProp = Object.keys(byIsrc).map((isrc, i) => {
    const data: GridRowData = { id: i }
    byIsrc[isrc].forEach((track) => {
      data.col1 = track.TrackTitle
      !data.col2 && (data.col2 = 0)
      data.col2 += track.Quantity
      !data.col3 && (data.col3 = 0)
      data.col3 += track.Revenue
    })
    return data
  })

  return <div style={{ height: 300, width: '100%' }}>
    <DataGrid rows={rows} columns={cols}></DataGrid>
  </div>
}

import { DataGrid, GridColDef, GridRowData, GridRowsProp } from '@material-ui/data-grid'
import { StatementRow } from '../types/Types'
import { getByIsrc } from './Helpers'

export default function TrackDetails({ sheet }: { sheet: StatementRow[]}) {
  const cols: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'artist', headerName: 'Artist', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 150 },
    { field: 'revenue', headerName: 'Revenue', width: 150 }
  ]

  const byIsrc = getByIsrc(sheet)
  const rows: GridRowsProp = Object.keys(byIsrc).map((isrc, i) => {
    const data: GridRowData = { id: i }
    byIsrc[isrc].forEach((track) => {
      data.title = track.TrackTitle
      !data.quantity && (data.quantity = 0)
      data.quantity += track.Quantity
      !data.revenue && (data.revenue = 0)
      data.revenue += track.Revenue
      data.artist = track.Artist
    })
    return data
  })

  return <div style={{ height: 300, width: '100%' }}>
    <DataGrid rows={rows} columns={cols}></DataGrid>
  </div>
}

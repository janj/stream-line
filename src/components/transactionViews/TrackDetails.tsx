import { DataGrid, GridColDef, GridRowData, GridRowsProp } from '@material-ui/data-grid'
import { getByIsrc } from '../Helpers'
import { ITransactionData } from '../../types/Types'

const cols: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 150 },
  { field: 'artist', headerName: 'Artist', width: 150 },
  { field: 'quantity', headerName: 'Quantity', width: 150 },
  { field: 'revenue', headerName: 'Revenue', width: 150 }
]

export default function TrackDetails({ transactions }: { transactions: ITransactionData[]}) {
  const byIsrc = getByIsrc(transactions)
  const rows: GridRowsProp = Object.keys(byIsrc).map((isrc, i) => {
    const data: GridRowData = { id: i }
    byIsrc[isrc].forEach((track) => {
      data.title = track.trackTitle
      !data.quantity && (data.quantity = 0)
      data.quantity += track.quantity
      !data.revenue && (data.revenue = 0)
      data.revenue += track.revenue
      data.artist = track.artistName
    })
    return data
  })

  return <div style={{ height: 300, width: '100%' }}>
    <DataGrid rows={rows} columns={cols}></DataGrid>
  </div>
}

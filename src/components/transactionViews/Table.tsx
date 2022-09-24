import React from 'react'
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import { ITransactionData } from '../../types/Types'

const gridCols: GridColDef[] = [
  {field: 'date', headerName: 'Date', width: 150},
  {field: 'artistName', headerName: 'Artist', width: 150},
  {field: 'platformName', headerName: 'Platform', width: 150},
  {field: 'quantity', headerName: 'Quantity', width: 150},
  {field: 'trackTitle', headerName: 'Track', width: 150},
  {field: 'revenue', headerName: 'Revenue', width: 150}
]

export function TransactionsTable({ transactions }: { transactions: ITransactionData[] }) {
  return <div style={{ height: 450, width: '100%' }}>
    <DataGrid rows={transactions} columns={gridCols}></DataGrid>
  </div>
}

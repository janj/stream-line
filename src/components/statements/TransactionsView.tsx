import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from '@mui/material'
import { getTransactionsCount, Transaction } from './transactions'
import { getTransactionManager, TransactionsManager } from './TransactionsManager'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const cols: [string, (t: Transaction) => string][] = [
  ['Date', ({ date }) => date],
  ['Artist', ({ artist }) => artist?.name],
  ['Platform', ({ platform }) => platform?.name],
  ['Quantity', ({ quantity }) => quantity],
  ['Track', ({ trackTitle }) => trackTitle],
  ['Revenue', ({ revenue }) => revenue]
]

export function TransactionsView() {
  const [manager, setManager] = React.useState<TransactionsManager>()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [minDate, setMinDate] = React.useState<Date>()
  const [maxDate, setMaxDate] = React.useState<Date>()
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()

  React.useEffect(() => {
    getTransactionManager().then((manager) => {
      setManager(manager)
      manager.getTransactions().then((sorted) => {
        const firstDate = sorted.find(({ date }) => !!date)?.date
        const lastDate = sorted.pop()?.date
        setMinDate(new Date(firstDate))
        setMaxDate(new Date(lastDate))
        setStartDate(new Date(firstDate))
        setEndDate(new Date(lastDate))
        setTransactions(sorted)
      })
    })
    getTransactionsCount().then(setTotalCount)
  }, [])

  return <Box>
    <Box padding={'10px'}>Transactions {totalCount}</Box>
    <DatePicker
      value={startDate}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(e) => console.log(e)}
      renderInput={(params) => <TextField {...params} />}
    />
    <TransactionsTable transactions={transactions} />
  </Box>
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          {cols.map(([label], i) => <TableCell key={i}>{label}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((t, i) => {
          return <TableRow key={i}>
            {cols.map(([_, transform], i) => <TableCell key={i}>{transform((t))}</TableCell>)}
          </TableRow>
        })}
      </TableBody>
    </Table>
  </TableContainer>
}
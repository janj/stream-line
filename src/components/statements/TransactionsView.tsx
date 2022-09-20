import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { getTransactionsCount, Transaction } from './transactions'
import { getTransactionManager, TransactionsManager } from './TransactionsManager'

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
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()

  React.useEffect(() => {
    getTransactionManager().then((manager) => {
      setManager(manager)
      manager.getTransactions().then((sorted) => {
        const firstDate = sorted.find(({ date }) => !!date)?.date
        const lastDate = sorted.pop()?.date
        setStartDate(new Date(firstDate))
        setEndDate(new Date(lastDate))
        setTransactions(sorted)
      })
    })
    getTransactionsCount().then(setTotalCount)
  }, [])

  return <Box>
    <Box padding={'10px'}>Transactions {totalCount}</Box>
    {/*<StaticDateRangePicker />*/}
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
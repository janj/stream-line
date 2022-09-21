import React from 'react'
import {
  Box,
  Button,
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

const cols: [string, (t: Transaction) => string][] = [
  ['Date', ({ date }) => date],
  ['Artist', ({ artist }) => artist?.name],
  ['Platform', ({ platform }) => platform?.name],
  ['Quantity', ({ quantity }) => quantity],
  ['Track', ({ trackTitle }) => trackTitle],
  ['Revenue', ({ revenue }) => revenue]
]


function Pagination({
  total,
  batchSize = 100,
  onRangeChange
}: {
  total: number
  batchSize?: number
  onRangeChange: (r: { start: number; end: number }) => void
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const getEnd = () => {
    return Math.min(currentIndex + batchSize, total)
  }

  React.useEffect(() => {
    setCurrentIndex(0)
  }, [total])

  React.useEffect(() => {
    onRangeChange({
      start: currentIndex,
      end: getEnd()
    })
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [currentIndex])

  const goNext = () => {
    if (total < currentIndex + batchSize) return
    setCurrentIndex(currentIndex + batchSize)
  }

  const goPrev = () => {
    const prev = Math.max(0, currentIndex - batchSize)
    setCurrentIndex(prev)
  }
  return (
    <Box>
      <Button onClick={goPrev}>{'<'}</Button>
      {`${currentIndex} to ${getEnd()} of ${total}`}
      <Button onClick={goNext}>{'>'}</Button>
    </Box>
  )
}


export function TransactionsView() {
  const [manager, setManager] = React.useState<TransactionsManager>()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [minDate, setMinDate] = React.useState<Date>()
  const [maxDate, setMaxDate] = React.useState<Date>()
  const [startDate, setStartDate] = React.useState<Date | null>()
  const [endDate, setEndDate] = React.useState<Date | null>()
  const [currentSet, setCurrenctSet] = React.useState<Transaction[]>([])

  React.useEffect(() => {
    getTransactionManager().then((manager) => {
      setManager(manager)
      manager.getTransactions().then((sorted) => {
        const firstDate = sorted.find(({ date }) => !!date)?.date
        const lastDate = sorted.pop()?.date
        setMinDate(firstDate)
        setMaxDate(lastDate)
        setStartDate(firstDate)
        setEndDate(lastDate)
        setTransactions(sorted)
      })
    })
    getTransactionsCount().then(setTotalCount)
  }, [])

  React.useEffect(() => {
    let startIndex = 0
    if (startDate) {
      const first = transactions.find(({ date }) => {
        const asDate = new Date(date)
        return asDate >= startDate
      })
      if (first) {
        startIndex = transactions.indexOf(first)
      }
    }
    let endIndex = transactions.length - 1
    if (endDate) {
      const last = transactions.slice().reverse().find(({ date }) => {
        const asDate = new Date(date)
        return asDate <= endDate
      })
      if (last) {
        endIndex = transactions.indexOf(last)
      }
    }
    setCurrenctSet(transactions.slice(startIndex, endIndex))
  }, [startDate, endDate])

  return <Box>
    <Box padding={'10px'}>Transactions {totalCount}</Box>
    <DatePicker
      value={startDate}
      minDate={minDate}
      maxDate={maxDate}
      onChange={setStartDate}
      renderInput={(params) => <TextField {...params} />}
    />
    To
    <DatePicker
      value={endDate}
      minDate={minDate}
      maxDate={maxDate}
      onChange={setEndDate}
      renderInput={(params) => <TextField {...params} />}
    />
    <TransactionsTable transactions={currentSet} />
  </Box>
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [range, setRange] = React.useState({start: 0, end: transactions.length})
  return <Box>
    <Pagination total={transactions.length} onRangeChange={setRange} />
    <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          {cols.map(([label], i) => <TableCell key={i}>{label}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.slice(range.start, range.end).map((t, i) => {
          return <TableRow key={i}>
            {cols.map(([_, transform], i) => <TableCell key={i}>{transform((t))}</TableCell>)}
          </TableRow>
        })}
      </TableBody>
    </Table>
  </TableContainer>
  </Box>
}
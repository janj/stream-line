import React from 'react'
import {
  Box,
  TextField
} from '@mui/material'
import { getTransactionsCount, Transaction } from './transactions'
import { getTransactionManager, TransactionsManager } from './TransactionsManager'
import { DatePicker } from '@mui/x-date-pickers'
import { TransactionsTable } from '../transactionViews/Table'
import TrackDetails from '../transactionViews/TrackDetails'
import Locations from '../transactionViews/Locations'
import Retailers from '../transactionViews/Retailers'


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
  }, [startDate, endDate, transactions, setCurrenctSet])

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
    <Box style={{ padding: 25, border: 'solid 1px' }}>
      {[
        ['All Transactions', TransactionsTable],
        ['Tracks', TrackDetails],
        ['Locations', Locations],
        ['Retailers', Retailers]
      ].map(([label, Component]) => <Box padding={'25px'}>
        <Box padding={'5px'}><b>{label}</b></Box>
        <Component transactions={currentSet} />
      </Box>)
      }
    </Box>
  </Box>
}

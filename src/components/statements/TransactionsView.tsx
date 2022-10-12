import { useState, useContext, useEffect } from 'react';
import { Box } from '@mui/material'
import { getTransactionsCount, Transaction } from './transactions'
import { getTransactionManager } from './TransactionsManager'
import { TransactionsTable } from '../transactionViews/Table'
import TrackDetails from '../transactionViews/TrackDetails'
import Locations from '../transactionViews/Locations'
import Retailers from '../transactionViews/Retailers'
import DateRange, { IDateRange } from '../utility/DateRange'
import { UserContext } from '../contexts'

export function TransactionsView() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [minDate, setMinDate] = useState<Date>()
  const [maxDate, setMaxDate] = useState<Date>()
  const [currentSet, setCurrenctSet] = useState<Transaction[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<IDateRange>({})

  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    if (!currentUser) return
    getTransactionManager(currentUser).then((manager) => {
      manager.getTransactions().then((sorted) => {
        const startDate = sorted.find(({ date }) => !!date)?.date
        const endDate = sorted.pop()?.date
        setMinDate(startDate)
        setMaxDate(endDate)
        setSelectedDateRange({ startDate, endDate })
        setTransactions(sorted)
      })
    })
    getTransactionsCount(currentUser).then(setTotalCount)
  }, [currentUser])

  useEffect(() => {
    let startIndex = 0
    const { startDate, endDate } = selectedDateRange
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
  }, [selectedDateRange, transactions, setCurrenctSet])

  return <Box>
    <Box padding={'10px'}>Transactions {totalCount}</Box>
    <DateRange dateRange={selectedDateRange} minDate={minDate} maxDate={maxDate} onRangeChange={setSelectedDateRange} />
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

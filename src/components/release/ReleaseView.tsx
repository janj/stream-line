import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { getRelease, IRelease } from '../label/release'
import { getReleaseTransactions, Transaction } from '../statements/transactions'
import { TransactionsTable } from '../transactionViews/Table'
import Edit from './Edit'

export default function ReleaseView({ release: releaseId }: { release: string }) {
  const [release, setRelease] = useState<IRelease>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    getRelease(releaseId).then(setRelease)
  }, [releaseId])

  async function loadTransactions() {
    if (!release) return

    getReleaseTransactions(release).then(setTransactions)
  }

  if (!release) return <Box>Loading...</Box>

  return <Box>
    <Box>Release</Box>
    <Box>{release.name}</Box>
    <Box><Button onClick={loadTransactions}>Load</Button></Box>
    <TransactionsTable transactions={transactions} />
    <Box><Button onClick={() => setEditing(!editing)}>Edit</Button></Box>
    {editing && <Edit release={release} />}
  </Box>
}

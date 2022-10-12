import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { getRelease, IRelease } from '../label/release'
import { getReleaseTransactions, Transaction } from '../statements/transactions'
import { TransactionsTable } from '../transactionViews/Table'
import Edit from './Edit'
import { IArtist } from '../artists/artist'

export default function ReleaseView({ release: releaseId }: { release: string }) {
  const [release, setRelease] = useState<IRelease>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editing, setEditing] = useState(false)
  const [artists, setArtists] = useState<{[id: string]: IArtist}>({})

  useEffect(() => {
    getRelease(releaseId).then(setRelease)
  }, [releaseId])

  useEffect(() => {
    const artists = transactions.reduce((acc: {[id: string]: IArtist}, trx) => {
      const artist = trx.artist
      artist && (acc[artist.id] = artist)
      return acc
    }, {})
    setArtists(artists)
  }, [transactions])

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
    {editing && <Edit release={release} artists={artists} />}
    {!editing && <DetailsView release={release} />}
  </Box>
}

function DetailsView({ release }: { release: IRelease }) {
  const [releaseArtists, setReleaseArtists] = useState<IArtist[]>([])

  useEffect(() => {
    if (!release) return
    release.artists().then(setReleaseArtists)
  }, [release])

  return <Box>
    <Box>{releaseArtists.map((a) => a.name).join(', ')}</Box>
    <Box>
      {Object.entries(release.releaseIds).map(([idType, ids]) => {
        return <Box key={idType}><b>{idType}</b>{` ${ids.join(', ')}`}</Box>
      })}
    </Box>
  </Box>
}

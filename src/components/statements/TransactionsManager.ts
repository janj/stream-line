import { Artist, getArtists } from '../artists/artist'
import { getPlatforms, Platform } from './statements'
import { getAllTransactions, Transaction } from './transactions'

export async function getTransactionManager() {
  const [artits, platforms] = await Promise.all([
    getArtists(),
    getPlatforms()
  ])
  return new TransactionsManager(artits, platforms)
}

export class TransactionsManager {
  allArtists: {[id: string]: Artist}
  allPlatforms: {[id: string]: Platform}
  transactions: Transaction[] | undefined

  constructor(allArtists: Artist[], allPlatforms: Platform[]) {
    this.allArtists = allArtists.reduce((acc: {[id: string]: Artist}, a) => {
      acc[a.id] = a
      return acc
    }, {})
    this.allPlatforms = allPlatforms.reduce((acc: {[id: string]: Artist}, p) => {
      acc[p.id] = p
      return acc
    }, {})
  }

  getTransactions() {
    if (this.transactions) return Promise.resolve(this.transactions)
    return getAllTransactions(this.allArtists, this.allPlatforms).then((transactions) => {
      this.transactions = transactions
      return transactions
    })
  }
}

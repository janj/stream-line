import { Artist, getArtists } from '../artists/artist'
import { getPlatforms, Platform } from './statements'
import {
  createTransaction,
  getAllTransactions,
  statementIdentifier,
  Transaction
} from './transactions'
import { StatementRow } from '../../types/Types'
import { IArtistsByName } from '../artists/ArtistsManager'

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
  transactionsPromise: Promise<Transaction[]> | undefined
  addedTransactions: Transaction[]

  constructor(allArtists: Artist[], allPlatforms: Platform[]) {
    this.allArtists = allArtists.reduce((acc: {[id: string]: Artist}, a) => {
      acc[a.id] = a
      return acc
    }, {})
    this.allPlatforms = allPlatforms.reduce((acc: {[id: string]: Artist}, p) => {
      acc[p.id] = p
      return acc
    }, {})
    this.addedTransactions = []
  }

  getTransactions() {
    if (this.transactionsPromise) return this.transactionsPromise
    this.transactionsPromise = getAllTransactions(this.allArtists, this.allPlatforms)
      .then((trx) => [...trx, ...this.addedTransactions])
    return this.transactionsPromise
  }

  importStatementData(rows: StatementRow[], platform: Platform, artists: IArtistsByName, completed: (done: number) => void) {
    const params = rows.map((row) => {
      return {
        platform,
        artist: artists[row.Artist],
        row
      }
    })
    return params.reduce((acc, params, index) => {
      return acc.then(() => {
        return createTransaction(params).then((newTransaction) => {
          completed(index + 1)
          this.addedTransactions.push(newTransaction)
        })
      })
    }, Promise.resolve())
  }
}

export function filterExisting(platform: Platform, allTransactions: Transaction[], newTransactions: StatementRow[]) {
  const toImport: StatementRow[] = []
  const toExclude: StatementRow[] = []
  const dupTransactions: Transaction[] = []
  const ids = allTransactions.reduce((acc: string[], transaction) => {
    if (transaction.platform.id !== platform.id) {
      return acc
    }
    const key = transaction.identifier
    if (acc.includes(key)) {
      dupTransactions.push(transaction)
      return acc
    }
    acc.push(key)
    return acc
  }, [])
  newTransactions.forEach((transaction) => {
    const key = statementIdentifier(transaction)
    if (ids.includes(key)) {
      toExclude.push(transaction)
    } else {
      toImport.push(transaction)
    }
  })
  return { toImport, toExclude, dupTransactions }
}

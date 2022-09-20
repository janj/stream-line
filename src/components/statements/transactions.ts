import Parse from 'parse'
import { StatementRow } from "../../types/Types"
import { Artist, IArtist } from "../artists/artist"
import { ParseObj } from "../parseObj"
import { Platform } from "./statements"

const transactionKey = 'Transaction'

export class Transaction  extends ParseObj {
  artist: Artist | undefined
  platform: Platform

  constructor({parseObj, artist, platform}: {
    parseObj: Parse.Object
    artist?: Artist
    platform: Platform
  }) {
    super(parseObj)
    this.artist = artist
    this.platform = platform
  }

  get distributor() {
    return this.parseObj.get('distributor')
  }
  get upc() {
    return this.parseObj.get('upc')
  }
  get from() {
    return this.parseObj.get('from')
  }
  get quantity() {
    return this.parseObj.get('quantity')
  }
  get trackTitle() {
    return this.parseObj.get('trackTitle')
  }
  get releaseTitle() {
    return this.parseObj.get('releaseTitle')
  }
  get contentType() {
    return this.parseObj.get('contentType')
  }
  get territory() {
    return this.parseObj.get('territory')
  }
  get isrc() {
    return this.parseObj.get('isrc')
  }
  get to() {
    return this.parseObj.get('to')
  }
  get date() {
    return this.parseObj.get('date')
  }
  get revenue() {
    return this.parseObj.get('revenue')
  }
}

export function createTransaction({ platform, artist, row }: {
  platform: Platform
  artist: IArtist
  row: StatementRow
}) {
  const user = Parse.User.current()
  if (!user) return Promise.resolve()
  const params = {
    user,
    artist,
    platform,
    contentType: row.ContentType,
    distributor: row.Distributor,
    isrc: row.ISRC,
    from: row.PeriodFrom,
    to: row.PeriodTo,
    quantity: +row.Quantity,
    releaseTitle: row.ReleaseTitle,
    revenue: +row.Revenue,
    territory: row.Territory,
    trackTitle: row.TrackTitle,
    upc: row.UPC.toString(),
    date: row.Date || row.PeriodFrom
  }
  const transaction = new Parse.Object(transactionKey, params)
  return transaction.save().then((parseObj) => new Transaction({parseObj, artist, platform}))
}

type SortedTransactions = {
  [platformId: string]: Transaction[]
}

function dateSort(t1: Transaction, t2: Transaction) {
  const d1 = t1.date || t1.from
  const d2 = t2.date || t2.from
  return d1.localeCompare(d2)
}

export async function getSortedTransactions(artists: {[id: string]: Artist}, platforms: {[id: string]: Platform}) {
  const user = Parse.User.current()
  if (!user) return
  const query = new Parse.Query(transactionKey).equalTo('user', user).limit(500)
  const transactions = await query.find()
  const sorted = transactions.reduce((acc: SortedTransactions, parseObj) => {
    const artistId = parseObj.get('artist').parseObj.id
    const platformId = parseObj.get('platform').parseObj.id
    const params = {
      parseObj,
      artist: artists[artistId],
      platform: platforms[platformId]
    }
    const transaction = new Transaction(params)
    if (!acc[platformId]) acc[platformId] = []
    acc[platformId].push(transaction)
    return acc
  }, {})
  return Object.entries(sorted).reduce((acc: SortedTransactions, [pid, transactions]) => {
    acc[pid] = transactions.sort(dateSort)
    return acc
  }, {})
}

// export async function getTransactionArtists() {
//   const data = await Parse.Cloud.run("transactionData");
//   console.log('transactionData', data)
// }

const transactionLimit = 10000

export async function getAllTransactions(
  artists: {[id: string]: Artist},
  platforms: {[id: string]: Platform},
  skip: number = 0
): Promise<Transaction[]> {
  const user = Parse.User.current
  const query = new Parse.Query(transactionKey)
    .equalTo('user', user)
    .ascending('date').limit(transactionLimit)
    .skip(skip)
  return query.find().then((parseObjs) => {
    const transactions = parseObjs.map((parseObj, i, orig) => {
      if (i === 0) console.log(orig.length)
      const artistObj = parseObj.get('artist')
      let artist: Artist | undefined
      if (artistObj) artist = artists[artistObj.parseObj.id]
      const platform = platforms[parseObj.get('platform').parseObj.id]
      return new Transaction({ parseObj, artist, platform })
    })
    if (transactions.length < skip + transactionLimit) {
      return transactions
    }
    return getAllTransactions(artists, platforms, transactions.length).then((rest) => {
      transactions.push(...rest)
      return transactions
    })
  })
}

export async function getTransactionsCount() {
  const user = Parse.User.current
  const query = new Parse.Query(transactionKey).equalTo('user', user)
  return query.count()
}

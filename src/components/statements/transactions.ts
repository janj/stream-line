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

  get distributor(): string {
    return this.parseObj.get('distributor')
  }
  get upc(): string {
    return this.parseObj.get('upc')
  }
  get from() {
    return this.parseObj.get('from')
  }
  get quantity(): number {
    return this.parseObj.get('quantity')
  }
  get trackTitle(): string {
    return this.parseObj.get('trackTitle')
  }
  get releaseTitle(): string {
    return this.parseObj.get('releaseTitle')
  }
  get contentType(): string {
    return this.parseObj.get('contentType')
  }
  get territory(): string {
    return this.parseObj.get('territory')
  }
  get isrc(): string {
    return this.parseObj.get('isrc')
  }
  get to() {
    return this.parseObj.get('to')
  }
  get date() {
    return this.parseObj.get('date')
  }
  get revenue(): number {
    return this.parseObj.get('revenue')
  }
  get artistName(): string {
    return this.artist?.name
  }
  get platformName(): string {
    return this.platform.name
  }
  get identifier(): string {
    return [
      this.upc,
      this.isrc,
      this.date,
      this.distributor,
      this.revenue,
      this.territory,
      this.contentType,
      this.quantity
  ].join(':')
  }
}

export function statementIdentifier(row: StatementRow) {
  return [
    row.UPC,
    row.ISRC,
    row.Date || row.PeriodFrom,
    row.Distributor,
    +row.Revenue,
    row.Territory,
    row.ContentType,
    +row.Quantity
  ].join(':')
}

export function createTransaction({ platform, artist, row }: {
  platform: Platform
  artist: IArtist
  row: StatementRow
}) {
  const user = Parse.User.current()
  if (!user) return Promise.reject()
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

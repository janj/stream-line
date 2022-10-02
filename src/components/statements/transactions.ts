import { StatementRow } from "../../types/Types"
import { IArtist } from "../artists/artist"
import {
  ParseObj,
  BaseObject,
  createNewObject,
  createQuery
} from '../../types/parseObj'
import { Platform } from "./statements"
import { User } from '../login/utility'

const transactionKey = 'Transaction'

export class Transaction  extends ParseObj {
  artist: IArtist | undefined
  platform: Platform

  constructor({parseObj, artist, platform}: {
    parseObj: BaseObject
    artist?: IArtist
    platform: Platform
  }) {
    super(parseObj)
    this.artist = artist
    this.platform = platform
  }

  get distributor(): string {
    return this.getProperty('distributor')
  }
  get upc(): string {
    return this.getProperty('upc')
  }
  get from() {
    return this.getProperty('from')
  }
  get quantity(): number {
    return this.getProperty('quantity')
  }
  get trackTitle(): string {
    return this.getProperty('trackTitle')
  }
  get releaseTitle(): string {
    return this.getProperty('releaseTitle')
  }
  get contentType(): string {
    return this.getProperty('contentType')
  }
  get territory(): string {
    return this.getProperty('territory')
  }
  get isrc(): string {
    return this.getProperty('isrc')
  }
  get to() {
    return this.getProperty('to')
  }
  get date() {
    return this.getProperty('date')
  }
  get revenue(): number {
    return this.getProperty('revenue')
  }
  get artistName(): string | undefined {
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

export function createTransaction({ user, platform, artist, row }: {
  user: User
  platform: Platform
  artist: IArtist
  row: StatementRow
}) {
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
  const transaction = createNewObject(transactionKey, params)
  return transaction.save().then((parseObj) => new Transaction({parseObj, artist, platform}))
}

const transactionLimit = 10000

export async function getAllTransactions(
  user: User,
  artists: {[id: string]: IArtist},
  platforms: {[id: string]: Platform},
  skip: number = 0
): Promise<Transaction[]> {
  const query = createQuery(transactionKey)
    .equalTo('user', user)
    .ascending('date').limit(transactionLimit)
    .skip(skip)
  return query.find().then((parseObjs) => {
    const transactions = parseObjs.map((parseObj, i, orig) => {
      if (i === 0) console.log(orig.length)
      const artistObj = parseObj.get('artist')
      let artist: IArtist | undefined
      if (artistObj) artist = artists[artistObj.parseObj.id]
      const platform = platforms[parseObj.get('platform').parseObj.id]
      return new Transaction({ parseObj, artist, platform })
    })
    if (transactions.length < skip + transactionLimit) {
      return transactions
    }
    return getAllTransactions(user, artists, platforms, transactions.length).then((rest) => {
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

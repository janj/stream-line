import { StatementRow } from '../../types/Types'
import { getArtists, IArtist } from '../artists/artist'
import {
  WrappedObj,
  createNewObject,
  createQuery,
  orQuery
} from '../../parse/parseObj'
import { getPlatforms, Platform } from './statements'
import { BaseObject, ObjectQuery, User } from '../../parse/types'
import moment from 'moment'
import { IRelease } from '../label/release'

const transactionKey = 'Transaction'

export class Transaction  extends WrappedObj {
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
  get from(): Date {
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
  get to(): Date {
    return this.getProperty('to')
  }
  get date(): Date {
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
  get dateString(): string {
    return this.date && moment(this.date).format('YYYY-MM-DD')
  }
  get identifier(): string {
    return [
      this.upc,
      this.isrc,
      this.dateString,
      this.distributor,
      this.revenue,
      this.territory,
      this.contentType,
      this.quantity
  ].join(':')
  }
}

export function statementIdentifier(row: StatementRow) {
  const date = row.Date || row.PeriodFrom
  const dateString = date && moment(date).format('YYYY-MM-DD')
  return [
    row.UPC,
    row.ISRC,
    dateString,
    row.Distributor,
    +row.Revenue,
    row.Territory,
    row.ContentType,
    +row.Quantity
  ].join(':')
}

export async function createTransaction({ user, platform, artist, row }: {
  user: User
  platform: Platform
  artist?: IArtist
  row: StatementRow
}) {
  const params = {
    user,
    artist: artist?.parseObj,
    platform: platform.parseObj,
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
  const parseObj = await transaction.save()
  return new Transaction({parseObj, artist, platform})
}

const transactionLimit = 10000

function byId<T extends { id: string }>(objs: T[]) {
  return objs.reduce((acc: {[id: string]: T}, obj) => {
    acc[obj.id] = obj
    return acc
  }, {})
}

function mapTransactionParseObjs(parseObjs: BaseObject[], artists: IArtist[], platforms: Platform[]) {
  const artistsById = byId(artists)
  const platformsById = byId(platforms)
  return parseObjs.map((parseObj) => {
    const artistObj = parseObj.get('artist')
    let artist: IArtist | undefined
    if (artistObj) artist = artistsById[artistObj.id]
    const platformObj = parseObj.get('platform')
    const platform = platformsById[platformObj.id]
    return new Transaction({ parseObj, artist, platform })
  })
}

export async function getAllTransactions(
  user: User,
  artists: IArtist[],
  platforms: Platform[],
  skip: number = 0
): Promise<Transaction[]> {
  const query = createQuery(transactionKey)
    .equalTo('user', user)
    .ascending('date').limit(transactionLimit)
    .skip(skip)
  const parseObjs = await query.find()
  const transactions = mapTransactionParseObjs(parseObjs, artists, platforms)
  if (transactions.length < skip + transactionLimit) {
    return transactions
  }
  const rest = await getAllTransactions(user, artists, platforms, transactions.length)
  transactions.push(...rest)
  return transactions
}

export async function getTransactionsCount(user: User) {
  const query = createQuery(transactionKey).equalTo('user', user)
  return query.count()
}

export async function getReleaseTransactions(release: IRelease) {
  const [artists, platforms] = await Promise.all([
    getArtists(),
    getPlatforms()
  ])
  const ids = release.releaseIds
  const queries = Object.entries(ids).reduce((acc: ObjectQuery[], [idType, idsForType]) => {
    idsForType.forEach((id: string) => {
      const query = createQuery(transactionKey)
      query.equalTo(idType, id)
      acc.push(query)
    })
    return acc
  }, [])
  const result = await orQuery(...queries).find()
  return mapTransactionParseObjs(result, artists, platforms)
}

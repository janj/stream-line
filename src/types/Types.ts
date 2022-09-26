import { HL } from "./headerLabels"

export interface StatementRow {
  Artist: string
  ContentType: string
  DeliveryMethod: string  // not stored
  Distributor: string
  ISRC: string
  Label: string // not stored
  PeriodFrom: string
  PeriodTo: string
  Quantity: number
  ReleaseTitle: string
  Revenue: number
  Territory: string
  TrackTitle: string
  UPC: string
  Date: string
}

export const statementColMap: {[key: string]: string[]} = {
  Artist: [HL.artist],
  ContentType: [HL.contentType],
  DeliveryMethod: [HL.deliveryMethod, HL.product],
  Distributor: [HL.distributor, HL.store, HL.service],
  ISRC: [HL.isrc],
  Label: [HL.label],
  PeriodFrom: [HL.periodFrom, HL.salesStartDate],
  PeriodTo: [HL.periodTo, HL.salesEndDate],
  Quantity: [HL.quantity, HL.totalPlays],
  ReleaseTitle: [HL.releaseTitle, HL.albumName, HL.release],
  Revenue: [HL.revenue, HL.amount],
  Territory: [HL.territory, HL.countryIso],
  TrackTitle: [HL.trackTitle, HL.trackName, HL.track],

  Date: [HL.date, HL.royaltyDate],
  UPC: [HL.upc, HL.eanUpc],
  CountryName: [HL.countryName],
  TotalDownloads: [HL.totalDownloads],
  AmountCurrency: [HL.amountCurrency, HL.total],

  Ignore: [HL.catNo, HL.suitebeatsComp, HL.transactionDate, HL.split, HL.type, HL.source]
}

export interface ITransactionData {
  date: string
  artistName: string
  platformName: string
  quantity: number
  trackTitle: string
  revenue: number
  isrc: string
  territory: string
}

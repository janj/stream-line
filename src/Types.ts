export interface StatementRow {
  Artist: string
  ContentType: string
  DeliveryMethod: string
  Distributor: string
  ISRC: string
  Label: string
  PeriodFrom: string
  PeriodTo: string
  Quantity: number
  ReleaseTitle: string
  Revenue: number
  Territory: string
  TrackTitle: string
  UPC: string
}

export const statementColMap: {[key: string]: string[]} = {
  Artist: ['artist'],
  ContentType: ['content type'],
  DeliveryMethod: ['delivery method'],
  Distributor: ['distributor', 'store'],
  ISRC: ['isrc'],
  Label: ['label'],
  PeriodFrom: ['period from', 'sales start date'],
  PeriodTo: ['period to', 'sales end date'],
  Quantity: ['quantity', 'total plays'],
  ReleaseTitle: ['release title', 'album name'],
  Revenue: ['revenue', 'amount'],
  Territory: ['territory', 'country iso'],
  TrackTitle: ['track title', 'track name'],

  Date: ['date'],
  UPC: ['upc', 'ean/upc'],
  CountryName: ['country name'],
  TotalDownloads: ['total downloads'],
  AmountCurrency: ['amount currency'],

  Ignore: ['cat. no.', 'suitebeats comp.']
}

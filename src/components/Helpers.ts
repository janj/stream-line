import * as XLSX from 'xlsx'
import { AmpSheetRow } from '../Types'

interface AmpSheetRaw {
  Artist: string
  'Content Type': string
  'Delivery Method': string
  Distributor: string
  ISRC: string
  Label: string
  'Period From': string
  'Period To': string
  Quantity: string
  'Release Title': string
  Revenue: number
  'Suitebeats Comp.': string
  'Territory': string
  'Track Title': string
  UPC: string
}

function toAmpSheet(rowObj: AmpSheetRaw) {
  return {
    Artist: rowObj.Artist,
    ContentType: rowObj['Content Type'],
    DeliveryMethod: rowObj['Delivery Method'],
    Distributor: rowObj.Distributor,
    ISRC: rowObj.ISRC,
    Label: rowObj.Label,
    PeriodFrom: rowObj['Period From'],
    PeriodTo: rowObj['Period To'],
    Quantity: parseInt(rowObj.Quantity),
    ReleaseTitle: rowObj['Release Title'],
    Revenue: rowObj.Revenue,
    SuitebeatsComp: rowObj['Suitebeats Comp.'],
    Territory: rowObj.Territory,
    TrackTitle: rowObj['Track Title'],
    UPC: rowObj.UPC
  }
}

export function loadAMPsuite(data: any): AmpSheetRow[] {
  const workbook = XLSX.read(data, {
    type: 'binary'
  });
  const sheetName = workbook.SheetNames[0]
  const workSheet = workbook.Sheets[sheetName]
  const sheetRange = XLSX.utils.decode_range(workSheet['!ref']!)
  const testJson = XLSX.utils.sheet_to_csv(workSheet, { RS: '\n'})
  let startIndex = 0
  testJson.split('\n').some((row, index) => {
    const fullCols = row.split(',').filter((h) => !!h)
    // the first row with more than 10 cols is hopefully header row
    if (fullCols.length > 10 && !startIndex) {
      startIndex = index
      return
    }
  })
  const asJson = XLSX.utils.sheet_to_json<AmpSheetRaw>(workSheet, { range: { s: { c:0, r:startIndex }, e: sheetRange.e}})
  return asJson.map(toAmpSheet)
}

export function getByIsrc(data: AmpSheetRow[]) {
  return getMultiByKeyProp('ISRC', data)
}

export function getByTerritory(data: AmpSheetRow[]) {
  return getMultiByKeyProp('Territory', data)
}

export function getByArtist(data: AmpSheetRow[]) {
  return getMultiByKeyProp('Artist', data)
}

export function getByRetailer(data: AmpSheetRow[]) {
  return getMultiByKeyProp('Distributor', data)
}

export function getByLocation(data: AmpSheetRow[]) {
  return getMultiByKeyProp('Territory', data)
}

export function getMultiByKeyProp(key: keyof AmpSheetRow, data: AmpSheetRow[]) {
  const byKeyProp: {[key: string]: AmpSheetRow[]} = {}
  data.forEach((row) => {
    !byKeyProp[row[key]] && (byKeyProp[row[key]] = [])
    byKeyProp[row[key]].push(row)
  })
  return byKeyProp
}

export function consolidateRvByDate(data: AmpSheetRow[]) {
  const byDate: { [key: string]: number } = {}
  data?.forEach((d) => {
    !byDate[d.PeriodTo] && (byDate[d.PeriodTo] = 0)
    byDate[d.PeriodTo] += d.Revenue
  })
  return byDate
}

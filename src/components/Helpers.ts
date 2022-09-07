import * as XLSX from 'xlsx'
import { statementColMap, StatementRow } from '../Types'

function toStatement(rowObj: {[key: string]: string}): StatementRow {
  const dataObj: {[key: string]: string} = {}
  Object.keys(rowObj).forEach((col) => {
    const objKey = Object.keys(statementColMap).find((key) => {
      return statementColMap[key].includes(col.toLowerCase())
    })
    if (!objKey) {
      console.log('not mapping:', col, rowObj[col])
    } else if (objKey !== 'Ignore') {
      dataObj[objKey] = rowObj[col]
    }
  })
  return dataObj as unknown as StatementRow
}

export function loadStatementFile(data: string): StatementRow[] {
  const testCols = Object.values(statementColMap).reduce((acc: string[], cols) => {
    acc.push(...cols)
    return acc
  }, [])
  const workbook = XLSX.read(data, {
    type: 'binary'
  });
  const sheetName = workbook.SheetNames[0]
  const workSheet = workbook.Sheets[sheetName]
  const sheetRange = XLSX.utils.decode_range(workSheet['!ref']!)
  const testJson = XLSX.utils.sheet_to_csv(workSheet, { RS: '\n'})
  let startIndex = -1
  testJson.split('\n').forEach((row, index) => {
    if (startIndex >= 0) return
    const fullCols = row.split(',').filter((h) => !!h)
    const cols = fullCols.filter((col) => testCols.includes(col.toLowerCase()))
    if (cols.length > fullCols.length / 2) {
      startIndex = index
    }
  })
  if (startIndex < 0) {
    throw new Error('header row not found')
  }

  const asJson = XLSX.utils.sheet_to_json<{[key: string]: string}>(workSheet, { range: { s: { c:0, r:startIndex }, e: sheetRange.e}})
  return asJson.map(toStatement)
}

export function getByIsrc(data: StatementRow[]) {
  return getMultiByKeyProp('ISRC', data)
}

export function getByTerritory(data: StatementRow[]) {
  return getMultiByKeyProp('Territory', data)
}

export function getByArtist(data: StatementRow[]) {
  return getMultiByKeyProp('Artist', data)
}

export function getByRetailer(data: StatementRow[]) {
  return getMultiByKeyProp('Distributor', data)
}

export function getByLocation(data: StatementRow[]) {
  return getMultiByKeyProp('Territory', data)
}

export function getMultiByKeyProp(key: keyof StatementRow, data: StatementRow[]) {
  const byKeyProp: {[key: string]: StatementRow[]} = {}
  data.forEach((row) => {
    !byKeyProp[row[key]] && (byKeyProp[row[key]] = [])
    byKeyProp[row[key]].push(row)
  })
  return byKeyProp
}

export function consolidateRvByDate(data: StatementRow[]) {
  const byDate: { [key: string]: number } = {}
  data?.forEach((d) => {
    !byDate[d.PeriodTo] && (byDate[d.PeriodTo] = 0)
    byDate[d.PeriodTo] += d.Revenue
  })
  return byDate
}

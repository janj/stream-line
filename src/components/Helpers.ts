import * as XLSX from 'xlsx'
import { ITransactionData, statementColMap, StatementRow } from '../types/Types'

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

export function loadStatementFile(data: string): { sheetHeaders: string[]; rows: StatementRow[] } {
  const testCols = Object.values(statementColMap).reduce((acc: string[], cols) => {
    acc.push(...cols)
    return acc
  }, [])
  const workbook = XLSX.read(data, {
    type: 'binary',
    raw: true
  });
  const sheetName = workbook.SheetNames[0]
  const workSheet = workbook.Sheets[sheetName]
  const sheetRange = XLSX.utils.decode_range(workSheet['!ref']!)
  const testJson = XLSX.utils.sheet_to_csv(workSheet, { RS: '\n'})
  const sheetHeaders: string[] = []
  let startIndex = -1
  testJson.split('\n').forEach((row, index) => {
    if (startIndex >= 0) return
    const fullCols = row.split(',').filter((h) => !!h)
    const cols = fullCols.filter((col) => testCols.includes(col.toLowerCase()))
    if (cols.length > fullCols.length / 2) {
      startIndex = index
      sheetHeaders.push(...fullCols)
    }
  })
  if (startIndex < 0) {
    throw new Error('header row not found')
  }

  const asJson = XLSX.utils.sheet_to_json<{[key: string]: string}>(workSheet, { range: { s: { c:0, r:startIndex }, e: sheetRange.e}})
  const rows = asJson.map(toStatement)
  return { sheetHeaders, rows }
}

export function getByIsrc(data: ITransactionData[]) {
  return getMultiByKeyProp('isrc', data)
}

export function getByRetailer(data: ITransactionData[]) {
  return getMultiByKeyProp('platformName', data)
}

export function getByLocation(data: ITransactionData[]) {
  return getMultiByKeyProp('territory', data)
}

export function getMultiByKeyProp(key: keyof ITransactionData, data: ITransactionData[]) {
  const byKeyProp: {[key: string]: ITransactionData[]} = {}
  data.forEach((row) => {
    const rowValue = row[key]
    if (!rowValue) return
    !byKeyProp[rowValue] && (byKeyProp[rowValue] = [])
    byKeyProp[rowValue].push(row)
  })
  return byKeyProp
}

export function arrayMatchSort<T>(toMatch: T[]) {
  return (a: T[], b: T[]) => {
    const aMatch = a.filter((item) => toMatch.includes(item)).length
    const bMatch = b.filter((item) => toMatch.includes(item)).length
    return bMatch - aMatch
  }
}

import { arrayMatchSort } from "../Helpers";
import {
  createHeader,
  createPlatform,
  createPlatformHeader,
  getPlatformHeaders,
  getPlatforms,
  getStatementHeaders,
  Platform,
  PlatformHeader,
  StatementHeader
} from "./statements";

export function getStatementsManager() {
  return Promise.all([
    getStatementHeaders(),
    getPlatforms(),
    getPlatformHeaders()
  ]).then(([headers, platforms, platformHeaders]) => {
    return new StatementsManager(headers, platforms, platformHeaders)
  })
}

export class StatementsManager {
  headers: {[id: string]: StatementHeader}
  platforms: Platform[]
  platformHeaders: {[id: string]: string[]}

  constructor(
    existingHeaders: StatementHeader[],
    existingPlatforms: Platform[],
    platformHeaders: PlatformHeader[]
  ) {
    this.headers = existingHeaders.reduce((acc: { [id: string]: StatementHeader }, header) => {
      acc[header.id] = header
      return acc
    }, {})
    this.platforms = existingPlatforms

    this.platformHeaders = platformHeaders.reduce((acc: { [key: string]: string[] }, ph) => {
      if (!acc[ph.platformId]) acc[ph.platformId] = []
      acc[ph.platformId].push(ph.headerId)
      return acc
    }, {})
  }

  importMissingHeaders(...labels: string[]) {
    return this.getMissingHeaders(...labels).reduce((acc: Promise<void>, label) => {
      return acc.then(() => {
        return createHeader(label).then((header) => {
          this.headers[header.id] = header
        })
      })
    }, Promise.resolve())
  }

  getMissingHeaders(...labels: string[]) {
    const existing = Object.values(this.headers).map((h) => h.label)
    return labels.filter((h) => !existing.includes(h))
  }
  
  createPlatform(params: { name: string }) {
    return createPlatform(params).then((platform) => {
      this.platforms.push(platform)
    })
  }
  
  get platformsById() {
    const byId = this.platforms.reduce((acc: {[id: string]: Platform}, platform) => {
      acc[platform.id] = platform
      return acc
    }, {})
    return byId
  }
  
  addPlatformHeaders(platform: Platform, headers: string[]) {
    const byLabel = Object.values(this.headers).reduce((acc: {[key: string]: StatementHeader}, header) => {
      acc[header.label] = header
      return acc
    }, {})
    return headers.reduce((acc: StatementHeader[], header) => {
      const ph = byLabel[header]
      ph && acc.push(ph)
      return acc
    }, []).reduce((acc, header, index, orig) => {
      if (index === 0) {
      }
      return acc.then(() => {
        return createPlatformHeader(platform, header)
      })
    }, Promise.resolve())
  }
  
  platformForHeaders(headers: string[]) {
    const byLabel = Object.values(this.headers).reduce((acc: {[key: string]: StatementHeader}, header) => {
      acc[header.label] = header
      return acc
    }, {})
    const headerIds = headers.reduce((acc: string[], header) => {
      const parseObj = byLabel[header]
      parseObj && acc.push(parseObj.id)
      return acc
    }, [])
    const sortFunc = arrayMatchSort<string>(headerIds)
    const entrySort = ([_a, aIds]: [unknown, string[]], [_b, bIds]: [unknown, string[]]) => sortFunc(aIds, bIds)
    const [bestMatch] = Object.entries(this.platformHeaders).sort(entrySort)
    if (bestMatch) {
      return this.platforms.find((p) => p.id === bestMatch[0])
    }
  }
}

import { IArtistsByName } from "../artists/ArtistsManager";
import { IStatementData } from "../FileSelector";
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
import { createTransaction } from "./transactions";

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
    const existing = this.platformHeaders[platform.id].map((hid) => this.headers[hid].label)
    const byLabel = Object.values(this.headers).reduce((acc: {[key: string]: StatementHeader}, header) => {
      acc[header.label] = header
      return acc
    }, {})
    return headers.filter((h) => !existing.includes(h)).reduce((acc: StatementHeader[], header) => {
      const ph = byLabel[header]
      ph && acc.push(ph)
      return acc
    }, []).reduce((acc, header) => {
      return acc.then(() => {
        return createPlatformHeader(platform, header).then((newHeader) => {
          this.platformHeaders[platform.id].push(newHeader.headerId)
        })
      })
    }, Promise.resolve())
  }

  platformIdForHeaders(headers: string[]) {
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
      const [id, ids] = bestMatch
      const missing = headerIds.filter((id) => !ids.includes(id))
      if (missing.length) {
        return
      }
      return id
    }
  }
  
  platformForId(platformId: string) {
    return this.platforms.find((p) => p.id === platformId)
  }

  importStatementData({ rows, sheetHeaders }: IStatementData, artists: IArtistsByName) {
    const platformId = this.platformIdForHeaders(sheetHeaders)
    if (!platformId) return
    const platform = this.platformForId(platformId) as Platform
    const params = rows.map((row) => {
      return {
        platform,
        artist: artists[row.Artist],
        row
      }
    })
    params.reduce((acc, params) => {
      return acc.then(() => {
        return createTransaction(params).then(() => {})
      })
    }, Promise.resolve())
  }
}

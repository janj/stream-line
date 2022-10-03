import { createNewObject, createQuery, ParseObj } from '../../parse/parseObj'

const statementHeadersKey = 'StatementHeaders'
const platformKey = 'Platform'
const platformHeadersKey = 'PlatformHeaders'

export class StatementHeader extends ParseObj {
  get label() {
    return this.parseObj.get('label')
  }
}

export class Platform extends ParseObj {
  get name() {
    return this.parseObj.get('name')
  }
}

export class PlatformHeader extends ParseObj {
  get platformId() {
    return this.parseObj.get('platform').id
  }
  get headerId() {
    return this.parseObj.get('header').id
  }
}

export async function createHeader(label: string) {
  const header = createNewObject(statementHeadersKey, { label })
  return header.save().then((obj) => new StatementHeader(obj))
}

export async function getStatementHeaders() {
  const query = createQuery(statementHeadersKey)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new StatementHeader(obj)))
}

export async function createPlatform(params: { name: string }) {
  const platform = createNewObject(platformKey, params)
  return platform.save().then((obj) => new Platform(obj))
}

export async function getPlatforms() {
  const query = createQuery(platformKey)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new Platform(obj)))
}

export async function getPlatformsById() {
  const platforms = await getPlatforms()
  return platforms.reduce((acc: {[id: string]: Platform}, platform) => {
    acc[platform.id] = platform
    return acc
  }, {})
}

export async function createPlatformHeader(platform: Platform, header: StatementHeader) {
  const platformHeader = createNewObject(platformHeadersKey, { platform, header })
  return platformHeader.save().then((obj) => new PlatformHeader(obj))
}

export async function getPlatformHeaders() {
  const query = createQuery(platformHeadersKey)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new PlatformHeader(obj)))
}

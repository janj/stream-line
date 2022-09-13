import Parse from 'parse'
import { ParseObj } from "../parseObj"

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
    return this.parseObj.get('platform').parseObj.id
  }
  get headerId() {
    return this.parseObj.get('header').parseObj.id
  }
}

export async function createHeader(label: string) {
  const header = new Parse.Object(statementHeadersKey, { label })
  return header.save().then((obj) => new StatementHeader(obj))
}

export async function getStatementHeaders() {
  const query = new Parse.Query(statementHeadersKey)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new StatementHeader(obj)))
}

export async function createPlatform(params: { name: string }) {
  const platform = new Parse.Object(platformKey, params)
  return platform.save().then((obj) => new Platform(obj))
}

export async function getPlatforms() {
  const query = new Parse.Query(platformKey)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new Platform(obj)))
}

export async function createPlatformHeader(platform: Platform, header: StatementHeader) {
  const platformHeader = new Parse.Object(platformHeadersKey, { platform, header })
  platformHeader.save().then((obj) => new PlatformHeader(obj))
}

export async function getPlatformHeaders() {
  const query = new Parse.Query(platformHeadersKey)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new PlatformHeader(obj)))
}

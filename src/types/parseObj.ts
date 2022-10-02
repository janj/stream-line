import Parse from 'parse'

export type BaseObject = Parse.Object
export type ObjectQuery = Parse.Query

export interface IParseObj {
  parseObj: BaseObject
}

export class ParseObj {
  parseObj: BaseObject
  constructor(parseObj: BaseObject) {
    this.parseObj = parseObj
  }
  get id() {
    return this.parseObj.id
  }

  getProperty(propKey: string) {
    return this.parseObj.get(propKey)
  }
}

export function createNewObject(objectType: string, params: { [key: string]: unknown }): BaseObject {
  return new Parse.Object(objectType, params)
}

export function createQuery(objectType: string) {
  return new Parse.Query(objectType)
}
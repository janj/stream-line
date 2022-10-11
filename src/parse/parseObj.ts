import Parse from 'parse'
import { BaseObject, ObjectQuery, User } from './types'

export interface IWrappedObj {
  parseObj: BaseObject
}

export class WrappedObj {
  parseObj: BaseObject
  constructor(parseObj: BaseObject) {
    this.parseObj = parseObj
  }
  async save() {
    const newObj = await this.parseObj.save()
    this.parseObj = newObj
  }

  get id() {
    return this.parseObj.id
  }

  getProperty(propKey: string) {
    return this.parseObj.get(propKey)
  }

  setProperty(propKey: string, value: any) {
    const result = this.parseObj.set(propKey, value)
    if (result) this.parseObj = result
    return result
  }
}

export function getCurrentUser(): User | undefined {
  return Parse.User.current()
}

export function createNewObject(objectType: string, params?: { [key: string]: unknown }): BaseObject {
  return new Parse.Object(objectType, params)
}

export function createQuery(objectType: string) {
  return new Parse.Query(objectType)
}

export function orQuery(...queries: ObjectQuery[]) {
  return Parse.Query.or(...queries)
}
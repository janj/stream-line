import Parse from 'parse'

export interface IParseObj {
  parseObj: Parse.Object
}

export class ParseObj {
  parseObj: Parse.Object
  constructor(parseObj: Parse.Object) {
    this.parseObj = parseObj
  }
}

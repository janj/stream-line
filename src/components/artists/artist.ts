import Parse from 'parse'
import { IParseObj, ParseObj } from '../parseObj'

const className = 'Artist'

export interface IArtist extends IParseObj{
  name: string
}

export class Artist extends ParseObj {
  get name() {
    return this.parseObj.get('name')
  }
}

export async function getArtists() {
  const query = new Parse.Query(className)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new Artist(obj)))
}

export async function createArtist({ name }: { name: string }) {
  const artist = new Parse.Object(className, { name })
  return artist.save().then((parseObj) => new Artist(parseObj))
}

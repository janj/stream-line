import Parse from 'parse'
import { ParseObj } from '../parseObj'
import { Artist, IArtist } from './artist'

const className = 'ArtistMapping'

export interface IArtistMapping {
  name: string
  mappedTo: IArtist
}

class ArtistMapping extends ParseObj {
  get name() {
    return this.parseObj.get('name')
  }
  get mappedTo() {
    return new Artist(this.parseObj.get('mappedTo'))
  }
}

export async function getMappings() {
  const query = new Parse.Query(className)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new ArtistMapping(obj)))
}

export async function createMapping({ name, mappedTo }: {
  name: string
  mappedTo: IArtist
}): Promise<IArtistMapping> {
  const mapping = new Parse.Object(className, { name, mappedTo: mappedTo.parseObj })
  return mapping.save().then((parseObj) => new ArtistMapping(parseObj))
}

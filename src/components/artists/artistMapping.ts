import Parse from 'parse'
import { ParseObj } from '../parseObj'
import { IArtist } from './artist'

const className = 'ArtistMapping'

export interface IArtistMapping {
  name: string
  mappedTo: IArtist
}

class ArtistMapping extends ParseObj {
  artist: IArtist

  constructor(parseObj: Parse.Object, artist: IArtist) {
    super(parseObj)
    this.artist = artist
  }

  get name() {
    return this.parseObj.get('name')
  }
  get mappedTo() {
    return this.artist
  }
}

export async function getMappings(allArtists: IArtist[]) {
  const byId = allArtists.reduce((acc: {[id: string]: IArtist}, artist) => {
    acc[artist.id] = artist
    return acc
  }, {})
  const query = new Parse.Query(className)
  return query.find()
    .then((parseObjs) => {
      return parseObjs.reduce((acc: {[n: string]: IArtistMapping}, parseObj) => {
        const artist = new ArtistMapping(parseObj, byId[parseObj.get('mappedTo').id])
        acc[artist.name] = artist
        return acc
      }, {})
    })
}

export async function createMapping({ name, mappedTo }: {
  name: string
  mappedTo: IArtist
}): Promise<IArtistMapping> {
  const mapping = new Parse.Object(className, { name, mappedTo: mappedTo.parseObj })
  return mapping.save().then((parseObj) => new ArtistMapping(parseObj, mappedTo))
}
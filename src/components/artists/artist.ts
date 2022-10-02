import { createNewObject, createQuery, IParseObj, ParseObj } from '../../parse/parseObj'

const className = 'Artist'

export interface IArtist extends IParseObj{
  id: string
  name: string
}

export class Artist extends ParseObj {
  get name() {
    return this.parseObj.get('name')
  }
}

export async function getArtists() {
  const query = createQuery(className)
  return query.find().then((parseObjs) => parseObjs.map((obj) => new Artist(obj)))
}

export async function getArtistsById() {
  const artists = await getArtists()
  return artists.reduce((acc: {[id: string]: Artist}, artist) => {
    acc[artist.id] = artist
    return acc
  }, {})
}

export async function createArtist({ name }: { name: string }) {
  const artist = createNewObject(className, { name })
  return artist.save().then((parseObj) => new Artist(parseObj))
}

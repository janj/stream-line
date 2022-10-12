import { createNewObject, createQuery, IWrappedObj, WrappedObj } from '../../parse/parseObj'
import { ObjectRelation } from '../../parse/types'

const className = 'Artist'

export interface IArtist extends IWrappedObj{
  id: string
  name: string
}

class Artist extends WrappedObj {
  get name() {
    return this.parseObj.get('name')
  }
}

export async function getArtistFromRelation(artistRelation: ObjectRelation): Promise<IArtist[]> {
  const result = await artistRelation.query().find()
  return result.map((parseObj) => new Artist(parseObj))
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

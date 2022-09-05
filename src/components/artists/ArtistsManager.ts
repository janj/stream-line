import { createMapping, IArtistMapping } from './artistMapping'
import { createArtist, IArtist } from './artist'

export class ArtistsManager {
  artistsByName: {[name: string]: IArtist}
  mappingsByName: {[name: string]: IArtistMapping}

  constructor(existingArtists: IArtist[], existingMappings: IArtistMapping[]) {
    this.artistsByName = existingArtists.reduce((acc: {[name: string]: IArtist}, artist) => {
      acc[artist.name] = artist
      return acc
    }, {})
    this.mappingsByName = existingMappings.reduce((acc: {[name: string]: IArtistMapping}, mapping) => {
      acc[mapping.name] = mapping
      return acc
    }, {})
  }

  createArtist(params: { name: string }) {
    return createArtist(params).then((newArtist) => {
      this.artistsByName[newArtist.name] = newArtist
      return newArtist
    })
  }

  createMapping(params: { name: string, mappedTo: IArtist}) {
    return createMapping(params).then((newMapping) => {
      this.mappingsByName[newMapping.name] = newMapping
      return newMapping
    })
  }

  artistForName(name: string) {
    return this.artistsByName[name]
  }
}

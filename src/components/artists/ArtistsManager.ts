import { createMapping, IArtistMapping } from './artistMapping'
import { createArtist, IArtist } from './artist'

export type IArtistsByName = {
  [name: string]: IArtist
}

export type IMappingsByName = {
  [name: string]: IArtistMapping
}

interface INameSort {
  artists: IArtistsByName
  mapped: IMappingsByName
  neither: string[]
}

export class ArtistsManager {
  artistsByName: {[name: string]: IArtist}
  mappingsByName: {[name: string]: IArtistMapping}

  constructor(existingArtists: IArtist[], existingMappings: {[name: string]: IArtistMapping}) {
    this.artistsByName = existingArtists.reduce((acc: {[name: string]: IArtist}, artist) => {
      acc[artist.name] = artist
      return acc
    }, {})
    this.mappingsByName = existingMappings
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
  mappingForName(name: string) {
    return this.mappingsByName[name]
  }

  sortNames(names: string[]) {
    return names.reduce(({artists, mapped, neither}: INameSort, name) => {
      if (this.artistsByName[name]) {
        artists[name] = this.artistsByName[name]
      } else if (this.mappingsByName[name]) {
        mapped[name] = this.mappingsByName[name]
      } else {
        neither.push(name)
      }
      return {artists, mapped, neither}
    }, {artists: {}, mapped: {}, neither: []})
  }
}

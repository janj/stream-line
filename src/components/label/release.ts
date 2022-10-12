import { createNewObject, createQuery, IWrappedObj, WrappedObj } from '../../parse/parseObj'
import { ILabel } from './label'
import { getArtistFromRelation, IArtist } from '../artists/artist'

const releaseKey = 'Release'

export enum ReleaseIdType {
  ISRC = 'isrc',
  UPC = 'upc'
}

enum Properties {
  Label = 'label',
  Name = 'name',
  ReleaseIds = 'releaseIds',
  Artists = 'artists'
}

export interface IReleaseIds {
  [ReleaseIdType.ISRC]: string[]
  [ReleaseIdType.UPC]: string[]
}

export interface IRelease extends IWrappedObj{
  id: string
  name: string
  releaseIds: IReleaseIds
  addReleaseId(idType: ReleaseIdType, value: string): Promise<IReleaseIds>
  removeReleaseId(idType: ReleaseIdType, value: string): Promise<IReleaseIds>
  updateName(newName: string): Promise<void>
  artists(): Promise<IArtist[]>
  addArtist(artist: IArtist): Promise<void>
}

class Release extends WrappedObj implements IRelease{
  artistsPromise: Promise<IArtist[]> | undefined
  addedArtists: IArtist[] = []

  get name(): string {
    return this.getProperty(Properties.Name)
  }

  async updateName(newName: string) {
    this.setProperty(Properties.Name, newName)
    return this.save()
  }

  get releaseIds() {
    let releaseIds = this.getProperty(Properties.ReleaseIds)
    if (!releaseIds) {
      releaseIds = {
        [ReleaseIdType.UPC]: [],
        [ReleaseIdType.ISRC]: []
      }
    }
    return releaseIds
  }

  async artists() {
    if (!this.artistsPromise) {
      const relation = this.getProperty(Properties.Artists)
      this.artistsPromise = getArtistFromRelation(relation)
    }
    return this.artistsPromise.then((artists) => [...artists, ...this.addedArtists])
  }

  async addReleaseId(idType: ReleaseIdType, value: string) {
    const ids = this.releaseIds
    if (ids[idType].includes(value)) return ids
    ids[idType].push(value)
    this.setProperty(Properties.ReleaseIds, ids)
    await this.save()
    return this.releaseIds
  }

  async removeReleaseId(idType: ReleaseIdType, value: string) {
    const ids = this.releaseIds
    ids[idType] = ids[idType].filter((rid: string) => rid !== value)
    this.setProperty(Properties.ReleaseIds, ids)
    await this.save()
    return this.releaseIds
  }

  async addArtist(artist: IArtist) {
    const relation = this.getRelation(Properties.Artists)
    relation.add(artist.parseObj)
    await this.save()
    this.addedArtists.push(artist)
  }
}

async function createRelease(label: ILabel, { name }: { name: string }) {
  const params = { label: label.parseObj, name }
  const release = createNewObject(releaseKey, params)
  const newObj = await release.save()
  return new Release(newObj)
}

export async function getRelease(releaseId: string): Promise<Release> {
  const query = createQuery(releaseKey)
  return query.get(releaseId).then((obj) => new Release(obj))
}

async function getAllReleases(label: ILabel): Promise<Release[]> {
  const query = createQuery(releaseKey)
  query.equalTo(Properties.Label, label.parseObj)
  const baseObjs = await query.find()
  return baseObjs.map((obj) => new Release(obj))
}

export async function getReleaseManager(label: ILabel) {
  const all = await getAllReleases(label)
  return new ReleaseManager(label, all)
}

export class ReleaseManager {
  label: ILabel
  releases: IRelease[]
  constructor(label: ILabel, allReleases: IRelease[]) {
    this.label = label
    this.releases = allReleases
  }

  async createRelease(name: string) {
    const newRelease = await createRelease(this.label, { name })
    this.releases.push(newRelease)
    return newRelease
  }
}

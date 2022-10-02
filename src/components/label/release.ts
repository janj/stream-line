import Parse from 'parse'
import { createNewObject, createQuery, IParseObj, ParseObj } from '../../parse/parseObj'
import { ILabel } from './label'

const releaseKey = 'Release'

export interface IRelease extends IParseObj{
  id: string
  name: string
}

class Release extends ParseObj {
  get name(): string {
    return this.getProperty('name')
  }
}

export async function createRelease(label: ILabel, { name }: { name: string }) {
  const params = { label: label.parseObj, name }
  const release = createNewObject(releaseKey, params)
  const newObj = await release.save()
  return new Release(newObj)
}

export async function getAllReleases(label: ILabel): Promise<Release[]> {
  const query = createQuery(releaseKey)
  query.equalTo('label', label.parseObj)
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
  }
}

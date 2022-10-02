import { ParseObj, createNewObject, createQuery, IParseObj } from '../../parse/parseObj'
import { User } from '../../parse/types'

const labelKey = 'Label'

export interface ILabel extends IParseObj{
  id: string
  name: string
}

class Label extends ParseObj {
  get name(): string {
    return this.getProperty('name')
  }
}

export async function createLabel(user: User, { name }: { name: string }) {
  const params = { user, name }
  const label = createNewObject(labelKey, params)
  const newObj = await label.save()
  return new Label(newObj)
}

export async function getAllLabels(user: User): Promise<Label[]> {
  const query = createQuery(labelKey)
    .equalTo('user', user)
  const baseObjs = await query.find()
  return baseObjs.map((obj) => new Label(obj))
}

export async function getLabelManager(user: User) {
  const all = await getAllLabels(user)
  return new LabelManager(user, all)
}

export class LabelManager {
  user: User
  allLabels: {[id: string]: ILabel}
  constructor(user: User, allLabels: ILabel[]) {
    this.user = user
    this.allLabels = allLabels.reduce((acc: {[k: string]: ILabel}, label) => {
      acc[label.id] = label
      return acc
    }, {})
  }

  async createLabel(name: string) {
    const newLabel = await createLabel(this.user, { name })
    this.allLabels[newLabel.id] = newLabel
  }

  forId(id: string) {
    if (id in this.allLabels) return this.allLabels[id]
  }
}

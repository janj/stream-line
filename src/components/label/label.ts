import { ParseObj, createNewObject, createQuery } from '../../parse/parseObj'
import { User } from '../../parse/types'

const labelKey = 'Label'

export interface ILabel {
  name: string
}

export class Label extends ParseObj {
  get name(): string {
    return this.parseObj.get('name')
  }
}

export async function createLabel(user: User, { name }: { name: string }) {
  if (!user) return Promise.reject()
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
  allLabels: ILabel[]
  constructor(user: User, allLabels: ILabel[]) {
    this.user = user
    this.allLabels = allLabels
  }

  async createLabel(name: string) {
    const newLabel = await createLabel(this.user, { name })
    this.allLabels = [...this.allLabels, newLabel]
  }
}

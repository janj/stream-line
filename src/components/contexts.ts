import React from 'react'
import { LabelManager } from './label/label'
import { User } from '../parse/types'

export const UserContext = React.createContext<{
  currentUser: User | undefined
  userLogin: (u: string, pw: string) => void
  userRegister: (u: string, pw: string) => void
  userLogout: () => void
}>({
  currentUser: undefined,
  userLogin: () => {},
  userRegister: () => {},
  userLogout: () => {}
})

export interface IUserDataContext {
  labelManager?: LabelManager
}

export const UserDataContext = React.createContext<IUserDataContext>({})

export enum RouteParams {
  Labels = 'labels',
  Login = 'login',
  Artists = 'artists',
  Statements = 'statements',
  Transactions = 'transactions'
}

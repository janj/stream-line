import React from 'react'
import { LabelManager } from './label/label'
import { User } from './login/utility'

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

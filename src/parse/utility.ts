import Parse from 'parse'
import { User } from './types'
import { createQuery } from './parseObj'

export function initializeParse() {
  Parse.initialize("ynIkTAKDSN7mx79IDrjsSm7yJJU43RsJe3fg3YKs","2rY3C47KmEDJ5ja3QmtObRzIYIL4dXYZ72A9Eq4W"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
  Parse.serverURL = 'https://parseapi.back4app.com/'
}

export function getCurrentUser() {
  return Parse.User.current()
}

export async function getAllUsers(): Promise<User[]> {
  // how to do this better
  return await createQuery('User')
    .find() as unknown as Promise<User[]>
}

export async function doUserRegistration({ username, password}: {
  username: string
  password: string
}): Promise<User | undefined> {
  try {
    await Parse.User.signUp(username, password, {})
    return await Parse.User.current()
  } catch (error: any) {
    alert(`Error! ${error}`)
  }
}

export async function doUserLogin({ username, password}: {
  username: string
  password: string
}): Promise<User | undefined> {
  try {
    await Parse.User.logIn(username, password)
    return await Parse.User.current()
  } catch (error: any) {
    alert(`Error! ${error}`)
  }
}

export async function doUserLogout() {
  return Parse.User.logOut()
}

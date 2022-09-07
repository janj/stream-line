import Parse from 'parse'

export type User = Parse.User

export function getCurrentUser() {
  return Parse.User.current()
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

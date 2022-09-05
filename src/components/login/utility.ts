import Parse from 'parse'

export const doUserRegistration = async function ({ username, password}: {username: string; password: string}): Promise<boolean> {
  // Note that these values come from state variables that we've declared before
  const usernameValue: string = username
  const passwordValue: string = password
  try {
    // Since the signUp method returns a Promise, we need to call it using await
    const createdUser: Parse.User = await Parse.User.signUp(usernameValue, passwordValue, {})
    alert(
      `Success! User ${createdUser.getUsername()} was successfully created!`,
    )
    return true
  } catch (error: any) {
    // signUp can fail if any parameter is blank or failed an uniqueness check on the server
    alert(`Error! ${error}`)
    return false
  }
}

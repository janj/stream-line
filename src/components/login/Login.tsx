import React from 'react';
import { Box, Button, TextField } from '@mui/material'
import { doUserLogin, doUserLogout, doUserRegistration, getCurrentUser, User } from './utility'

export default function Login() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [currentUser, setCurrentUser] = React.useState<User | undefined>()

  React.useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  React.useEffect(() => {
    setUsername('')
    setPassword('')
  }, [currentUser])

  async function doLogout() {
    await doUserLogout()
    setCurrentUser(undefined)
  }

  async function doRegister() {
    const user = await doUserRegistration({ username, password })
    setCurrentUser(user)
  }

  async function doLogin() {
    const user = await doUserLogin({ username, password })
    setCurrentUser(user)
  }

  if (currentUser) {
    return <Box>
      <Box>Hi {currentUser.getUsername()}</Box>
      <Box><Button onClick={doLogout}>Log Out</Button></Box>
    </Box>
  }

  return <Box>
    <Box>Login</Box>
    <Box display={'flex'} justifyContent={'center'}>
      <Box paddingRight={'10px'}>Username</Box>
      <TextField value={username} onChange={(e) => setUsername(e.target.value)} />
    </Box>
    <Box display={'flex'} justifyContent={'center'}>
      <Box paddingRight={'10px'}>Password</Box>
      <TextField value={password} onChange={(e) => setPassword(e.target.value)} />
    </Box>
    <Box>
      <Button onClick={doRegister}>Signup</Button>
      <Button onClick={doLogin}>Login</Button>
    </Box>
  </Box>
}
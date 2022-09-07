import React from 'react';
import { Box, Button, TextField } from '@material-ui/core'
import { doUserRegistration } from './utility'
import Parse from 'parse'

export default function Login() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const currentUser = Parse.User.current()

  if (currentUser) {
    return <Box>Hi {currentUser.getUsername()}</Box>
  }
  return <Box>
    <Box>Login</Box>
    <Box>Username<TextField value={username} onChange={(e) => setUsername(e.target.value)} /></Box>
    <Box>Password<TextField value={password} onChange={(e) => setPassword(e.target.value)} /></Box>
    <Box><Button onClick={() => doUserRegistration({username, password})}>Signup</Button></Box>
  </Box>
}
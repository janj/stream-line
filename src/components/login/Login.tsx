import { useState, useContext, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material'
import { UserContext } from '../contexts'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { currentUser, userLogin, userLogout, userRegister } = useContext(UserContext)

  useEffect(() => {
    setUsername('')
    setPassword('')
  }, [currentUser])

  function doLogout() {
    userLogout()
  }

  function doRegister() {
    userRegister(username, password)
  }

  function doLogin() {
    userLogin(username, password)
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
      <TextField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Box>
    <Box>
      <Button onClick={doRegister}>Signup</Button>
      <Button onClick={doLogin}>Login</Button>
    </Box>
  </Box>
}
import React from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useSearchParams } from 'react-router-dom'
import { UserContext } from '../../App'

export default function StreamLineAppBar() {
  return <Box sx={{ flexGrow: 1 }}>
    <AppBar position={"static"}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          StreamLine
        </Typography>
        <LoginButton />
      </Toolbar>
    </AppBar>
  </Box>
}

function LoginButton() {
  const [_searchParams, setSearchParams] = useSearchParams()

  const { currentUser, userLogout } = React.useContext(UserContext)

  async function logout() {
    userLogout()
    goLogin()
  }

  function goLogin() {
    setSearchParams('login')
  }

  if (currentUser) {
    return <Button onClick={logout} color="inherit">LogOut</Button>
  }
  return <Button onClick={goLogin} color="inherit">LogIn</Button>
}

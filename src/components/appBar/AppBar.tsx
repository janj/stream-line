import { useState, useContext } from 'react';
import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useSearchParams } from 'react-router-dom'
import { RouteParams, UserContext } from '../contexts'

export default function StreamLineAppBar() {
  const [showDrawer, setShowDrawer] = useState(false)

  return <Box sx={{ flexGrow: 1 }}>
    <AppBar position={"static"}>
      <StreamLineDrawer show={showDrawer} onClose={() => setShowDrawer(false)} />
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setShowDrawer(true)}
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

function StreamLineDrawer({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [_searchParams, setSearchParams] = useSearchParams()

  function go(searchParam: string) {
    setSearchParams(searchParam)
    onClose()
  }

  return <Drawer anchor={'left'} open={show} onClose={onClose}>
    <Box padding={'5px'}>
      {[
        ['Login', RouteParams.Login],
        ['Labels', RouteParams.Labels],
        ['View Transactions', RouteParams.Transactions],
        ['Import Transactions', RouteParams.Statements],
        ['Artists', RouteParams.Artists]
      ].map(([label, searchParam]) => {
        return <Box key={label} padding={'5px'}>
          <Button size={'large'} onClick={() => go(searchParam)}>{label}</Button>
        </Box>
      })}
    </Box>
  </Drawer>
}

function LoginButton() {
  const [_searchParams, setSearchParams] = useSearchParams()

  const { currentUser, userLogout } = useContext(UserContext)

  async function logout() {
    userLogout()
    goLogin()
  }

  function goLogin() {
    setSearchParams(RouteParams.Login)
  }

  if (currentUser) {
    return <Button onClick={logout} color="inherit">LogOut</Button>
  }
  return <Button onClick={goLogin} color="inherit">LogIn</Button>
}

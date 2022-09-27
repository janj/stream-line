import React from 'react';
import { useLocation } from 'react-router-dom'
import './App.css';
import Home from './components/Home'
import { Box } from '@mui/material'
import Login from './components/login/Login';
import { Management } from './components/artists/Management';
import Parse from 'parse'
import { StatementsImport } from './components/statements/StatementsImport';
import { TransactionsView } from './components/statements/TransactionsView';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import StreamLineAppBar from './components/appBar/AppBar'
import { doUserLogin, doUserLogout, doUserRegistration } from './components/login/utility'

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export enum RouteParams {
  Login = 'login',
  Artists = 'artists',
  Statements = 'statements',
  Transactions = 'transactions'
}

const componentMap = {
  [RouteParams.Login]: Login,
  [RouteParams.Artists]: Management,
  [RouteParams.Statements]: StatementsImport,
  [RouteParams.Transactions]: TransactionsView
}

const userRequired: string[] = [RouteParams.Artists, RouteParams.Statements, RouteParams.Transactions]

export const UserContext = React.createContext<{
  currentUser: Parse.User | undefined
  userLogin: (u: string, pw: string) => void
  userRegister: (u: string, pw: string) => void
  userLogout: () => void
}>({
  currentUser: undefined,
  userLogin: () => {},
  userRegister: () => {},
  userLogout: () => {}
})

function useComponent() {
  const queryParams = useQuery()
  const currentUser = Parse.User.current()

  for (const [key, component] of Object.entries(componentMap)) {
    if (queryParams.has(key) && (currentUser || !userRequired.includes(key))) {
      return component
    }
  }
  return Home
}

function App() {
  const [currentUser, setCurrentUser] = React.useState<Parse.User>()
  const Component = useComponent()
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <UserContext.Provider value={{
        currentUser,
        userLogin: (username, password) => doUserLogin({ username, password}).then(setCurrentUser),
        userRegister: (username, password) => doUserRegistration({ username, password }).then(setCurrentUser),
        userLogout: () => doUserLogout().then(setCurrentUser)
      }}>
      <StreamLineAppBar />
      <Box className="App" padding={'35px'}>
        <Component />
      </Box>
      </UserContext.Provider>
    </LocalizationProvider>
  )
}

export default App

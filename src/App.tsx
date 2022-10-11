import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'
import './App.css';
import Home from './components/Home'
import { Box, MenuItem, Select } from '@mui/material'
import Login from './components/login/Login';
import { Management } from './components/artists/Management';
import { StatementsImport } from './components/statements/StatementsImport';
import { TransactionsView } from './components/statements/TransactionsView';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import StreamLineAppBar from './components/appBar/AppBar'
import {
  doUserLogin,
  doUserLogout,
  doUserRegistration, getAllUsers,
  getCurrentUser
} from './parse/utility'
import LabelsView from './components/label/LabelsView'
import { getLabelManager, LabelManager } from './components/label/label'
import { RouteParams, UserContext, UserDataContext } from './components/contexts'
import { User } from './parse/types'
import ReleaseView from './components/release/ReleaseView'

const componentMap = {
  [RouteParams.Login]: Login,
  [RouteParams.Artists]: Management,
  [RouteParams.Statements]: StatementsImport,
  [RouteParams.Transactions]: TransactionsView,
  [RouteParams.Labels]: LabelsView,
  [RouteParams.Release]: ReleaseView
}

const userRequired: string[] = [RouteParams.Artists, RouteParams.Statements, RouteParams.Transactions]

function useComponent() {
  const currentUser = getCurrentUser()
  const [searchParams] = useSearchParams()

  const allParams = Array.from(searchParams.keys()).reduce((acc: {[key: string]: any}, param) => {
    acc[param] = searchParams.get(param)
    return acc
  }, {})

  for (const [key, Component] of Object.entries(componentMap)) {
    if (searchParams.has(key) && (currentUser || !userRequired.includes(key))) {
      // @ts-ignore
      return <Component {...allParams} />
    }
  }
  return Home
}

function ProvidersWrapper({children}: {children: any}) {
  const [currentUser, setCurrentUser] = useState<User>()
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [labelManager, setLabelManager] = useState<LabelManager>()
  const [overrideUserId, setOverrideUserId] = useState('')

  useEffect(() => {
    setCurrentUser(getCurrentUser())
    getAllUsers().then(setAllUsers)
  }, [])

  useEffect(() => {
    if (!currentUser) return
    getLabelManager(currentUser).then(setLabelManager)
  }, [currentUser])

  useEffect(() => {
    const user = allUsers.find(({ id }) => id === overrideUserId)
    user && setCurrentUser(user)
  }, [overrideUserId, allUsers])

  return <LocalizationProvider dateAdapter={AdapterMoment}>
    <UserContext.Provider value={{
      currentUser,
      userLogin: (username, password) => doUserLogin({ username, password}).then(setCurrentUser),
      userRegister: (username, password) => doUserRegistration({ username, password }).then(setCurrentUser),
      userLogout: () => doUserLogout().then(setCurrentUser)
    }}>
      <UserDataContext.Provider value={{ labelManager }}>
        {children}
        <Box>
          <Select
            value={overrideUserId}
            onChange={({ target: { value  }}) => setOverrideUserId(value)}
          >
            {allUsers.map((user) => <MenuItem key={user.id} value={user.id}>{user.getUsername()}</MenuItem>)}
          </Select>
        </Box>
      </UserDataContext.Provider>
    </UserContext.Provider>
  </LocalizationProvider>
}

function App() {
  const component = useComponent()
  return (
    <ProvidersWrapper>
      <StreamLineAppBar />
      <Box className="App" padding={'35px'}>
        {component}
      </Box>
    </ProvidersWrapper>
  )
}

export default App

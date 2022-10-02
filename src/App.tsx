import React from 'react'
import { useSearchParams } from 'react-router-dom'
import './App.css';
import Home from './components/Home'
import { Box } from '@mui/material'
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
  doUserRegistration,
  getCurrentUser
} from './parse/utility'
import LabelsView from './components/label/LabelsView'
import { getLabelManager, LabelManager } from './components/label/label'
import { RouteParams, UserContext, UserDataContext } from './components/contexts'
import { User } from './parse/types'

const componentMap = {
  [RouteParams.Login]: Login,
  [RouteParams.Artists]: Management,
  [RouteParams.Statements]: StatementsImport,
  [RouteParams.Transactions]: TransactionsView,
  [RouteParams.Labels]: LabelsView
}

const userRequired: string[] = [RouteParams.Artists, RouteParams.Statements, RouteParams.Transactions]

function useComponent() {
  const currentUser = getCurrentUser()
  const [searchParams] = useSearchParams()

  for (const [key, component] of Object.entries(componentMap)) {
    if (searchParams.has(key) && (currentUser || !userRequired.includes(key))) {
      return component
    }
  }
  return Home
}

function ProvidersWrapper({children}: {children: any}) {
  const [currentUser, setCurrentUser] = React.useState<User>()
  const [labelManager, setLabelManager] = React.useState<LabelManager>()

  React.useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  React.useEffect(() => {
    if (!currentUser) return
    getLabelManager(currentUser).then(setLabelManager)
  }, [currentUser])

  return <LocalizationProvider dateAdapter={AdapterMoment}>
    <UserContext.Provider value={{
      currentUser,
      userLogin: (username, password) => doUserLogin({ username, password}).then(setCurrentUser),
      userRegister: (username, password) => doUserRegistration({ username, password }).then(setCurrentUser),
      userLogout: () => doUserLogout().then(setCurrentUser)
    }}>
      <UserDataContext.Provider value={{ labelManager }}>
        {children}
      </UserDataContext.Provider>
    </UserContext.Provider>
  </LocalizationProvider>
}

function App() {
  const Component = useComponent()
  return (
    <ProvidersWrapper>
      <StreamLineAppBar />
      <Box className="App" padding={'35px'}>
        <Component />
      </Box>
    </ProvidersWrapper>
  )
}

export default App

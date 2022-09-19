import React from 'react';
import { useLocation } from 'react-router-dom'
import './App.css';
import Home from './components/Home'
import { Box } from '@material-ui/core'
import Login from './components/login/Login';
import { Management } from './components/artists/Management';
import Parse from 'parse'
import { StatementsImport } from './components/statements/StatementsImport';
import { TransactionsView } from './components/statements/TransactionsView';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const componentMap = {
  login: Login,
  artists: Management,
  statements: StatementsImport,
  transactions: TransactionsView
}

const userRequired = ['artists', 'statements', 'transactions']

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
  const Component = useComponent()
  return (
    <Box className="App" padding={'35px'}>
      <Component />
    </Box>
  )
}

export default App

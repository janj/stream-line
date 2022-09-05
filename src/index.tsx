import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import Parse from 'parse'
import { Management } from './components/artists/Management'
import Login from './components/login/Login'
import { Box } from '@material-ui/core'

Parse.initialize("ynIkTAKDSN7mx79IDrjsSm7yJJU43RsJe3fg3YKs","2rY3C47KmEDJ5ja3QmtObRzIYIL4dXYZ72A9Eq4W"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/'

function AppContainer({children}: {children: any}) {
  return <Box padding={'35px'}>{children}</Box>
}

function UserRequired({children}: {children: any}) {
  const [currentUser, setCurrentUser] = React.useState<Parse.Object>()
  const navigate = useNavigate()

  React.useEffect(() => {
    const currentUser = Parse.User.current()
    if (!currentUser) navigate('/stream-line')
    setCurrentUser(currentUser)
  }, [])

  if (!currentUser) return <Box></Box>

  return <Box>{children}</Box>
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContainer>
      <Routes>
        <Route path={"/stream-line"} element={<App />} />
        <Route path={"/artist-management"} element={<UserRequired><Management /></UserRequired>} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
      </AppContainer>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

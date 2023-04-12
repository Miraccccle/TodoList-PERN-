import React from 'react';
import ReactDOM from 'react-dom';
import {useCookies} from 'react-cookie'
import {useEffect, useState} from 'react'
import AppHeader from "./components/AppHeader";
import './App.css';
import Auth from './components/Auth';
import { BrowserRouter as Router, Routes, Route, Outlet  } from 'react-router-dom';
import ListGroups from './components/ListGroups/ListGroups';
import ListGroupsImportant from './components/ListGroups/ListGroupsImportant';
import ListGroupsCompleted from './components/ListGroups/ListGroupsCompleted';
import ListGroupsAll from './components/ListGroups/ListGroupsAll';
import ListGroupsMyDay from './components/ListGroups/ListGroupsMyDay';
const App = () => {
  

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ groups, setGroups ] = useState(null)
  const [ myDay, setMyDay ] = useState(null)
  const [isDark, setDark] = useState("false");

  const toggleDark = () => {
    setDark(!isDark);
};
  const getGroup = async () => {
    try {
      const response = await fetch(`http://localhost:8000/groups/${userEmail}`)
      const json = await response.json()
      console.log(json)
      setGroups(json)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() =>{
    if(authToken) { 
      getGroup()
    }
  }, [])
  
  const getMyDay = async () => {
    try {
      const response = await fetch(`http://localhost:8000/group/${userEmail}`)
      const json = await response.json()
      console.log(json)
      setMyDay(json)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() =>{
    if(authToken) { 
      getMyDay()
    }
  }, [])
  
 
  //Sort by date

  const sortedGroups = groups?.sort((a, b) => new Date(a.date) - new Date(b.date))
  const sortedMyday = myDay?.sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
        <div className={isDark ? 'app': "app active"} style={{flex: 1}}>
            {!authToken && <Auth />}
            {authToken &&
            <>
            <Router>
            <AppHeader userEmail={userEmail} getGroup={getGroup} groups={groups} myDay={myDay} isDark={isDark} toggleDark={toggleDark}/>
              <Routes>
              {sortedMyday?.map((group) =>  <Route path='/' element={<ListGroupsMyDay group={group} key = {group.id} getGroup={getGroup}/>} />)}
              <Route path={'important'} element={<ListGroupsImportant userEmail={userEmail}/>} />
              <Route path={'completed'} element={<ListGroupsCompleted userEmail={userEmail}/>} />
              <Route path={'all'} element={<ListGroupsAll userEmail={userEmail}/>} />
             {sortedGroups?.map((group) =>  <Route path={group.name} element={<ListGroups group={group} key = {group.id} getGroup={getGroup}/>} />)}
            </Routes>
              </Router>
            </>
            }
        </div>
    )
}

export default App;
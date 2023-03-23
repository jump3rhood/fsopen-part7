import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, Navigate, useMatch } from 'react-router-dom'
import { resetAndRemoveUser, setSavedUser } from './reducers/userReducer'
import { notify } from './reducers/notificationReducer'
import blogService from './services/blogs'
import userService from './services/users'

import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'

const App = () => {

  const padding = {
    padding: 5
  }

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      dispatch(setSavedUser(user))
      blogService.setToken(user.token)
    }
  },[])

  useEffect(() => {
    userService.getAll().then(allUsers => setUsers(allUsers))
  }, [])

  const match = useMatch('/users/:id')

  const matchedUser = match
    ? users.find(u => u.id === match.params.id)
    : null

  const handleLogout = () => {
    dispatch(resetAndRemoveUser())
    dispatch(notify({
      class: 'success',
      content: 'successfully logged out'
    }))
  }

  return <>
    <div>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/users">users</Link>
      {user? <em style={padding}>{user.name} logged in<button style={padding} onClick={handleLogout}>logout</button> </em>: ''}
    </div>
    <Routes>
      <Route path="/users/:id" element={<User user={matchedUser}/>}/>
      <Route path="/users" element={ user ? <Users users={ users }/> : <Navigate replace to="/" />} />
      <Route path="/" element={ <Home />} />
    </Routes>
    <div>
      <i>Bloglist app, Department of Computer Science 2023</i>
    </div>
  </>
}

export default App

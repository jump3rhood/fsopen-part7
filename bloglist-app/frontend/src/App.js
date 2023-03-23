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
import Blog from './components/Blog'

const App = () => {

  const padding = {
    padding: 5
  }

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
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

  const userMatch = useMatch('/users/:id')

  const matchedUser = userMatch
    ? users.find(u => u.id === userMatch.params.id)
    : null

  const matchedBlog = useMatch('/blogs/:id')
  const blog = matchedBlog
    ? blogs.find(b => b.id === matchedBlog.params.id)
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
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      {user? <em style={padding}>{user.name} logged in<button style={padding} onClick={handleLogout}>logout</button> </em>: ''}
      <h1>Blogs</h1>
    </div>
    <Routes>
      <Route path="/blogs/:id" element={<Blog user={user} blog={blog}/>} />
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

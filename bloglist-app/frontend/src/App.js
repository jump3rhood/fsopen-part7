import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Link, Navigate, useMatch } from 'react-router-dom'
import { resetAndRemoveUser, setSavedUser } from './reducers/userReducer'
import { notify } from './reducers/notificationReducer'
import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

import { Navbar, Nav } from 'react-bootstrap'

const App = () => {

  const padding = {
    padding: 5,
    textDecoration: 'none'
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

  return <div className='container'>
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
            {user
              ? <Nav.Link href="#" as="span">
                <em style={padding}>{user.name} logged in<Link style={padding} onClick={handleLogout}>logout</Link> </em>
              </Nav.Link>
              : ''}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Notification/>
      <h1>Blogs</h1>
    </div>

    <Routes>
      <Route path="/blogs/:id" element={blog ? <Blog user={user} blog={blog}/> : <Navigate replace to="/" />} />
      <Route path="/users/:id" element={ user ? <User user={matchedUser}/> : <Navigate replace to="/" />}/>
      <Route path="/users" element={ user ? <Users users={ users }/> : <Navigate replace to="/" />} />
      <Route path="/" element={ <Home />} />
    </Routes>
    <div>
      <i>Bloglist app, Department of Computer Science 2023</i>
      <br />
      <strong>&copy; John M Codes</strong>
    </div>
  </div>
}

export default App

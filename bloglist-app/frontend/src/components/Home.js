import React, { useState, useEffect } from 'react'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import Toggable from './Togglable'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { notify } from '../reducers/notificationReducer'
import { initializeBlogs } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { setSavedUser, setAndStoreUser } from '../reducers/userReducer'

import { Table, Button } from 'react-bootstrap'

const Home = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      dispatch(setSavedUser(user))
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      const userData = await loginService.login({ username, password })
      dispatch(setAndStoreUser(userData))
      if(user){
        blogService.setToken(user.token)
      }
      resetLoginForm()
    }catch(e){
      resetLoginForm()
      dispatch(notify({
        class: 'dangero',
        content: 'wrong username or password'
      }))
    }
  }

  const resetLoginForm = () => {
    setUsername('')
    setPassword('')
  }
  if(user === null) {
    return (
      <div>
        <h2>login to view blogs</h2>
        <form id='login-form' onSubmit={handleLogin}>
          <div className='mb-2'>
          Username <input type="text" id='username' value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div className='mb-2'>
          Password <input type="password" id='password' value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <Button variant='primary' type="submit" id='login-button'>login</Button>
        </form>
      </div>
    )
  }
  if(blogs.length === 0){
    return <h1>loading</h1>
  }

  const linkStyle = {
    textDecoration: 'none'
  }

  const blogstoRender = [...blogs]
    // .sort((a,b) => b.likes - a.likes)
    .map( (b, index) => {
      return <tr key={index}><td><Link style={linkStyle} to={`/blogs/${b.id}`}>{b.title}</Link></td></tr>
      // return <Blog key={index} user={user} blog={b}/>
    })

  return (
    <div>
      <br/>
      <Toggable buttonLabel='Blog Form'>
        <h2>create new</h2>
        <BlogForm/>
      </Toggable>
      <br/>
      <div>
        <h3>My list of blogs</h3>
        <div id="blogs-section">
          <Table striped>
            <tbody>
              { blogstoRender }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Home

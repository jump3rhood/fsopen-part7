import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Toggable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { notify } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { setSavedUser, setAndStoreUser, resetAndRemoveUser, initializeUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  // const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    // console.log('2nd useeffect')
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      dispatch(setSavedUser(user))
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(initializeUser({ username, password }))
    if(user){
      dispatch(setAndStoreUser(user))
      dispatch(notify({
        class: 'success',
        content: 'Successfully logged in'
      }))
      blogService.setToken(user.token)
      resetLoginForm()
    }
    else {
      resetLoginForm()
      dispatch(notify({
        class: 'error',
        content: 'wrong username or password'
      }))
    }
  }
  const resetLoginForm = () => {
    setUsername('')
    setPassword('')
  }
  const handleLogout = () => {
    dispatch(resetAndRemoveUser())
    dispatch(notify({
      class: 'success',
      content: 'successfully logged out'
    }))
    setUsername('')
    setPassword('')
  }
  if(user === null) {
    return (
      <div>
        <h2>login to view blogs</h2>
        <Notification />
        <form id='login-form' onSubmit={handleLogin}>
          <div>
          Username <input type="text" id='username' value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
          Password <input type="password" id='password' value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit" id='login-button'>login</button>
        </form>
      </div>
    )
  }
  if(blogs.length === 0){
    return <h1>loading</h1>
  }

  const blogstoRender = [...blogs]
    .sort((a,b) => b.likes - a.likes)
    .map( (b,index) => {
      return <Blog key={index} user={user} blog={b}/>
    })

  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <br/>
      <Toggable buttonLabel='Blog Form'>
        <h2>create new</h2>
        <BlogForm/>
      </Toggable>
      <br/>
      <div>
        <h3>My list of blogs</h3>
        <div id="blogs-section">
          { blogstoRender }
        </div>
      </div>
    </div>
  )
}

export default App

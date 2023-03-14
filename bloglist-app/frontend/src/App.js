import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Toggable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { notify, newNotification, resetNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  // const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
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
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      const user = await loginService.login({
        username, password
      })
      if(user){
        // save to localStorage
        window.localStorage.setItem('loggedBlogAppUser',
          JSON.stringify(user)
        )
        console.log(user)
        setUser(user)
        dispatch(notify({
          class: 'success',
          content: 'Successfully logged in'
        }))
        blogService.setToken(user.token)
        setUsername('')
        setPassword('')
      }
    }catch(exception){
      dispatch(notify({
        class: 'error',
        content: 'wrong username or password'
      }))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    dispatch(notify({
      class: 'success',
      content: 'successfully logged out'
    }))
  }

  const addBlog = async (blogObj) => {
    const createdBlog = await blogService.create(blogObj)
    const updatedBlogs = blogs.concat(createdBlog)
    // setBlogs(updatedBlogs)
    const { title, author } = createdBlog
    dispatch(notify({
      class: 'success',
      content: `a new blog ${title} by ${author} added`
    }))
  }

  const updateBlog = async (id, blogObj) => {
    const updatedBlog = await blogService.update(id, blogObj)
    const otherBlogs = blogs.filter(b => b.id !== id)
    // setBlogs([...otherBlogs, updatedBlog])
  }

  const deleteBlog = async (blog) => {
    const confirm = window.confirm(`Remove ${blog.title} by ${blog.author}?`)
    if(confirm){
      try{
        await blogService.deleteOne(blog.id)
        // setBlogs(blogs.filter(b => b.id !== blog.id))
        dispatch(notify({
          class: 'success',
          content: `deleted ${blog.title}`
        }))
      }
      catch(exception){
        console.log(exception)
        dispatch(notify({
          class: 'error',
          content: exception.response.data.error
        }))
      }
    }
  }
  if(user === null) {
    return (
      <div>
        <h2>login to view blogs</h2>
        <Notification />
        <form onSubmit={handleLogin}>
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
    // .filter( blog => blog.user.username === user.username)
    .sort((a,b) => b.likes - a.likes)
    .map( (b,index) => {
      return <Blog key={index} user={user} blog={b} updateBlog={updateBlog} deleteBlog={deleteBlog}/>
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
        <BlogForm createBlog={addBlog} />
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

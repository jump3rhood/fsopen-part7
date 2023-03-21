import React, { useState, useEffect, useReducer } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggable from './components/Togglable'
import blogService from './services/blogs'
import noteService from './services/login'
import NotificationContext from './components/NotificationContext'
import notificationReducer from './components/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // useEffect(() => {
  //   console.log('1st useeffect')
  //   blogService.getAll().then(blogs => {
  //     setBlogs(blogs)
  //   })
  // }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])
  // React - Query for blogs
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery('blogs', blogService.getAll)
  const queryBlogs = data
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  const addMutation = useMutation(blogService.create, {
    onSuccess: () => queryClient.invalidateQueries('blogs')
  })

  const updateMutation = useMutation(blogService.update, {
    onSuccess: () => queryClient.invalidateQueries('blogs')
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      const user = await noteService.login({
        username, password
      })
      if(user){
        // save to localStorage
        window.localStorage.setItem('loggedBlogAppUser',
          JSON.stringify(user)
        )
        setUser(user)
        notificationDispatch({
          type: 'SET',
          payload: {
            class: 'success',
            content: 'Successfully logged in'
          }
        })
        setTimeout(() => notificationDispatch({ type: 'RESET' }), 3000)
        blogService.setToken(user.token)
        setUsername('')
        setPassword('')
      }
    }catch(exception){
      notificationDispatch({
        type: 'SET',
        payload: {
          class: 'error',
          content: 'wrong username or password'
        }
      })
      setTimeout(() => notificationDispatch({ type: 'RESET' }), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    notificationDispatch({
      type: 'SET',
      payload: {
        class: 'success',
        content: 'successfully logged out'
      }
    })
    setTimeout(() => notificationDispatch({ type: 'RESET' }), 3000)
  }

  const addBlog = async (blogObj) => {
    addMutation.mutate(blogObj)
    const { title, author } = blogObj
    notificationDispatch({
      type: 'SET',
      payload: {
        class: 'success',
        content: `a new blog ${title} by ${author} added`
      }
    })
    setTimeout(() => notificationDispatch({ type: 'RESET' }), 3000)
  }

  const updateBlog = (blogObj) => {
    updateMutation.mutate({ likes: blogObj.likes + 1, ...blogObj })
    console.log(blogObj)
  }

  const deleteBlog = async (blog) => {
    const confirm = window.confirm(`Remove ${blog.title} by ${blog.author}?`)
    if(confirm){
      try{
        await blogService.deleteOne(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notificationDispatch({
          type: 'SET',
          payload: {
            class: 'success',
            content: `deleted ${blog.title}`
          }
        })
        setTimeout(() => notificationDispatch({ type: 'RESET' }), 3000)
      }
      catch(exception){
        console.log(exception)
        notificationDispatch({
          type: 'SET',
          payload: {
            class: 'error',
            content: exception.response.data.error
          }
        })
        setTimeout(() => notificationDispatch({ type: 'RESET' }), 3000)
      }
    }
  }
  if(user === null) {
    return (
      <NotificationContext.Provider value={[notification, notificationDispatch]}>
        <h2>login to view blogs</h2>
        <Notification/>
        <form onSubmit={handleLogin}>
          <div>
          Username <input type="text" id='username' value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
          Password <input type="password" id='password' value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit" id='login-button'>login</button>
        </form>
      </NotificationContext.Provider>
    )
  }
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <h2>blogs</h2>
      <Notification />
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
          {isLoading
            ? <p>Loading...</p>
            : (error ? <p>{error.message}</p>
              : queryBlogs
                .sort((a,b) => b.likes - a.likes)
                .map((b,index) => <Blog key={index} user={user} blog={b} updateBlog={updateBlog} deleteBlog={deleteBlog}/>)) }
        </div>
      </div>
    </NotificationContext.Provider>
  )
}

export default App

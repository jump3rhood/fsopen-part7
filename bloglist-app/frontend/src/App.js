import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Users from './components/Users'

const App = () => {
  const user = useSelector(state => state.user)
  const padding = {
    padding: 5
  }
  return <BrowserRouter>
    <div>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/users">users</Link>
    </div>
    <Routes>
      <Route path="/" element={ <Home />} />
      <Route path="/users" element={ user ? <Users /> : <Navigate replace to="/" />} />
    </Routes>
    <div>
      <i>Bloglist app, Department of Computer Science 2023</i>
    </div>
  </BrowserRouter>
}

export default App

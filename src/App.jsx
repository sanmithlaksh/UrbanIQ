import React from "react";
import { useState, useEffect } from 'react'
import { DB } from './lib/db'
import Splash        from './components/Splash'
import Login         from './components/Login'
import Register      from './components/Register'
import UserLayout    from './components/UserLayout'
import GovLayout     from './components/GovLayout'
import Home          from './components/Home'
import Feed          from './components/Feed'
import ReportPost    from './components/ReportPost'
import Accomplishments from './components/Accomplishments'
import Profile       from './components/Profile'
import GovDashboard  from './components/GovDashboard'
import Toast         from './components/Toast'

export default function App() {
  const [page, setPage]             = useState('splash')
  const [currentUser, setCurrentUser] = useState(null)
  const [isGov, setIsGov]           = useState(false)
  const [posts, setPosts]           = useState([])
  const [users, setUsers]           = useState([])
  const [toast, setToast]           = useState(null)
  const [fading, setFading]         = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [p, u] = await Promise.all([DB.getPosts(), DB.getUsers()])
    setPosts(p)
    setUsers(u)
  }

  async function refreshPosts() {
    const p = await DB.getPosts()
    setPosts(p)
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  function navigate(p) {
    setFading(true)
    setTimeout(() => { setPage(p); setFading(false) }, 180)
  }

  function logout() {
    setCurrentUser(null)
    setIsGov(false)
    navigate('login')
  }

  const shared = {
    navigate, currentUser, isGov,
    posts, users, setUsers,
    refreshPosts, showToast, logout,
  }

  const userPages = ['home', 'feed', 'post', 'profile', 'accomplishments']

  return (
    <div style={{ minHeight: '100vh' }}>
      {toast && <Toast toast={toast} />}

      <div style={{ opacity: fading ? 0 : 1, transition: 'opacity .18s' }}>

        {page === 'splash' && (
          <Splash navigate={navigate} />
        )}

        {page === 'login' && (
          <Login {...shared} setCurrentUser={setCurrentUser} setIsGov={setIsGov} />
        )}

        {page === 'register' && (
          <Register {...shared} setCurrentUser={setCurrentUser} />
        )}

        {userPages.includes(page) && !isGov && (
          <UserLayout page={page} navigate={navigate} currentUser={currentUser} logout={logout}>
            {page === 'home'             && <Home           {...shared} />}
            {page === 'feed'             && <Feed           {...shared} />}
            {page === 'post'             && <ReportPost     {...shared} />}
            {page === 'profile'          && <Profile        {...shared} />}
            {page === 'accomplishments'  && <Accomplishments {...shared} />}
          </UserLayout>
        )}

        {page === 'gov' && isGov && (
          <GovLayout logout={logout}>
            <GovDashboard {...shared} />
          </GovLayout>
        )}

      </div>
    </div>
  )
}

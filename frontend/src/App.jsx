import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {Loader} from 'lucide-react'
import {HomePage, SignupPage, LoginPage, SettingsPage, ProfilePage} from "./pages/index.js"
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore.js'
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  
  return (
    <div data-theme = {theme || "light"}>
      <Navbar />
      <Routes>
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/settings' element={<SettingsPage />}/>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
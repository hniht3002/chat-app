import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {Loader} from 'lucide-react'
import {HomePage, SignupPage, LoginPage, SettingsPage, ProfilePage} from "./pages/index.js"
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import {Toaster} from "react-hot-toast"
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log(authUser);

  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/login" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
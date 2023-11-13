import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { type UserLocalStorage } from './types'
import Entrypoint from './layouts/Entrypoint'
import Auth from './layouts/Auth'

function App () {
  const [userLocalStorage, setUserLocalStorage] = useState<UserLocalStorage>()
  const [tokenLocalStorage, setTokenLocalStorage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getUserLocalStorage = () => {
    const userString = localStorage.getItem('user')
    const user = userString ? JSON.parse(userString) : null
    setUserLocalStorage(user)
  }

  const getTokenLocalStorage = () => {
    const tokenString = localStorage.getItem('token')
    setTokenLocalStorage(tokenString)
  }

  useEffect(() => {
    getUserLocalStorage()
    getTokenLocalStorage()
    setLoading(false)
  }, [])

  if (loading) {
    return '...loading'
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            tokenLocalStorage && userLocalStorage?.roles
              ? (
              <Entrypoint
                userSession={userLocalStorage}
                tokenLocalStorage={tokenLocalStorage}
              />
                )
              : (
              <Auth />
                )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

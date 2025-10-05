import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5002/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const client = useMemo(() => {
    const instance = axios.create({ baseURL: API_BASE })
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return instance
  }, [token])

  async function login(email, password) {
    const { data } = await client.post('/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
  }

  async function signup(name, email, password) {
    const { data } = await client.post('/auth/signup', { name, email, password })
    setToken(data.token)
    setUser(data.user)
  }

  function logout() {
    setToken('')
    setUser(null)
  }

  const value = { token, user, login, signup, logout, client }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}



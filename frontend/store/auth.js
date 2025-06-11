import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../src/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const userType = ref(localStorage.getItem('userType'))

  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserType = (type) => {
    userType.value = type
    localStorage.setItem('userType', type)
  }

  const login = async (credentials) => {
    const endpoint = credentials.userType === 'admin' ? '/admins/login' : '/guards/login'
    const payload = credentials.userType === 'admin'
      ? { username: credentials.username, password: credentials.password }
      : { document: credentials.username, password: credentials.password }

    const response = await api.post(endpoint, payload)
    const { token: newToken, user: userData } = response.data

    setToken(newToken)
    setUser(userData)
    setUserType(credentials.userType)

    // Configurar el token en las cabeceras de axios para futuras peticiones
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

    return response
  }

  const logout = () => {
    user.value = null
    token.value = null
    userType.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    delete api.defaults.headers.common['Authorization']
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const endpoint = userType.value === 'admin' ? '/admins/me' : '/guards/me'
      const response = await api.get(endpoint)
      setUser(response.data)
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    userType,
    login,
    logout,
    checkAuth
  }
})

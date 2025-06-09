import axios from 'axios'

const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

export const loginGuard = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/guards/login`, credentials)
    return response.data
  } catch (error) {
    throw error
  }
}

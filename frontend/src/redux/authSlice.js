import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { api_url } from '../Components/config/apiConfig'

// Bootstrap from localStorage
const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null

if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/login`, credentials)
    return res.data // expected { token, user }
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed'
    return rejectWithValue(msg)
  }
})

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/register`, payload)
    return res.data // expected { user } or { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Registration failed'
    return rejectWithValue(msg)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      delete axios.defaults.headers.common['Authorization']
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        const { token, user } = action.payload || {}
        state.user = user || null
        state.token = token || null
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        if (typeof localStorage !== 'undefined') {
          if (token) localStorage.setItem('auth_token', token)
          if (user) localStorage.setItem('auth_user', JSON.stringify(user))
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })
  },
})

export const { logout } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectAuthUser = (state) => state.auth.user
export const selectAuthToken = (state) => state.auth.token
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer

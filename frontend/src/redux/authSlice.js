import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { api_url } from '../config/apiConfig'

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true

// Bootstrap from localStorage (only user data, not token)
const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/login`, credentials)
    return res.data // expected { user }
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed'
    return rejectWithValue(msg)
  }
})

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/register`, payload)
    return res.data // expected { user }
  } catch (err) {
    const msg = err.response?.data?.message || 'Registration failed'
    return rejectWithValue(msg)
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${api_url}/auth/logout`)
    return true
  } catch (err) {
    const msg = err.response?.data?.message || 'Logout failed'
    return rejectWithValue(msg)
  }
})

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${api_url}/auth/check`)
    return res.data // expected { user }
  } catch (err) {
    const msg = err.response?.data?.message || 'Authentication check failed'
    return rejectWithValue(msg)
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (passwordData, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${api_url}/auth/reset-password`, passwordData)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to reset password'
    return rejectWithValue(msg)
  }
})

export const resetUsername = createAsyncThunk('auth/resetUsername', async (emailData, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${api_url}/auth/reset-username`, emailData)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to reset username'
    return rejectWithValue(msg)
  }
})

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${api_url}/auth/delete-account`)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to delete account'
    return rejectWithValue(msg)
  }
})

export const sendPasswordResetOTP = createAsyncThunk('auth/sendPasswordResetOTP', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/send-password-reset-otp`, data)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to send OTP'
    return rejectWithValue(msg)
  }
})

export const verifyPasswordResetOTP = createAsyncThunk('auth/verifyPasswordResetOTP', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/verify-password-reset-otp`, data)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to verify OTP'
    return rejectWithValue(msg)
  }
})

export const sendEmailUpdateOTP = createAsyncThunk('auth/sendEmailUpdateOTP', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/send-email-update-otp`, data)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to send OTP'
    return rejectWithValue(msg)
  }
})

export const verifyEmailUpdateOTP = createAsyncThunk('auth/verifyEmailUpdateOTP', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${api_url}/auth/verify-email-update-otp`, data)
    return res.data // expected { message }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to verify OTP'
    return rejectWithValue(msg)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isChecking: true, // For initial auth check
  },
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload?.user || null
        if (typeof localStorage !== 'undefined' && action.payload?.user) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload || 'Login failed'
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload?.user || null
        if (typeof localStorage !== 'undefined' && action.payload?.user) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload || 'Registration failed'
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isChecking = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isChecking = false
        state.isAuthenticated = true
        state.user = action.payload?.user || null
        if (typeof localStorage !== 'undefined' && action.payload?.user) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isChecking = false
        state.isAuthenticated = false
        state.user = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to reset password'
      })
      // Reset Username
      .addCase(resetUsername.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetUsername.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      })
      .addCase(resetUsername.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to reset username'
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to delete account'
      })
      // Send Password Reset OTP
      .addCase(sendPasswordResetOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendPasswordResetOTP.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(sendPasswordResetOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to send OTP'
      })
      // Verify Password Reset OTP
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyPasswordResetOTP.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to verify OTP'
      })
      // Send Email Update OTP
      .addCase(sendEmailUpdateOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendEmailUpdateOTP.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(sendEmailUpdateOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to send OTP'
      })
      // Verify Email Update OTP
      .addCase(verifyEmailUpdateOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmailUpdateOTP.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('auth_user')
        }
      })
      .addCase(verifyEmailUpdateOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to verify OTP'
      })
  },
})

export const { clearError } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectAuthUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectIsChecking = (state) => state.auth.isChecking

export default authSlice.reducer

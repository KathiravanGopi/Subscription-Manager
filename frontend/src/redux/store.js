import {configureStore} from '@reduxjs/toolkit'
import subsReducer from './subsSlice'
import authReducer from './authSlice'
export const store = configureStore({
    reducer:{
        // user:userReducer,
        subscriptions: subsReducer,
        auth: authReducer,
    }
})
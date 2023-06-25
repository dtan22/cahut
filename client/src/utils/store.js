import { configureStore } from '@reduxjs/toolkit'
import sessionSlice from './slices/sessionSlice'
import authSlice from './slices/authSlice'

export default configureStore({
    reducer: {
        session: sessionSlice,
        auth: authSlice
    }
})
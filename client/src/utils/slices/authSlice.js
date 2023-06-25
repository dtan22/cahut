import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        username: "",
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUsername } = authSlice.actions

export default authSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        pinNumber: "",
    },
    reducers: {
        setPinNumber: (state, action) => {
            state.pinNumber = action.payload;
        },
    }
})

// Action creators are generated for each case reducer function
export const { setChatId, setGameId, setPinNumber } = sessionSlice.actions

export default sessionSlice.reducer
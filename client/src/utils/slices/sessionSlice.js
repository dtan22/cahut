import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        id: "",
        pinNumber: "",
    },
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setPinNumber: (state, action) => {
            state.pinNumber = action.payload;
        },
    }
})

// Action creators are generated for each case reducer function
export const { setId, setPinNumber } = sessionSlice.actions

export default sessionSlice.reducer
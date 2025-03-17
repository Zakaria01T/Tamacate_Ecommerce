import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const registerUser = createAsyncThunk('auth/register', async (userData) => {
    const response = await axios.post('/api/auth/register', userData)
    return response.data
})

export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials)
    return response.data
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null,
        status: 'idle',
        error: null
    },
    reducers: {
        logout: (state) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userInfo = action.payload
                localStorage.setItem('userInfo', JSON.stringify(action.payload))
            })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
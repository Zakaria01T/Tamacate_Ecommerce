import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../api/api';

// Action asynchrone pour l'enregistrement
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/register', userData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Erreur lors de l\'enregistrement');
    }
});

// Action asynchrone pour la connexion
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await API.post('/auth/login', credentials);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Erreur lors de la connexion');
    }
});

// Slice Redux
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null,
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('csrf_token'); // Supprimez également le token CSRF si nécessaire
        },
    },
    extraReducers: (builder) => {
        builder
            // Gestion de registerUser
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Gestion de loginUser
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
                localStorage.setItem('csrf_token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export des actions et du reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
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
        isAdmin: localStorage.getItem('csrf_token')?.split('/')[1] == 1,
        token: localStorage.getItem('csrf_token') || null,
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.isAdmin = false;
            state.status = 'idle';
            state.error = null;
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
                state.token = action.payload.token;
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
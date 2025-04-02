// src/redux/features/userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../api/api';

// User actions
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/user');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.message || 'Failed to fetch user data');
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/user', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.message || 'Failed to update user');
    }
  },
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await API.put('/updatePassword', passwordData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.message || 'Failed to update password');
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      const response = await API.delete('/delete-account', { data: { password } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete account');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      });

    // Add similar cases for updatePassword and deleteAccount
  },
});

export default userSlice.reducer;

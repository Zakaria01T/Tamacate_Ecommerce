import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from '../../api/api';
import { logoutUser } from './authSlice'; // Import logout action

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
      localStorage.removeItem('userInfo');
      localStorage.removeItem('csrf_token');
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
    resetUserState: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
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
        state.user = null; // Clear user on failed fetch
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
        state.error = action.payload;
      })

      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Listen for logout action from authSlice
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;

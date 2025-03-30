import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../api/api';

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/paniers`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const saveCart = createAsyncThunk(
    'cart/saveCart',
    async ({ product_id, quantity }, { rejectWithValue }) => {
        try {
            const response = await API.post(`/paniers`, { product_id, quantity });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async ({ product_id, quantity }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/paniers/${product_id}`, { quantity });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const clearCartFromServer = createAsyncThunk(
    'cart/clearCartFromServer',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/paniers`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (product_id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/paniers/${product_id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        status: 'idle',
        error: null
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
                state.total = calculateTotal(action.payload.data);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Save cart
            .addCase(saveCart.fulfilled, (state, action) => {
                state.items = action.payload.data;
                state.total = calculateTotal(state.items);
            })

            //update cart from server
            .addCase(updateCart.fulfilled, (state, action) => {
                state.items = action.payload.data;
                state.total = calculateTotal(state.items);
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Remove item from cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.data;
                state.total = calculateTotal(state.items);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Clear cart from server
            .addCase(clearCartFromServer.fulfilled, (state) => {
                state.items = [];
                state.total = 0;
            })
            .addCase(clearCartFromServer.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

// Helper function to calculate total
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};



export default cartSlice.reducer;
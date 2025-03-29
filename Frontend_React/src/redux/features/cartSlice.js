import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from '../../api/api';

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        const response = await API.get(`/paniers`);
        return response.data;
    }
);

export const saveCart = createAsyncThunk(
    'cart/saveCart',
    async ({ product_id, quantity }) => {
        const response = await API.post(`/paniers`, { product_id, quantity });
        return response.data;
    }
);
export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async ({ product_id, quantity }) => {
        const response = await API.post(`/paniers/${product_id}`, { quantity });
        return response.data;
    }
);

export const removeCart = createAsyncThunk(
    'cart/removeCart',
    async (id) => {
        const response = await API.delete(`/paniers/${id}`,);
        return response.data;
    });

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        status: 'idle',
        error: null
    },
    reducers: {
        // Local actions (optimistic updates)
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            state.total = calculateTotal(state.items);

        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.total = calculateTotal(state.items);
        },
        updateCartItemQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                state.total = calculateTotal(state.items);

            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
                state.total = action.payload.total;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(saveCart.fulfilled, (state, action) => {
                // Optional: Update with server response if needed
            });
    }
});

// Helper function remains the same
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../api/api';

// Async thunks
export const fetchOrdersByClient = createAsyncThunk(
    'orders/fetchOrdersByClient',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/client_order`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const fetchOrdersByAdmin = createAsyncThunk(
    'orders/fetchOrdersByAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/admin_order`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderMethod, { rejectWithValue }) => {
        try {
            const response = await API.get(`/payment_${orderMethod}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await API.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Order slice
const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all orders by client
            .addCase(fetchOrdersByClient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrdersByClient.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload.data;
            })
            .addCase(fetchOrdersByClient.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            //Fetch all orders by admin
            .addCase(fetchOrdersByAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrdersByAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload.data;
            })
            .addCase(fetchOrdersByAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders.push(action.payload.data);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOrder = action.payload.data;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = state.orders.filter(
                    (order) => order.id !== action.meta.arg
                );
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
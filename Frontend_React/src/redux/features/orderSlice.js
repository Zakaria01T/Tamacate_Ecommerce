import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../api/api';

// Async thunks
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (type, { rejectWithValue }) => {
        try {
            const response = await API.get(`/${type}_order`);
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
            const response = await API.get(`/admin_order/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updatePaymentOrder = createAsyncThunk(
    'orders/updatePaymentOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await API.put(`/admin_order_payment/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/admin_order/${id}`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/cancelOrder/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelOrderClient = createAsyncThunk(
  "orders/cancelOrderClient",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/uncomplete_order/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchOrderByIdForClient = createAsyncThunk(
  "orders/fetchOrderByIdForClient",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/client_order/${orderId}`);
      console.log(response.data);
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
        }
    },
    extraReducers: (builder) => {
        builder
          // Fetch all orders
          .addCase(fetchOrders.pending, (state) => {
            state.status = "loading";
          })
          .addCase(fetchOrders.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.orders = action.payload;
          })
          .addCase(fetchOrders.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
          })
          // Create order
          .addCase(createOrder.pending, (state) => {
            state.status = "loading";
          })
          .addCase(createOrder.fulfilled, (state, action) => {
            state.status = "succeeded";
          })
          .addCase(createOrder.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
          })
          // Fetch order by ID
          .addCase(fetchOrderById.pending, (state) => {
            state.status = "loading";
          })
          .addCase(fetchOrderById.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.currentOrder = action.payload.data;
          })
          .addCase(fetchOrderById.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
          })
          //update payment of order
          .addCase(updatePaymentOrder.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.orders = action.payload.data;
          })
          //update order
          .addCase(updateOrder.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.orders = action.payload.data;
          })
          // Cancel order
          .addCase(cancelOrder.pending, (state) => {
            state.status = "loading";
          })
          .addCase(cancelOrder.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.orders = state.orders.filter(
              (order) => order.id !== action.meta.arg
            );
          })
          .addCase(cancelOrder.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
          })
          .addCase(cancelOrderClient.pending, (state) => {
            state.status = "loading";
          })
          .addCase(cancelOrderClient.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.orders = state.orders.filter(
              (order) => order.id !== action.meta.arg
            );
          })
          .addCase(cancelOrderClient.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
          })
        
          .addCase(fetchOrderByIdForClient.fulfilled, (state, action) => {
            state.status = "succeeded";
            console.log(action.payload);
            state.currentOrder = action.payload; // Make sure this matches your API response
          });
          
    },
});

// Export actions and reducer
export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
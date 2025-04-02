import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../api/api';

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/products');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Create a new product
export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update an existing product
export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
    formData.append('_method', 'PUT'); // Laravel method spoofing

    const { data } = await API.post(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete a product
export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/products/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    searchTerm: '',
  },
  reducers: {
    filterProducts: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { filterProducts } = productSlice.actions;
export default productSlice.reducer;

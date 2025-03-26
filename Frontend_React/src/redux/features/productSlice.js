import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../api/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const { data } = await API.get('/products');
  return data;
});

export const createProduct = createAsyncThunk('products/create', async (productData) => {
  const { data } = await API.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }) => {
  const { data } = await API.put(
    `/products/${id}`,
    productData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await API.delete(`/products/${id}`);
  return id;
});

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
        state.error = action.error.message;
      });
  },
});

export const { filterProducts } = productSlice.actions;
export default productSlice.reducer;

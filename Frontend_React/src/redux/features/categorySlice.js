import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api/api";

export const fetchCategories = createAsyncThunk("categories/index", async () => {
  const { data } = await API.get("/categories");

  return data;
});


export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData) => {
    const { data } = await API.post("/categories", categoryData);
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, categoryData }) => {
    const { data } = await API.put(`/categories/${id}`, categoryData);
    return data;
  }
);
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id) => {
    await API.delete(`/categories/${id}`);
    return id; 
  }
);



// Create the slice with all the reducers
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Ensure we always store an array, even if payload is empty
      state.items = action.payload.data || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Create category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (category) => category.id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
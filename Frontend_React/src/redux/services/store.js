import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import cartReducer from '../features/cartSlice'
import productReducer from '../features/productSlice'
import orderReducer from '../features/orderSlice'
import categoryReducer from "../features/categorySlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: orderReducer,
    products: productReducer,
    categories:categoryReducer
  }
})
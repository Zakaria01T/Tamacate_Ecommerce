import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: JSON.parse(localStorage.getItem('cart')) || [],
        total: 0
    },
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            localStorage.setItem('cart', JSON.stringify(state.items))

            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1 })
            }

            state.total = calculateTotal(state.items)
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload)
            state.total = calculateTotal(state.items)
        },

        updateCartItemQuantity: (state, action) => {
            const item = state.items.find(item => item._id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
                state.total = calculateTotal(state.items)
            }
        },

        clearCart: (state) => {
            state.items = []
            state.total = 0
        }
    }
})

// Helper function to calculate total
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
} = cartSlice.actions

export default cartSlice.reducer
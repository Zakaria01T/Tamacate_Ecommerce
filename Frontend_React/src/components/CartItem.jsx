import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../redux/features/cartSlice'

export default function CartItem({ item, onRemove }) {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(item.quantity)

    const handleQuantityChange = (newQuantity) => {
        const qty = Math.max(1, Math.min(99, newQuantity))
        setQuantity(qty)
        dispatch(updateCartItemQuantity({ id: item._id, quantity: qty }))
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b">
            {/* Image et informations */}
            <div className="flex items-center space-x-4 flex-1">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                </div>
            </div>

            {/* Contrôle de quantité */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                        aria-label="Reduce quantity"
                    >
                        -
                    </button>

                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        className="w-12 text-center border-0 focus:ring-0"
                        min="1"
                        max="99"
                        aria-label="Quantity"
                    />

                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                {/* Prix et actions */}
                <div className="text-right w-32">
                    <p className="font-semibold">€{(item.price * quantity).toFixed(2)}</p>
                    <button
                        onClick={onRemove}
                        className="text-sm text-red-600 hover:text-red-700"
                        aria-label="Remove item"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}
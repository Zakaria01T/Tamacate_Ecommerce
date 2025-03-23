import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, clearCart } from '../redux/features/cartSlice'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'

export default function CartPage() {
    const { items, total } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>

            {items.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Votre panier est vide</p>
                    <Link to="/" className="text-blue-600 hover:underline">
                        Continuer vos achats
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {items.map(item => (
                        <CartItem
                            key={item._id}
                            item={item}
                            onRemove={() => dispatch(removeFromCart(item._id))}
                        />
                    ))}

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-xl">MAD{total.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Vider le panier
                            </button>
                            <Link
                                to="/checkout"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Commander
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
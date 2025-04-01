import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, fetchCart, clearCartFromServer } from '../redux/features/cartSlice'
import CartItem from '../components/CartItem'
import { Link } from 'react-router-dom'
import { HiShoppingCart } from 'react-icons/hi'
import { useEffect } from 'react'

export default function CartPage() {
    const { items, total } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch])

    const handleClearCartFromServer = () => {
        if (window.confirm('Are you sure you want to clear the cart?')) {
            dispatch(clearCartFromServer())
        }
    }
    const handleRemoveFromCart = (id) => {
        if (window.confirm('Are you sure you want to remove from this cart?')) {
            dispatch(removeFromCart(id))
        }
    }

    return (
        <div className="container h-screen mx-auto p-4">
            <h2 className='font-bold text-3xl'>Cart ({items?.length})</h2>
            {items?.length === 0 ? (
                <div className="flex flex-col items-center gap-4">
                    <HiShoppingCart className='text-9xl text-gray-400' />
                    <p className="text-gray-600 mb-4">Your cart s empty</p>
                    <Link to="/" className="bg-blue-600  hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Explore items
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {items.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={() => handleRemoveFromCart(item.id)}
                        />
                    ))}

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-xl">MAD{total.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => handleDelete()}
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
            )
            }
        </div >
    )
}
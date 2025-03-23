import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/features/authSlice'
import { HiLogout, HiShoppingCart } from 'react-icons/hi'

export default function Header() {
    const { userInfo } = useSelector((state) => state.auth)
    const { items } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    TAMACAT.com
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/cart" className="flex items-center ">
                        <HiShoppingCart className='text-2xl' />
                        {items.length > 0 && (
                            <span className="bg-red-500 text-white  text-xs px-2 rounded-full">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="flex items-center gap-4">
                            {userInfo?.isAdmin && (
                                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => dispatch(logout())}
                                className=" text-gray-600 hover:text-red-600 text-2xl"
                            >
                                <HiLogout />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 font-semibold rounded-lg px-6 py-2 text-white hover:bg-blue-400">
                            SignIn
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}
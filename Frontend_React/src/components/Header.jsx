import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/features/authSlice'

export default function Header() {
    const { userInfo } = useSelector((state) => state.auth)
    const { items } = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto p-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    TAMACAT-Store
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/cart" className="flex items-center gap-1">
                        🛒 Panier
                        {items.length > 0 && (
                            <span className="bg-red-500 text-white px-2 rounded-full">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="flex items-center gap-4">
                            {userInfo.isAdmin && (
                                <Link to="/admin" className="text-gray-600 hover:text-blue-600">
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={() => dispatch(logout())}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-gray-600 hover:text-blue-600">
                            Connexion
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}
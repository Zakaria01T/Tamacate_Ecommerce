import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiLogout, HiShoppingCart, HiUser } from 'react-icons/hi';
import { logout } from '../redux/features/authSlice';

export default function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to={userInfo?.isAdmin ? '/dashboard' : '/'} className="text-2xl font-bold text-blue-600">
          TAMACAT.com
        </Link>

        <div className="flex items-center gap-6">
          {!userInfo?.isAdmin && (
            <>
              <Link to="/cart" className="flex items-center">
                <div className="relative">
                  <HiShoppingCart className="text-2xl" />
                  {items.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-1 rounded-full absolute -top-2 -right-2">
                    {items.length}
                  </span>
                  )}
                </div>
              </Link>

              <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                <HiUser className="text-2xl" />
              </Link>
            </>
          )}

          {userInfo ? (
            <div className="flex items-center gap-4">
              {userInfo?.isAdmin === 1 && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link to="/admin/products" className="text-gray-600 hover:text-blue-600">
                    Products
                  </Link>
                  <Link to="/admin/orders" className="text-gray-600 hover:text-blue-600">
                    Orders
                  </Link>
                </>
              )}
              <button
                onClick={() => dispatch(logout())}
                className="text-gray-600 hover:text-red-600 text-2xl"
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
  );
}

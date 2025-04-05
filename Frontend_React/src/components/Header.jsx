import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiLogout, HiShoppingCart, HiUserCircle, HiChevronDown, HiUser, HiDocumentText } from 'react-icons/hi';
import { useState } from 'react';
import { logoutUser } from '../redux/features/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to={userInfo?.isAdmin ? '/dashboard' : '/'} className="text-2xl font-bold text-green-600">
          TAMACAT.com
        </Link>

        <div className="flex items-center gap-6">
          {!userInfo?.isAdmin && (
            <Link to="/cart" className="flex items-center">
              <div className="relative">
                <HiShoppingCart className="text-2xl" />
                {items.length > 0 && (
                  <span className="bg-green-500 text-white text-xs px-1 rounded-full absolute -top-2 -right-2">
                    {items.length}
                  </span>
                )}
              </div>
            </Link>
          )}

          {userInfo ? (
            <div className="flex items-center gap-4 relative">
              {userInfo?.isAdmin === 1 && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-green-600">
                    Dashboard
                  </Link>
                  <Link to="/admin/categories" className="text-gray-600 hover:text-green-600">
                    Categories
                  </Link>
                  <Link to="/admin/products" className="text-gray-600 hover:text-green-600">
                    Products
                  </Link>
                  <Link to="/admin/orders" className="text-gray-600 hover:text-green-600">
                    Orders
                  </Link>
                </>
              )}

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                >
                  {userInfo.image ? (
                    <img
                      src={`http://localhost:8000/${userInfo.image}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <HiUserCircle className="text-2xl" />
                  )}
                  <HiChevronDown className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex justify-start items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <HiUser />
                      My Profile
                    </Link>
                    {userInfo?.isAdmin === 0 && (
                      <Link
                        to="/orders"
                        className="flex justify-start items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <HiDocumentText />
                        My Orders
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        setIsProfileOpen(false);
                      }}
                      className="flex justify-start gap-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <HiLogout />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-green-500 font-semibold rounded-lg px-6 py-2 text-white hover:bg-green-400">
              SignIn
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

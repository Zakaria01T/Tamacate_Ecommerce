import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../redux/features/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, userInfo, error } = useSelector((state) => state.auth);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(loginUser(credentials));
    },
    [dispatch, credentials],
  );

  useEffect(() => {
    if (error) {
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error,
          confirmButtonColor: 'green',
        });
      });
    }
    if (userInfo && status === 'succeeded') {
      navigate(userInfo.isAdmin ? '/dashboard' : '/');
    }
  }, [status, error, userInfo, navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* User Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-center text-gray-500 mb-8">Please enter your login details</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center
                  ${status === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 shadow-lg hover:shadow-green-200'}
                h-12`}
              >
                {status === 'loading' ? <LoadingSpinner /> : 'Sign In'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 font-medium hover:underline transition-colors duration-200">
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

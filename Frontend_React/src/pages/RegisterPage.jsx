import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../redux/features/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(registerUser(formData));
    },
    [dispatch, formData],
  );

  useEffect(() => {
    if (error) {
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error,
          confirmButtonColor: 'green',
        });
      });
    }
    if (status === 'succeeded') {
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered!',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate('/login');
        });
      });
    }
  }, [error, status, navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* User Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">Create Account</h1>
            <p className="text-center text-gray-500 mb-8">Please enter your details</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* First Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    name="first_name"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />
                </div>

                {/* Last Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    name="last_name"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={formData.password}
                    onChange={handleChange}
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
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-200'} h-12`}
              >
                {status === 'loading' ? <LoadingSpinner /> : 'Register'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-medium hover:underline transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

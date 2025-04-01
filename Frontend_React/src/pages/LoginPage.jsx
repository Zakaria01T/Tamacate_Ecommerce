import { useEffect, useState, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/features/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, userInfo, error } = useSelector((state) => state.auth);



  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

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
      if (userInfo.isAdmin) {
        navigate('/dashboard');
      }
      else {
        navigate('/');
      }
    }
  }, [status, error]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={credentials?.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
        >
          {status === 'loading' ? <LoadingSpinner /> : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <span className="text-gray-600">You don't have account? </span>
        <Link to="/register" className="text-blue-600 hover:underline">
          register
        </Link>
      </div>
    </div>
  );
}

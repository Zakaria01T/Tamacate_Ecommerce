import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/features/authSlice'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { status, error } = useSelector((state) => state.auth)

    const handleChage = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(registerUser(formData))
    }


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
                    navigate('/login')
                });
            });
        }
    }, [error, status]);

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6">Register</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">First Name</label>
                    <input
                        type="text"
                        name='first_name'
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => handleChage(e)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Last Name</label>
                    <input
                        type="text"
                        name='last_name'
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => handleChage(e)}

                    />
                </div>


                <div>
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        name='email'
                        className="w-full p-2 border rounded"
                        value={formData.email}
                        onChange={(e) => handleChage(e)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        name='password'
                        className="w-full p-2 border rounded"
                        value={formData.password}
                        onChange={(e) => handleChage(e)}
                        required
                    />
                </div>


                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
                >
                    {status === 'loading' ? <LoadingSpinner /> : 'S\'inscrire'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <span className="text-gray-600">I have aleardy an account ? </span>
                <Link to="/login" className="text-blue-600 hover:underline">
                    Create an account
                </Link>
            </div>
        </div>
    )
}
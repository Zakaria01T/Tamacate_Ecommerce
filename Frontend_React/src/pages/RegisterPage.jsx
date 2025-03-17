import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/features/authSlice'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { status, error } = useSelector((state) => state.auth)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await dispatch(registerUser(formData))
        if (result.payload) navigate('/')
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Nom complet</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                {/* Champs email et password similaires à LoginPage */}

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
                >
                    {status === 'loading' ? <LoadingSpinner /> : 'S\'inscrire'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <span className="text-gray-600">Déjà inscrit ? </span>
                <Link to="/login" className="text-blue-600 hover:underline">
                    Se connecter
                </Link>
            </div>
        </div>
    )
}
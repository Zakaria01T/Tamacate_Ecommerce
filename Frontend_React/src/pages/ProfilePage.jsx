import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/features/authSlice'

export default function ProfilePage() {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    const [orders, setOrders] = useState([])

    // useEffect(() => {
    //   // Fetch user orders
    // }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Profil</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Informations personnelles</h2>
                    <p className="mt-2">Nom: {userInfo.name}</p>
                    <p>Email: {userInfo.email}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Historique des commandes</h2>
                    {orders.length === 0 ? (
                        <p className="mt-2 text-gray-600">Aucune commande passée</p>
                    ) : (
                        <div>{/* Afficher les commandes */}</div>
                    )}
                </div>

                <button
                    onClick={() => dispatch(logout())}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    )
}
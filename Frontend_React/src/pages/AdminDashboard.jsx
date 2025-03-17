import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts, deleteProduct } from '../redux/features/productSlice'

export default function AdminDashboard() {
    const dispatch = useDispatch()
    const { items, status } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tableau de bord</h1>
                <Link
                    to="/admin/new"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    + Nouveau Produit
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">Nom</th>
                            <th className="text-left p-4">Prix</th>
                            <th className="text-left p-4">Stock</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map(product => (
                            <tr key={product._id} className="border-b">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">€{product.price}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 space-x-2">
                                    <Link
                                        to={`/admin/edit/${product._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={() => dispatch(deleteProduct(product._id))}
                                        className="text-red-600 hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
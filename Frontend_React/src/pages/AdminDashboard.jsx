import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts, deleteProduct } from '../redux/features/productSlice'
import { HiDocumentAdd, HiFolderAdd, HiPlus } from 'react-icons/hi'

const AdminDashboard = () => {
    const dispatch = useDispatch()
    const { items, status } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link
                    to="/admin/product"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    <HiPlus className='text-xl' />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">Image</th>
                            <th className="text-left p-4">Nom</th>
                            <th className="text-left p-4">Prix</th>
                            <th className="text-left p-4">Stock</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length > 0 ? items.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className='p-4 w-20 h-20'><img src={product.image} /></td>
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">€{product.price}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 space-x-2">
                                    <Link
                                        to={`/admin/product/`}
                                        state={{ product }}
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
                        )) : null}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AdminDashboard;
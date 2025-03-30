import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { API } from '../api/api'
import { saveCart } from '../redux/features/cartSlice'

export default function ProductPage() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`)
                setProduct(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    if (loading) return <div>Chargement...</div>

    return (
        <div className="container mx-auto p-4">
            <div className="grid md:grid-cols-2 gap-8">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                />

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <p className="text-2xl">€{product.price}</p>
                    <p className="text-gray-600">{product.description}</p>

                    <button
                        onClick={() => dispatch(saveCart({ product_id: product.id, quantity: 1 }))}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Ajouter au Panier
                    </button>
                </div>
            </div>
        </div>
    )
}
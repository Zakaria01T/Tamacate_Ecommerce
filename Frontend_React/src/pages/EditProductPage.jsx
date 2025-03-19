import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductForm from '../components/ProductForm'
import { updateProduct, fetchProducts } from '../redux/features/productSlice'
import { API } from '../api/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function EditProductPage() {
    const { id: productId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get('https://fakestoreapi.com/products')
                setProduct(data)
                setError('')
            } catch (err) {
                setError('Failed to load product')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [productId])

    // Handle form submission
    const handleSubmit = async (formData) => {
        try {
            await dispatch(updateProduct({
                id: productId,
                productData: formData
            })).unwrap()

            // Refresh products list and redirect
            dispatch(fetchProducts())
            navigate('/admin')
        } catch (error) {
            console.error('Update failed:', error)
        }
    }

    if (loading) return <LoadingSpinner fullPage />

    if (error) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h2 className="text-red-500 text-xl">{error}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-gray-200 px-4 py-2 rounded"
                >
                    Retour
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Modifier le Produit</h1>
                <ProductForm
                    onSubmit={handleSubmit}
                    initialValues={product}
                    isEditing
                />
            </div>
        </div>
    )
}
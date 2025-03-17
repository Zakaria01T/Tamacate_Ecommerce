import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import { fetchProducts } from '../redux/features/productSlice'

export default function HomePage() {
    const dispatch = useDispatch()
    const { items, status } = useSelector((state) => state.products)


    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    return (
        <div className="container mx-auto p-4 h-screen overflow-y-scroll hide-scrollbar">
            <h1 className="text-3xl font-bold mb-6">Nos Produits</h1>


            {status === 'loading' ? (
                <div className="text-center">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                    {items.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
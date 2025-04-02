import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { fetchProducts } from '../redux/features/productSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCart } from '../redux/features/cartSlice';

export default function HomePage() {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    const { items, status, searchTerm } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchProducts())
        if (userInfo) {
            dispatch(fetchCart())
        }
    }, [dispatch])

  const filteredItems = items.length > 0 ? items.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <SearchBar />

      {status === 'loading' ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

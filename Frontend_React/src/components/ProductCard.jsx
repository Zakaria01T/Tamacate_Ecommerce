import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/features/cartSlice'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const addPanier = () => {
        if (true) {
            dispatch(addToCart(product))
        } else {
            navigate('/login')
        }
    }
    return (
        <div className="border p-4 rounded-lg shadow-lg">
            <img src={product.image} alt={product.title} className="h-48 w-full object-cover" />
            <h3 className="text-xl font-bold mt-2">{product.title}</h3>
            <p className="text-gray-600">{product.price}€</p>
            <button
                onClick={() => addPanier()}
                className="bg-green-500 text-white p-2 w-full mt-2"
            >
                Ajouter au panier
            </button>
        </div>
    )
}
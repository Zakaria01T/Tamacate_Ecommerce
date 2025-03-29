import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, saveCart } from '../redux/features/cartSlice';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { items, total } = useSelector((state) => state.cart);
    const navigate = useNavigate();

    const addPanier = () => {
        if (userInfo) {
            dispatch(addToCart(product))
            dispatch(saveCart({ product_id: product.id, quantity: 1 }))
        } else {
            navigate('/login')
        }
    }
};
return (
    <div className="border p-4 rounded-lg shadow-lg">
        <img src={`http://localhost:8000/images/products/${product.image}`} alt={product.name} className="h-48 w-full object-cover" />
        <h5 className="text-base font-bold mt-2">{product.name}</h5>
        <p className="text-orange-600 text-lg">{product.price}€</p>
        <button
            onClick={() => addPanier()}
            className="bg-green-500 text-white p-2 w-full mt-2"
        >
            Add to cart
        </button>
    </div>
);
}

};
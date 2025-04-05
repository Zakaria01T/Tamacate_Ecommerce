import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveCart } from '../redux/features/cartSlice';
import { HiShoppingCart, HiStar } from 'react-icons/hi';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const addPanier = () => {
        if (userInfo) {
            dispatch(saveCart({ product_id: product.id, quantity: 1 }))
        } else {
            navigate('/login')
        }
    }
    return (
        <div className="p-4 shadow-lg card hover:shadow-2xl transition duration-300 ease-in-out gap-y-2 rounded-lg bg-white flex flex-col justify-between">
            <img src={`http://localhost:8000/images/products/${product.image ? product.image : 'default.jpg'}`} alt={product.name} className="h-48 w-full object-contain rounded-lg" />
            <div className='flex justify-between items-center '>
                <h5 className="text-base font-bold mt-2">{product.name}</h5>
                <div className='flex items-center'>
                    <HiStar className='text-yellow-400 text-3xl' />
                    <p>{(Math.random() * 5).toFixed(1)}</p>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div>
                    <p className="text-red-600 text-2xl font-bold"><span className='text-xl'>MAD</span>{product.price}</p>
                    <p className="text-gray-400 line-through text-xl font-bold"><span className='text-lg'>MAD</span>{Number(product.price) + 55.50}</p>
                </div>
                <button
                    onClick={() => addPanier()}
                    className="bg-green-500 rounded-full text-white p-2 text-3xl w-fit mt-2 hover:bg-green-600 transition duration-300 ease-in-out"
                >
                    <HiShoppingCart />
                </button>
            </div>
        </div>
    );
}
export default ProductCard;
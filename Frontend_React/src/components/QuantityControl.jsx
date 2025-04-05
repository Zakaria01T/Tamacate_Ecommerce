import { useDispatch } from "react-redux";
import { updateCart } from "../redux/features/cartSlice";
import { useState } from "react";
import Swal from 'sweetalert2';

const QuantityControl = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > item.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The quantity exceeds the available stock.',
            });
            return;
        }
        const qty = Math.max(1, Math.min(item.stock, newQuantity));
        setQuantity(qty);
        dispatch(updateCart({ product_id: item.id, quantity: qty }));
    };
    return (
        <>
            <div className="flex w-fit items-center border rounded-lg overflow-hidden">
                <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    aria-label="Reduce quantity"
                >
                    -
                </button>

                <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-12 text-center border-0 focus:ring-0"
                    min="1"
                    max={item.stock}
                    aria-label="Quantity"
                />

                <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
        </>
    )
}

export default QuantityControl;
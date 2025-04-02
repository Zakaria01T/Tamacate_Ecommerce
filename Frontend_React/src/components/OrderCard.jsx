import { useDispatch, useSelector } from "react-redux";
import { HiX } from "react-icons/hi";
import { clearCurrentOrder } from "../redux/features/orderSlice";

const OrderCard = () => {
    const { currentOrder } = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    const calculTotalPrice = () => {
        let total = 0;
        currentOrder.map((item) => {
            total += item.product.price * item.quantity;
        });
        return total;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative w-11/12 max-w-3xl bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex justify-center items-center w-full">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Order ID:
                        </h2>
                        <p className="text-xl font-semibold text-black-800">{currentOrder[0].order_id}</p>
                    </div>
                    <HiX
                        className="text-3xl text-white  bg-red-500 p-1 rounded-lg cursor-pointer hover:bg-red-400"
                        onClick={() => dispatch(clearCurrentOrder())}
                    />
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {currentOrder.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-4"
                        >
                            <img
                                className="w-20 h-20 object-cover rounded-md"
                                src={`http://localhost:8000/images/products/${item.product.image}`}
                                alt={item.product.name}
                            />
                            <div className="flex-1 ml-4">
                                <p className="text-lg font-semibold text-gray-800">
                                    {item.product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {item.product.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">
                                    MAD {item.product.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 border-t pt-4 flex justify-end items-center">
                    <p className="text-lg  font-semibold text-black-800">
                        Total Price:
                    </p>
                    <p className="font-bold ">MAD {calculTotalPrice()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/features/cartSlice';
import iso from '../assets/images/iso.png';
import QuantityControl from '../components/QuantityControl';
import { HiX } from 'react-icons/hi';
import { createOrder } from '../redux/features/orderSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const { total, items } = useSelector((state) => state.cart);
    const [moreItems, setMoreItems] = useState(false);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePlaceOrder = async () => {
        Swal.fire({
            title: 'Processing Order',
            text: 'Your order is being processed. Please wait...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const resultAction = await dispatch(createOrder(paymentMethod));



        if (createOrder.fulfilled.match(resultAction)) {
            Swal.close();
            const { status, message, approval_url } = resultAction.payload;

            // Redirect to PayPal approval URL if available
            if (approval_url) {
                window.location.href = approval_url;
            }

            // Check if the order was created successfully
            else if (status === "success") {
                Swal.fire({
                    title: 'Success',
                    text: message,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/orders')
            } else {
                Swal.fire({
                    title: 'Error',
                    text: message,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else if (createOrder.rejected.match(resultAction)) {
            Swal.fire({
                title: 'Error',
                text: 'There was an issue processing your order. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }


    return (
        <div className=" mx-auto p-4 max-w-4xl" >
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4" >
                <div className="w-full md:w-2/3">
                    {/* Shipping Address */}
                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h2 className="text-xl font-bold mb-2">Payment Methods</h2>
                        <div className="flex flex-col md:flex-row justify-around gap-2 items-center">
                            <div className="mb-2 w-full">
                                <button
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`px-4 py-2 w-full rounded text-white ${paymentMethod === "COD" ? 'bg-green-400' : 'bg-gray-500'}`}
                                >
                                    Cash on Delivery (COD)
                                </button>
                            </div>
                            <div className="mb-2 w-full">
                                <button
                                    onClick={() => setPaymentMethod("paypal")}
                                    className={`px-4 py-2 w-full rounded text-white ${paymentMethod === "paypal" ? 'bg-green-400' : 'bg-gray-500'}`}
                                >
                                    PayPal
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items Details */}
                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h2 className="text-xl font-bold mb-2">Items' Details</h2>
                        <div className='flex justify-start items-center gap-2'>

                            {items.map((item, index) => (
                                <div key={index} className="flex flex-col justify-between items-center mb-2">
                                    <img className='w-24' src={`http://localhost:8000/images/products/${item.image}`} />
                                    <p className='font-bold'>
                                        MAD{item.price}
                                    </p>
                                    <QuantityControl
                                        item={item} />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setMoreItems(true)}
                            className="text-blue-500 hover:underline mt-2"
                        >
                            More items
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className='w-full md:w-1/3'>

                    <div className="bg-white p-4 rounded shadow mb-4 ">
                        <h2 className="text-xl font-bold mb-2">Summary</h2>
                        <div className="flex justify-between mb-2">
                            <p>Subtotal</p>
                            <p>€{total.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Shipping fee</p>
                            <p>Free</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>€{total.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 mt-4"
                        >
                            Pay now
                        </button>
                    </div>
                    <div className='bg-white p-4 rounded shadow mb-4 '>
                        <h3 className='text-blue-500 font-bold'>TAMACAT</h3>
                        <p>TamaCat keeps your information and payment safe
                        </p>
                        <img src={iso}></img>
                    </div>
                </div>

            </div>

            {moreItems && (
                <div className='fixed top-0 right-0 h-screen w-1/3 bg-white shadow-lg z-50 p-4'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-bold'>Items' details</h2>
                        <HiX
                            className='text-2xl cursor-pointer'
                            onClick={() => setMoreItems(false)}
                        />
                    </div>
                    <div className='flex flex-col gap-4 '>
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 border-b-2 pb-2 ">
                                <img className='w-16' src={`http://localhost:8000/images/products/${item.image}`} />
                                <div className='flex-1'>
                                    <p className='font-bold'>{item.name}</p>
                                    <p className='text-sm text-gray-500'>{item.description}</p>

                                    <div className='flex justify-between'>
                                        <p className='font-bold text-xl'>MAD {item.price}</p>
                                        <QuantityControl item={item} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByClient } from '../redux/features/orderSlice';
import OrderSearchBar from '../components/orderSearchBar';
import { HiArrowRight } from 'react-icons/hi';

function OrdersClientPage() {
    const dispatch = useDispatch();
    const { orders, status } = useSelector((state) => state.orders);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        dispatch(fetchOrdersByClient());
        console.log(orders)
    }, [dispatch]);

    const handleSearch = () => {
        filteredItems()
    };

    const filteredItems = orders?.filter((item) => {
        const matchesText =
            item.id.toString().includes(filterText) ||
            item.user_id.toString().includes(filterText) ||
            item.status.toLowerCase().includes(filterText.toLowerCase());
        return matchesText;
    });



    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Client Orders</h1>
            <OrderSearchBar
                filterText={filterText}
                setFilterText={setFilterText}
                onSearch={handleSearch}
            />
            {orders.map((order) => {
                <div>
                    <div>
                        <p>{order.status}</p>
                        <div>
                            <div>
                                <p>Order Date: {order.created_at}</p>
                                <p>Order ID: {order.id}</p>
                            </div>
                            <div>
                                <p>Order Details <HiArrowRight /></p>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            })
            }
        </div>
    );
}

export default OrdersClientPage;
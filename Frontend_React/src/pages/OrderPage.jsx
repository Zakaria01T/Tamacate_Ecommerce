import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, selectOrdersStatus } from '../slices/orderSlice';

const OrderPage = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const ordersStatus = useSelector(selectOrdersStatus);

    useEffect(() => {
        if (ordersStatus === 'idle') {
            dispatch();
        }
    }, [dispatch, ordersStatus]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Order Page</h1>
            <p>Here you can view and manage your orders.</p>
            {ordersStatus === 'loading' && <p>Loading orders...</p>}
            {ordersStatus === 'failed' && <p>Failed to load orders. Please try again later.</p>}
            {ordersStatus === 'succeeded' && (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <strong>Order ID:</strong> {order.id} <br />
                            <strong>Items:</strong> {order.items.join(', ')} <br />
                            <strong>Total:</strong> ${order.total}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderPage;
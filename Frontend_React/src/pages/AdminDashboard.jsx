import React, { useState, useEffect } from 'react';
import Turnover from '../components/Turnover';
import Statistics from '../components/Statistics';
import axios from 'axios';
import { fetchProducts } from '../redux/features/productSlice';
import { API } from '../api/api';
import { useDispatch } from 'react-redux';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const [ordersData, setOrdersData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [clientsData, setClientsData] = useState([]);

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const response = await API.get('/orders');
                setOrdersData(response.data.orders || []);
            } catch (error) {
                console.error('Error fetching orders data:', error);
            }
        };

        const fetchProductsData = async () => {
            try {
                const response = await dispatch(fetchProducts());
                setProductsData(response.data.products || []);
            } catch (error) {
                console.error('Error fetching products data:', error);
            }
        };

        const fetchClientsData = async () => {
            try {
                const response = await API.get('users');
                setClientsData(response.data.clients || []);
            } catch (error) {
                console.error('Error fetching clients data:', error);
            }
        };

        fetchOrdersData();
        fetchProductsData();
        fetchClientsData();
    }, []);

    return (
        <div className="w-[95%] mx-auto mt-2">
            <div>
                <Statistics
                    ordersData={ordersData}
                    productsData={productsData}
                    clientsData={clientsData}
                />
                <Turnover salesData={clientsData} />
            </div>
        </div>
    );
};

export default AdminDashboard;

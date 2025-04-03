import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Turnover from '../components/Turnover';
import Statistics from '../components/Statistics';
import { fetchProducts } from '../redux/features/productSlice';
import { fetchOrders } from '../redux/features/orderSlice';
import { API } from '../api/api';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await dispatch(fetchOrders('admin'));
        setOrdersData(response.payload.data || []);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const response = await dispatch(fetchProducts());
        setProductsData(response.payload || []);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };

    const fetchClientsData = async () => {
      try {
        const response = await API.get('users');
        setClientsData(response.data.users || []);
      } catch (error) {
        console.error('Error fetching clients data:', error);
      }
    };

    fetchOrdersData();
    fetchProductsData();
    fetchClientsData();
  }, []);

  return (
    <div className="w-[95%]  m-auto mt-2">
      <div>
        <Statistics
          ordersData={ordersData}
          productsData={productsData}
          clientsData={clientsData}
        />
        <Turnover salesData={ordersData} productData={productsData} />
      </div>
    </div>
  );
};

export default AdminDashboard;

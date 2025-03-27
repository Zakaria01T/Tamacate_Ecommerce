import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Turnover from '../components/Turnover';
import Statistics from '../components/Statistics';
import { fetchProducts } from '../redux/features/productSlice';
import { API } from '../api/api';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await API.get('/admin_order');
        setOrdersData(response.data.orders || []);
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
    <div className="w-[95%] mx-auto mt-2">
      <div>
        <Statistics
          ordersData={ordersData}
          productsData={productsData}
          clientsData={clientsData}
        />
        <Turnover salesData={productsData} />
      </div>
    </div>
  );
};

export default AdminDashboard;

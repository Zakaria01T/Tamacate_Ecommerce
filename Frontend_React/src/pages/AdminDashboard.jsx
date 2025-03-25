import React, { useState, useEffect } from 'react';
import Turnover from '../components/Turnover';
import Statistics from '../components/Statistics';
import axios from 'axios';

const AdminDashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const token = localStorage.getItem('csrf_token');
        const response = await axios.get('http://127.0.0.1:8000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrdersData(response.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const token = localStorage.getItem('csrf_token');
        const response = await axios.get('http://127.0.0.1:8000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductsData(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };

    const fetchClientsData = async () => {
      try {
        const token = localStorage.getItem('csrf_token');
        const response = await axios.get('http://127.0.0.1:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientsData(response.data.clients || []);
        console.log(response.data);
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

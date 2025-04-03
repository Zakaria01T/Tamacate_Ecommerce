import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { HiCheck, HiX, HiEye } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, cancelOrderClient, fetchOrderById } from '../redux/features/orderSlice';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderCard from '../components/OrderCard';
import { useParams } from 'react-router-dom';

function OrdersClientPage() {

  const dispatch = useDispatch();
  const { orders, status, currentOrder } = useSelector((state) => state.orders);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


  useEffect(() => {
    dispatch(fetchOrders('client'));
  }, [dispatch]);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Confirme the Cancel Option",
      text: "this action is  irreversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmText: "Yes, Cancel",
      cancelText: "Back"
    });

    if (result.isConfirmed) {
      try {
        Swal.showLoading();
        await dispatch(cancelOrderClient(id));

        await dispatch(fetchOrders('client'));

        Swal.fire("Success !", "The Order was cancelled with success.", "success");
      } catch (error) {
        Swal.fire("Erreur", error.message || "Failed Cancel", "error");
      }
    }
  };

  const handleShowItems = (id) => {
    Swal.fire({
      title: 'Loading Order Details',
      text: 'Please wait while we fetch the order details.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    dispatch(fetchOrderById(id)).finally(() => {
      Swal.close();
    });
  };

  const filteredItems = orders?.filter((order) =>
    order.id.toString().includes(filterText) ||
    order.user_id.toString().includes(filterText) ||
    order.status.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search orders"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          onClick={handleClear}
          className="ml-2 bg-gray-200 hover:bg-gray-300 p-2 rounded"
        >
          <HiX />
        </button>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: 'Order Number',
      selector: (row) => row.order_number,
      sortable: true,
    },
    {
      name: 'Full Name Client',
      selector: (row) => row.user.first_name + " " + row.user.last_name,
      sortable: true,
    },
    {
      name: 'Total Price',
      sortable: true,
      cell: (row) => (
        <span className="text-red-600 font-bold p-1 rounded">
          {row.total_price} <span className='text-xs'>MAD</span>
        </span>
      ),
    },
    {
      name: 'Status',
      sortable: true,
      cell: (row) => (
        <span className={`${row.status == "Pending" ? 'bg-yellow-500' : row.status == "Confirmed" ? "bg-green-600" : "bg-red-600"} font-bold p-2 text-white rounded-full`} >
          {row.status}
        </span >
      ),
    },
    {
      name: 'Payment Status',
      sortable: true,
      cell: (row) => (
        <span
          className={`${row.status_payment === 'unpaid' ? 'bg-red-500' : 'bg-green-500'} capitalize text-white px-4 py-2 rounded-full font-bold`}>
          {row.status_payment}
        </span >
      ),
    },
    {
      name: 'Payment Method',
      sortable: true,
      cell: (row) => (
        <span
          className={`${row.payment_method === 'cash' ? 'bg-green-600' : 'bg-sky-500'} capitalize text-white px-4 py-2 rounded-full font-bold`}>
          {row.payment_method}
        </span >
      ),
    },
    {
      name: 'Order Date',
      selector: (row) => new Date(row.created_at).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      sortable: true,
    },
    {
      width: '25%',
      name: 'Actions',
      cell: (row) => (
        <div className='flex gap-2'>
          <button
            title='View Order'
            onClick={() => handleShowItems(row.id)}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
          >
            <HiEye className='font-bold' />
          </button>
          {(row.status_payment === 'unpaid' && row.status === "Pending") && (
            <button
              title='Cancel'
              onClick={() => handleCancel(row.id)}
              className="bg-red-500 font-bold text-white p-3 hover:bg-white hover:text-red-600 rounded-full transition"
            >
              <HiX className='font-bold' />
            </button>
          )}
        </div>
      ),
      button: true,
    }
  ];

  return (
    <div className='container mx-auto p-4 gap-y-2 flex flex-col'>
      <h1 className='text-3xl font-bold border-b-4 border-green-400 w-fit'>Orders</h1>

      {currentOrder && <OrderCard />}

      <DataTable
        progressPending={status === 'loading'}
        progressComponent={<LoadingSpinner />}
        columns={columns}
        data={filteredItems || orders}
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={subHeaderComponent}
        subHeaderAlign="right"
        persistTableHead
        paginationResetDefaultPage={resetPaginationToggle}
        noDataComponent="No orders found"
      />
    </div>
  );
}

export default OrdersClientPage;
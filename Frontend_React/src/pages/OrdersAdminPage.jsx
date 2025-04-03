import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { HiCheck, HiEye, HiX } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, fetchOrders, updateOrder, updatePaymentOrder } from '../redux/features/orderSlice';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderCard from '../components/OrderCard';

function OrdersAdminPage() {
    const dispatch = useDispatch();
    const { orders, currentOrder, status } = useSelector((state) => state.orders);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [orderId, setOrderId] = useState(null)


    useEffect(() => {
        dispatch(fetchOrders('admin'))
    }, []);

    const filteredItems = orders?.filter(item => {
        const matchesText = item.user_id == filterText || item.id == filterText ||
            (item.created_at.includes(filterText))

        return matchesText;
    });

    const handlePay = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to mark this order as paid.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark as paid!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updatePaymentOrder(id));
                Swal.fire({
                    title: 'Updated!',
                    text: 'The order has been marked as paid.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                }
                );
            }
        });
    }

    const handleUpdateOrder = (id, status) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to update the order status.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateOrder({ id, status }));
                Swal.fire({
                    title: 'Updated!',
                    text: 'The order status has been updated.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });
    }

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
                    className="ml-2 bg-gray-200 hover:bg-gray-300  p-2 rounded"
                >
                    <HiX />
                </button>
            </div>
        );
    }, [filterText, resetPaginationToggle]);


    const handleShowCard = (id) => {
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
    }

    const columns = [
        {
            name: 'Order Number',
            selector: (row) => row.order_number,
            sortable: true,
        },
        {
            name: 'Client Id',
            selector: (row) => row.user_id,
            sortable: true,
        },
        {
            name: 'Total Price',
            sortable: true,
            cell: (row) => (
                <span className="text-red-600 font-bold p-1 rounded">
                    {row.total_price}  <span className='text-xs'>MAD</span>
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
            name: 'Status Payment',
            sortable: true,
            cell: (row) => (
                <button
                    disabled={row.status_payment === 'paid' || row.status === 'Cancelled'}
                    onClick={() => handlePay(row.id)}
                    className={`${row.status_payment === 'unpaid' ? 'bg-red-500' : 'bg-green-500'} capitalize text-white px-4 py-2 rounded-full font-bold`}>
                    {row.status_payment}
                </button >
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
            cell: (row) => <div className='flex gap-2'>
                <button
                    onClick={() => handleShowCard(row.id)}
                    title='View Order'
                    className="bg-blue-500 text-white px-4 py-2 rounded-full"><HiEye /></button>
                {(row.status_payment === 'unpaid' && row.status === 'Pending') && <button
                    title='Cancel'
                    onClick={() => handleUpdateOrder(row.id, 2)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full">
                    <HiX />
                </button>}
                {(row.status_payment === 'unpaid' && row.status === 'Pending') && <button
                    title='Confirm'
                    onClick={() => handleUpdateOrder(row.id, 1)}
                    className="bg-green-500 text-white px-4 py-2 rounded-full"><HiCheck /></button>}
            </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <>
            {currentOrder && <OrderCard />}
            <div className=' mx-auto p-4 gap-y-2 flex flex-col'>
                <h1 className='w-fit text-3xl font-bold border-b-4 border-green-600'>Orders</h1>
                <DataTable
                    progressPending={status === 'loading'}
                    progressComponent={<LoadingSpinner />}
                    columns={columns}
                    data={filteredItems}
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
        </>
    );
}

export default OrdersAdminPage;

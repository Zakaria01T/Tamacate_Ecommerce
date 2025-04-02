import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { HiCheck, HiX, HiEye } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, cancelOrderClient, fetchOrderById } from '../redux/features/orderSlice';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

function OrdersClientPage() {
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { statusOfPayment } = useParams()
    const { orders, status, currentOrder } = useSelector((state) => state.orders);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    useEffect(() => {
        if (statusOfPayment) {
            console.log(statusOfPayment)
        }
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
        dispatch(fetchOrderById(id));

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
            name: 'Order ID',
            selector: (row) => row.id,
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
                <span className="text-green-600 font-bold p-1 rounded">
                    {row.total_price} MAD
                </span>
            ),
        },
        {
            name: 'Status',
            sortable: true,
            cell: (row) => (
                <span className={`${row.status == 0 ? 'bg-yellow-500' : row.status == 1 ? "bg-green-600" : "bg-red-600"} font-bold p-2 text-white rounded-full`}>
                    {row.status == 0 ? "Pending" : row.status == 1 ? "Confirmed" : "Cancelled"}
                </span>
            ),
        },
        {
            name: 'Status Payment',
            sortable: true,
            cell: (row) => (
                <span
                    className={`${row.status_payment === 'unpaid' ? 'bg-red-500' : 'bg-green-500'} capitalize text-white px-4 py-2 rounded-full font-bold`}>
                    {row.status_payment}
                </span>
            ),
        },
        {
            name: 'Payment Method',
            sortable: true,
            cell: (row) => (
                <span
                    className={`${row.payment_method === 'cash' ? 'bg-green-600' : 'bg-sky-500'} capitalize text-white px-4 py-2 rounded-full font-bold`}>
                    {row.payment_method}
                </span>
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
                    {(row.status_payment === 'unpaid' && row.status === 0) && (
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
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-6'>Client Orders</h1>

            {/* Popup Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Order Details #{currentOrder?.id || ''}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>



                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
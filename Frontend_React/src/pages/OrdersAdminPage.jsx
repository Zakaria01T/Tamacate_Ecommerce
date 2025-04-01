import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { HiX } from 'react-icons/hi';
import { API } from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersByAdmin } from '../redux/features/orderSlice';

function OrdersAdminPage() {
    const dispatch = useDispatch()
    const { orders } = useSelector((state) => state.orders)
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


    useEffect(() => {
        dispatch(fetchOrdersByAdmin())
    }, []);

    const filteredItems = orders?.filter(item => {
        const matchesText = item.user_id == filterText || item.id == filterText ||
            (item.created_at.includes(filterText))

        return matchesText;
    });

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

    const columns = [
        {
            name: 'Order ID',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'Client Id',
            selector: (row) => row.user_id,
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: (row) => `MAD${row.total_price}`,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
        },
        {
            name: 'Status Payment',
            selector: (row) => row.status_payment,
            sortable: true,
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
    ];

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold'>Client Orders</h1>
            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                highlightOnHover
                striped
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

export default OrdersAdminPage;

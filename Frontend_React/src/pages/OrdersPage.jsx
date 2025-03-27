import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { HiX } from 'react-icons/hi';
import { API } from '../api/api';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


    useEffect(() => {
        // Fetch orders from the API
        const fetchOrders = async () => {
            const response = await API.get('/admin_order');
            setOrders(response.data.orders);
        }

        fetchOrders();
    }, []);

    const filteredItems = orders?.filter(item => {
        const matchesText = item.user_id.toLowerCase().includes(filterText.toLowerCase()) ||
            (item.status.toString().includes(filterText))

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
            name: 'Items',
            cell: (row) =>
                row.items.map((item) => (
                    <div key={item.id}>
                        {item.name} (x{item.quantity})
                    </div>
                )),
        },
        {
            name: 'Total Price',
            selector: (row) => `$${row.totalPrice}`,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
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

export default OrdersPage;

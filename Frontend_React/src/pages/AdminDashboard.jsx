import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/features/productSlice';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import DataTable from 'react-data-table-component';
import LoadingSpinner from '../components/LoadingSpinner';
import { API } from '../api/api';

const AdminDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const dispatch = useDispatch();
    const { items, status } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
        fetchCategories();
    }, [dispatch]);

    const fetchCategories = async () => {
        try {
            const response = await API.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const filterProducts = () => {
        if (!items) return [];
        return items.filter(product => product.name.toLowerCase().includes(filterText.toLowerCase()));
    }

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedRows.length} products?`)) {
            selectedRows.forEach(row => {
                dispatch(deleteProduct(row.id));
            });
            setToggleCleared(!toggleCleared);
            setSelectedRows([]);
        }
    };

    const columns = [
        {
            name: 'Image',
            selector: row => row.image,
            cell: row => (
                <img
                    src={row.image}
                    alt={row.name}
                    className="w-16 h-16 object-cover rounded-md"
                />
            ),
            width: '100px'
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Price',
            selector: row => `${row.price} MAD`,
            sortable: true
        },
        {
            name: 'Stock',
            selector: row => row.stock,
            sortable: true
        },
        {
            name: 'Category',
            cell: row => (
                categories.find(category => category.id === row.category_id)?.name || 'N/A'
            ),
            sortable: true
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <Link
                        to={`/admin/product/`}
                        state={{ product: row }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    >
                        <HiPencil />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    >
                        <HiTrash />
                    </button>
                </div >
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '120px'
        }
    ];

    const contextActions = (
        <button
            key="delete"
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
            <HiTrash className="mr-1" />
            Delete {selectedRows.length} selected
        </button>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link
                    to="/admin/product"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                >
                    <HiPlus className='text-xl' />
                    <span>Add Product</span>
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={items}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                contextActions={contextActions}
                fixedHeader
                pagination
                paginationPerPage={10}
                highlightOnHover
                pointerOnHover
                customStyles={{
                    headCells: {
                        style: {
                            backgroundColor: '#f3f4f6',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                        },
                    },
                    cells: {
                        style: {
                            paddingTop: '1rem',
                            paddingBottom: '1rem',
                        },
                    },
                }}
                responsive
                striped
                dense
                noDataComponent={<div className="py-8 text-center">No products found</div>}
                progressPending={status === 'loading'}
                progressComponent={<LoadingSpinner />}
                subHeader
                subHeaderComponent={
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="border p-2 rounded-lg w-full max-w-md"
                        onChange={e => setFilterText(e.target.value)}
                    />
                }
            />
        </div>
    );
};

export default AdminDashboard;
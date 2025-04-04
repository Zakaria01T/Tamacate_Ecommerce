import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import DataTable from 'react-data-table-component';
import { fetchProducts, deleteProduct } from '../redux/features/productSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { API } from '../api/api';

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = (id) => {
    import('sweetalert2').then((Swal) => {
      Swal.default.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this product!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteProduct(id));
          Swal.default.fire('Deleted!', 'The product has been deleted.', 'success');
        }
      });
    });
  };


  // Filter products based on search text
  const filteredItems = items?.filter((item) => {
    if (!filterText) return true; // If no filter text, show all items
    const matchesText = item.name.toLowerCase().includes(filterText?.toLowerCase())
      || (item.price.toString().includes(filterText))
      || (item.stock.toString().includes(filterText));

    const category = categories.find((cat) => cat.id === item.category_id);
    const matchesCategory = category
      ? category.name.toLowerCase().includes(filterText.toLowerCase())
      : false;

    return matchesText || matchesCategory;
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
          placeholder="Search products"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
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
      name: 'Image',
      selector: (row) => row.image,
      cell: (row) => {
        return (
          <img
            src={`http://localhost:8000/images/products/${row.image?row.image:'default.jpg'}`}
            alt={row.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        );
      },
      width: '100px',
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row) => `${row.price} MAD`,
      sortable: true,
    },
    {
      name: 'Stock',
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: 'Category',
      cell: (row) => (
        categories.find((category) => category.id === row.category_id)?.name || 'N/A'
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to="/admin/product/"
            state={{ product: row }}
            className="bg-blue-600 text-lg hover:bg-blue-700 text-white p-2 rounded-lg"
          >
            <HiPencil />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-600 text-lg hover:bg-red-700 text-white p-2 rounded-lg"
          >
            <HiTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];



  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold border-b-4 border-green-400 w-fit">Products</h1>
        <Link
          to="/admin/product"
          className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <HiPlus className="text-xl" />
          <span>Add Product</span>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        fixedHeader
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
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
        subHeader
        subHeaderComponent={subHeaderComponent}
        noDataComponent={<div className="py-8 text-center">No products found</div>}
        progressPending={status === 'loading'}
        progressComponent={<LoadingSpinner />}
      />
    </div>
  );
};

export default ProductsPage;

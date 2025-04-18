import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { fetchCategories, deleteCategory } from '../redux/features/categorySlice';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

export default function ShowCategories() {
  const dispatch = useDispatch();

  const { items: categories = [], status = 'idle', error = null } = useSelector(
    (state) => state.categories || { items: [] }
  );
  const safeCategories = Array.isArray(categories) ? categories : [];



  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);



  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action is irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory(id));
        Swal.fire(
          "Deleted!",
          "The category has been successfully deleted.",
          "success"
        );
      }
    });
  };


  const columns = [
    {
      name: 'ID',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin/categories/edit/${row.id}`}
            state={{ category: row }}
            className="text-white hover:bg-white hover:text-blue-700 bg-blue-500 p-2 rounded-full"
          >
            <HiPencil />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-white hover:bg-white hover:text-red-700 bg-red-500 p-2 rounded-full"
          >
            <HiTrash />
          </button>
        </div>
      ),
    },
  ];

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'failed') {
    return (
      <div className="p-4 text-red-500">
        Error: {error?.message || 'Failed to load categories'}
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold border-b-4 border-green-400">Categories</h1>
        <Link
          to="/admin/categories/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <HiPlus className="mr-1" /> Add Category
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <DataTable
          columns={columns}
          data={safeCategories}
          pagination
          highlightOnHover
          pointerOnHover
          responsive
        />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { API } from '../api/api';
import { createProduct, updateProduct } from '../redux/features/productSlice';
import LoadingSpinner from './LoadingSpinner';
import Swal from 'sweetalert2';
import { HiX } from 'react-icons/hi';

export default function ProductForm({ initialValues, onClose, categories, isLoading, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const { error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: null, // Image as a File object
    stock: 0,
    category_id: '',
    ...initialValues,
  });

  useEffect(() => {
    if (initialValues?.id) {
      setIsEditing(true);
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
        price: initialValues.price || 0,
        stock: initialValues.stock || 0,
      }));
    }
  }, [initialValues]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file, // Store as a File object
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!(formData.image instanceof File)) {
        delete formData.image;
      }
      if (isEditing) {
        dispatch(updateProduct({ id: initialValues.id, productData: formData }));
      } else {
        dispatch(createProduct(formData));
      }
      if (error) {

        Swal.fire({
          icon: 'error',
          title: error,
          text: 'Please try again.',
        });
      }


      Swal.fire({
        icon: 'success',
        title: `Product ${isEditing ? 'updated' : 'created'} successfully!`,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        onSuccess();
      });


    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to save product',
        text: 'Please try again.',
      });

    };
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto hide-scrollbar max-h-screen relative">
        <HiX
          className="text-2xl text-white bg-red-600 hover:text-red-600 hover:bg-white  rounded-lg absolute top-4 right-4 cursor-pointer"
          onClick={() => onClose()}
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Name Field */}
            <div>
              <label className="block mb-2 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Price Field */}
            <div>
              <label className="block mb-2 font-medium">Price (MAD)</label>
              <input
                type="number"
                name="price"
                step="0.1"
                min="1"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
              />
            </div>

            {/* Category Field */}
            <div>
              <label className="block mb-2 font-medium">Category</label>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.length > 0 && categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Image Field */}
            <div>
              <label className="block mb-2 font-medium">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={!isEditing}
              />
            </div>

            {/* Display Image */}
            {formData.image && (
              <img
                src={formData.image instanceof File
                  ? URL.createObjectURL(formData.image)
                  : `http://localhost:8000/images/products/${formData.image}`}
                alt="Product"
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}

            {/* Stock Field */}
            <div>
              <label className="block mb-2 font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

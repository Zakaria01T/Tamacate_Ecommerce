import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { API } from '../api/api';
import { createProduct, updateProduct } from '../redux/features/productSlice';
import LoadingSpinner from './LoadingSpinner';

export default function ProductForm() {
  const location = useLocation();
  const initialValues = location.state?.product || null;
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    fetchCategories();
  }, [initialValues]);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category_id', formData.category_id);

      // Append image only if a new file is selected
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      if (isEditing) {
        dispatch(updateProduct({ id: initialValues.id, productData: formDataToSend }));
      } else {
        dispatch(createProduct(formDataToSend));
      }

      alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate(-1);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto space-y-6 overflow-y-scroll h-screen hide-scrollbar p-4">
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
            min="0"
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
              : `http://localhost:8000/storage/${formData.image}`}
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
  );
}

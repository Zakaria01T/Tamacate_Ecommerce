import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../api/api';
import { useDispatch } from 'react-redux';
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
        image: null,
        stock: 0,
        category_id: '',
        ...initialValues
    });

    useEffect(() => {
        if (initialValues?.id) {
            setIsEditing(true);
            setFormData(prev => ({
                ...prev,
                ...initialValues,
                price: initialValues.price || 0,
                stock: initialValues.stock || 0
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

    const handleChange = async (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            if (file) {
                try {
                    const base64 = await convertToBase64(file);
                    setFormData(prev => ({
                        ...prev,
                        [name]: "data:image/png;base64," + base64
                    }));
                } catch (error) {
                    console.error('Error converting image to Base64:', error);
                    alert('Failed to process the image. Please try again.');
                }
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock' ? Number(value) : value
            }));
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
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
            formDataToSend.append('image', formData.image);


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
                {/* Champ Nom */}
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

                {/* Champ Prix */}
                <div>
                    <label className="block mb-2 font-medium">Price (MAD)</label>
                    <input
                        type="number"
                        name="price"
                        step="0.1"
                        min="0"
                        value={formData.price || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Champ Description */}
                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded h-32"
                    />
                </div>

                {/* Champ Categories */}
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
                            {categories.length > 0 && categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Champ Image */}
                <div>
                    <label className="block mb-2 font-medium">l'image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required={!isEditing}
                    />
                </div>

                {/* Afficher l'image */}
                {formData.image && typeof formData.image === 'string' && (
                    <img
                        src={formData.image}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-lg"
                    />
                )}

                {/* Champ Stock */}
                <div>
                    <label className="block mb-2 font-medium">Stock disponible</label>
                    <input
                        type="number"
                        name="stock"
                        min="0"
                        value={formData.stock || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {isEditing ? 'Update' : 'Add product'}
                </button>
            </div>
        </form>
    );
}
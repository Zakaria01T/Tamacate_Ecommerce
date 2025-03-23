import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../api/api';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../redux/features/productSlice';

export default function ProductForm() {
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const initialValues = location.state?.product || {};
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        image: null,
        stock: 0,
        ...initialValues
    });


    useEffect(() => {
        if (initialValues) {
            setIsEditing(true);
            setFormData(prev => ({
                ...prev,
                ...initialValues,
                price: initialValues.price || 0,
                stock: initialValues.stock || 0
            }));
        }
    }, [initialValues]);

<<<<<<< HEAD
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
            
        }))
    }

    

    const handleSubmit = (e) => {
        e.preventDefault()
        API.post('/products', formData)
            .then(response => {
                console.log(response.data)
              })
              console.log(formData);
    }
=======
    const handleChange = async (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            // Convert the image file to a Base64 string
            const file = files[0];
            if (file) {
                const base64 = await convertToBase64(file);
                setFormData(prev => ({
                    ...prev,
                    [name]: base64 // Store the Base64 string
                }));
            }
        } else {
            // Handle other inputs
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock' ? Number(value) : value
            }));
        }
    };

    // Helper function to convert a file to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Extract Base64 data
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const endpoint = isEditing ? `/products/${initialValues.id}` : '/products';
            const method = isEditing ? 'put' : 'post';

            const response = await API[method](endpoint, formData);

            if (isEditing) {
                dispatch(updateProduct(response.data));
            } else {
                dispatch(createProduct(response.data));
            }

            alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
            navigate(-1);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        }
    };
>>>>>>> 6dfbecf9f77d13589e2892b3224c42c962c5ffde

    return (
        <form onSubmit={handleSubmit} className="container mx-auto space-y-6 overflow-y-scroll h-screen hide-scrollbar p-4">
            <div className="grid gap-4">
                {/* Champ Nom */}
                <div>
                    <label className="block mb-2 font-medium">Nom du produit</label>
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
                    <label className="block mb-2 font-medium">Prix (€)</label>
                    <input
                        type="number"
                        name="price"
                        step="0.1"
                        min="0"
                        value={formData.price}
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

                {/* Champ Image */}
                <div>
                    <label className="block mb-2 font-medium">l'image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required={!isEditing} // Only required for new products
                    />
                </div>

                {/* Afficher l'image */}
                {formData.image && (
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
                        value={formData.stock}
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
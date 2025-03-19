import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api/api'

export default function ProductForm({
    onSubmit,
    initialValues,
    isEditing = false
}) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        image: '',
        ...initialValues
    })

    // Update form data when initialValues change
    useEffect(() => {
        if (initialValues) {
            setFormData(prev => ({
                ...prev,
                ...initialValues,
                price: initialValues.price || 0
            }))
        }
    }, [initialValues])

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
    }

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
                        step="0.01"
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
                    <label className="block mb-2 font-medium">URL de l'image</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

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
                        required
                    />
                </div>

                {/* Prévisualisation de l'image */}
                {!formData.image && (
                    <div className="mt-4">
                        <p className="mb-2 font-medium">Prévisualisation :</p>
                        <img
                            src={formData.image}
                            alt="Preview"
                            className="w-48 h-48 object-cover rounded-lg border"
                        />
                    </div>
                )}
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
                    {isEditing ? 'Mettre à jour' : 'Créer le produit'}
                </button>
            </div>
        </form>
    )
}
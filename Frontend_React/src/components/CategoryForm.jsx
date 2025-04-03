import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { createCategory, updateCategory } from '../redux/features/categorySlice';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

export default function CategoryForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer la catégorie en mode édition
  const categoryToEdit = location.state?.category || null;
  // console.log(categoryToEdit);
  // Références pour les champs du formulaire
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  // État de chargement
  const [loading, setLoading] = useState(false);

  // Remplir les champs si on est en mode édition
  useEffect(() => {
    if (categoryToEdit) {
      nameRef.current.value = categoryToEdit.name;
      descriptionRef.current.value = categoryToEdit.description;
    }
  }, [categoryToEdit]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const categoryData = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
    };

    try {
      if (categoryToEdit) {
        // Mode mise à jour
        await dispatch(updateCategory({ id: categoryToEdit.id, categoryData }));
        Swal.fire({
          title: "Updated successfully !",
          text: "The catégory was updated succesfully",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK"
        });
      } else {
        // Mode création
        await dispatch(createCategory(categoryData));
        Swal.fire({
          title: "Created successfully !",
          text: "The catégory was created succesfully",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK"
        });
      }
      navigate('/admin/categories'); // Rediriger après succès
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">        
          {categoryToEdit ? 'Update Category' : 'Create Category'}
        </h1>
        <Link
          to="/admin/categories"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
        Back
        </Link>
      </div>

      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            ref={nameRef}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            ref={descriptionRef}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 p-2 rounded-full transition duration-300"
        >
          {categoryToEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}

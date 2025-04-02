import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/features/userSlice';
import Swal from 'sweetalert2';

export default function ProfileInfo({ user, className = '' }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    ...user,
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    _method: 'PUT',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user?.image
      ? `http://localhost:8000/${user.image}`
      : 'https://www.pngkey.com/png/full/349-3499617_person-gray.png',
  );

  useEffect(() => () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        const filePreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(filePreviewUrl);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('email', formData.email);
    data.append('phone_number', formData.phone_number);
    data.append('_method', 'PUT');

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we update your profile.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await dispatch(updateUser(data)).unwrap();

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been successfully updated.',
        showConfirmButton: false
      }).then(window.location.reload());

      setSelectedFile(null);
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating your profile. Please try again.',
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md mb-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

      <div className="flex items-center mb-6">
        <img
          onClick={handleClick}
          src={previewUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full cursor-pointer object-cover"
        />
        <input
          ref={fileInputRef}
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

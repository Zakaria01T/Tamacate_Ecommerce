import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../redux/features/userSlice';
import Swal from 'sweetalert2';

export default function PasswordChange() {
  const dispatch = useDispatch();
  const [passwordData, setPasswordData] = useState({
    password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [inEditPassword, setInEditPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Show loading indicator
    Swal.fire({
      title: 'Processing',
      html: 'Updating your password...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Dispatch the updatePassword action and wait for the result
      const result = await dispatch(updatePassword(passwordData)).unwrap();

      // On success
      Swal.fire({
        title: 'Success!',
        text: 'Your password has been updated successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });

      setInEditPassword(false);
      setPasswordData({
        password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      // On error
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update password. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEdit = () => {
    setInEditPassword(!inEditPassword);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {inEditPassword ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                  minLength="8"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  required
                  minLength="8"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Password</h2>
          <p className="text-gray-600 mb-4">
            To change your password, please enter your current password and your new password below.
          </p>
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { deleteAccount } from '../redux/features/userSlice';
import ConfirmationModal from './ConfirmationModal';

export default function AccountDeletion() {
  const dispatch = useDispatch();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const handleConfirmDeleteModal = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmationPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter your password to confirm account deletion',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Show loading indicator
    const swalInstance = Swal.fire({
      title: 'Processing',
      html: 'Deleting your account...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await dispatch(deleteAccount(confirmationPassword)).unwrap();

      // Close loading indicator
      await swalInstance.close();

      // Show success message
      await Swal.fire({
        title: 'Account Deleted',
        text: 'Your account has been successfully deleted.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Reset state
      setIsConfirmingDelete(false);
      setConfirmationPassword('');
    } catch (error) {
      // Close loading indicator
      await swalInstance.close();

      // On error
      Swal.fire({
        title: 'Deletion Failed',
        text: error.message || 'Failed to delete account. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
    setConfirmationPassword('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Delete Account</h2>
      <p className="text-gray-600 mb-4">
        If you want to delete your account, please click the button below.
        <span className="block text-red-500 font-medium mt-1">
          Warning: This action is permanent and cannot be undone.
        </span>
      </p>
      <button
        onClick={handleConfirmDeleteModal}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Delete Account
      </button>

      {isConfirmingDelete && (
        <ConfirmationModal
          message="Are you absolutely sure you want to delete your account? All your data will be permanently removed."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Delete Account"
          confirmButtonStyle="bg-red-600 hover:bg-red-700"
          passwordInput={(
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter your password to confirm..."
                value={confirmationPassword}
                onChange={(e) => setConfirmationPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                For security, please enter your password to confirm deletion.
              </p>
            </div>
          )}
        />
      )}
    </div>
  );
}

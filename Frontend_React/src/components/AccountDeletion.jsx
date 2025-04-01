import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteAccount } from '../redux/features/userSlice';
import ConfirmationModal from './ConfirmationModal';

export default function AccountDeletion() {
  const dispatch = useDispatch();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const handleConfirmDeleteModal = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteAccount(confirmationPassword));
    setIsConfirmingDelete(false);
    setConfirmationPassword('');
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
      </p>
      <button
        onClick={handleConfirmDeleteModal}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Delete Account
      </button>

      {isConfirmingDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          passwordInput={(
            <input
              type="password"
              placeholder="Enter your password to confirm..."
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
      )}
    </div>
  );
}

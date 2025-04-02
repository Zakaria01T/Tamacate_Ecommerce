import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../redux/features/userSlice';
import ProfileInfo from '../components/ProfileInfo';
import PasswordChange from '../components/PasswordChange';
import AccountDeletion from '../components/AccountDeletion';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const resultAction = await dispatch(fetchUser());
        if (fetchUser.fulfilled.match(resultAction)) {
          setUser(resultAction.payload);
        } else if (fetchUser.rejected.match(resultAction)) {
          setError(resultAction.payload || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main content with split layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left half - ProfileInfo */}
        <div className="w-full md:w-1/2">
          <ProfileInfo user={user} />
        </div>

        {/* Right half - PasswordChange and AccountDeletion stacked */}
        <div className="w-full md:w-1/2 space-y-6">
          <PasswordChange />
          <AccountDeletion />
        </div>
      </div>
    </div>
  );
}

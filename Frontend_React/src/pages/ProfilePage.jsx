import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/features/userSlice';
import { logout } from '../redux/features/authSlice';
import ProfileInfo from '../components/ProfileInfo';
import PasswordChange from '../components/PasswordChange';
import AccountDeletion from '../components/AccountDeletion';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { status, user, error } = useSelector((state) => state.user);

    useEffect(() => {

        if (status === 'idle') {
            dispatch(fetchUser()).finally(() => {
                Swal.close();
            });
        }
        if (status === 'loading') {
            Swal.fire({
                title: 'Loading',
                text: 'Please wait while we fetch the user details.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }

        if (error) {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }, [dispatch, status, error]); // Add status and error to the dependency array

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
            </div>

            {/* Main content with split layout */}
            {user && status === 'succeeded' &&
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
                </div>}
        </div>
    );
};
export default ProfilePage;

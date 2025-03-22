// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ adminOnly = false }) {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login', { state: { from: location } });
        } else if (adminOnly && !userInfo.isAdmin) {
            navigate('/');
        }
    }, [userInfo, navigate, location, adminOnly]);

    // Ne rend rien si l'utilisateur n'est pas autorisé
    if (!userInfo || (adminOnly && !userInfo.isAdmin)) {
        return null;
    }

    return <Outlet />; // Rendre les routes imbriquées
}
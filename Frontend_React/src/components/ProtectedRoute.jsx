// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ adminOnly = false }) {
    const { token, isAdmin } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: location } });
        } else if (adminOnly && !isAdmin) {
            navigate('/');
        }
    }, [token, navigate, location, adminOnly]);

    // Ne rend rien si l'utilisateur n'est pas autorisé
    if (!token || (adminOnly && !isAdmin)) {
        return null;
    }

    return <Outlet />; // Rendre les routes imbriquées
}
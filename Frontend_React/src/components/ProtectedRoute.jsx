import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { userInfo } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!userInfo) {
            navigate('/login', { state: { from: location } })
        } else if (adminOnly && !userInfo.isAdmin) {
            navigate('/')
        }
    }, [userInfo, navigate, location, adminOnly])

    return userInfo ? children : null
}
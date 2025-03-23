import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import EditProductPage from './pages/EditProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductForm from './components/ProductForm';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Utilisez Layout comme élément parent */}
        <Route element={<Layout />}>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Routes admin */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/product" element={<ProductForm />} />
          </Route>

          {/* Routes d'authentification */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
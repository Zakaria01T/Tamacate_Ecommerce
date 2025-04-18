import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductForm from './components/ProductForm';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import ProductsPage from './pages/ProductsPage';
import OrdersAdminPage from './pages/OrdersAdminPage';
import OrdersClientPage from './pages/OrdersClientPage';
import ShowCategories from './pages/ShowCategories';
import CategoryForm from './components/CategoryForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Utilisez Layout comme élément parent */}
        <Route element={<Layout />}>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersClientPage />} />
          </Route>


          {/* Routes admin */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/orders" element={<OrdersAdminPage />} />
            {/* Routes categories */}
            <Route path="/admin/categories" element={<ShowCategories />} />
            <Route path="/admin/categories/create" element={<CategoryForm />} />
            <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />
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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AuthProvider from './contexts/AuthContext'
import CartProvider from './contexts/CartContext'
import FavoriteProvider from './contexts/FavoriteContext'
import CompareProvider from './contexts/CompareContext'
import HomePage from './pages/HomePage'
import TrangBoSuuTap from './pages/TrangBoSuuTap'
import TrangChiTietSanPham from './pages/TrangChiTietSanPham'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import FavoritePage from './pages/FavoritePage'
import ComparePage from './pages/ComparePage'
import DesignRoomPage from './pages/DesignRoomPage'
import BundlePage from './pages/BundlePage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <CompareProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collections" element={<TrangBoSuuTap />} />
                <Route path="/product/:id" element={<TrangChiTietSanPham />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={<FavoritePage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/design-room" element={<DesignRoomPage />} />
                <Route path="/bundle" element={<BundlePage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </CompareProvider>
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

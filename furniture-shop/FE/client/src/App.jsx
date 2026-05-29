import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AuthProvider from './contexts/AuthContext'
import CartProvider from './contexts/CartContext'
import HomePage from './pages/HomePage'
import TrangBoSuuTap from './pages/TrangBoSuuTap'
import TrangChiTietSanPham from './pages/TrangChiTietSanPham'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<TrangBoSuuTap />} />
            <Route path="/product/:id" element={<TrangChiTietSanPham />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

export default App

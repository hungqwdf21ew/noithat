import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import TrangBoSuuTap from './pages/TrangBoSuuTap'
import TrangChiTietSanPham from './pages/TrangChiTietSanPham'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<TrangBoSuuTap />} />
        <Route path="/product/:id" element={<TrangChiTietSanPham />} />
      </Routes>
    </Router>
  )
}

export default App

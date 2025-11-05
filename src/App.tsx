import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import ClientsPage from "./pages/ClientsPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import BomsPage from "./pages/BomPage";
import MaterialsPage from "./pages/MaterialsPage";
import SemiproductsPage from "./pages/SemiproductsPage";
import StockPage from "./pages/StockPage";
import CoveragePage from "./pages/CoveragePage";

export default function App() {
  useEffect(() => {
    // Пример запроса к бэкенду через прокси /api
    fetch('/api/boms')
      .then(res => res.json())
      .then(data => console.log("BOMs from API:", data))
      .catch(err => console.error("Error fetching BOMs:", err));
  }, []);

  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/clients">[ Клиенты ] </Link>
        <Link to="/products">[ Продукты ] </Link>
        <Link to="/orders">[ Заказы ] </Link>
        <Link to="/materials" className="hover:underline">[ Материалы ] </Link>
        <Link to="/semiproducts" className="hover:underline">[ Полуфабрикаты ] </Link>
        <Link to="/boms" className="hover:underline">[ BOM ] </Link>
        <Link to="/stock" className="hover:underline">[ Склад ] </Link>
        <Link to="/coverage" className="hover:underline">[ Покрытие запасов ]</Link>
        
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/semiproducts" element={<SemiproductsPage />} />
        <Route path="/boms" element={<BomsPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/coverage" element={<CoveragePage />} />
      </Routes>
    </Router>
  );
}
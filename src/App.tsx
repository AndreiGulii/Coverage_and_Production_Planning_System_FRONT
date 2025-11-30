// src/App.tsx
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

// Новая страница для Production Planner
import ProductionConfig from "./pages/ProductionConfig";

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
      <nav className="p-4 bg-gray-200 flex gap-4 flex-wrap">
        <Link to="/">[ Главная ]</Link>
        <Link to="/clients">[ Клиенты ]</Link>
        <Link to="/products">[ Продукты ]</Link>
        <Link to="/orders">[ Заказы ]</Link>
        <Link to="/materials">[ Материалы ]</Link>
        <Link to="/semiproducts">[ Полуфабрикаты ]</Link>
        <Link to="/boms">[ BOM ]</Link>
        <Link to="/stock">[ Склад ]</Link>
        <Link to="/coverage">[ Покрытие запасов ]</Link>
        <Link to="/production">[ Планирование производства ]</Link>
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

        {/* Новый маршрут для Production Planner */}
        <Route path="/production" element={<ProductionConfig />} />
      </Routes>
    </Router>
  );
}
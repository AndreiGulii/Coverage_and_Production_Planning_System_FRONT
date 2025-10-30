import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClientsPage from "./pages/ClientsPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/clients">Клиенты</Link>
        <Link to="/products">Продукты</Link>
        <Link to="/orders">Заказы</Link>
      </nav>

      <Routes>
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

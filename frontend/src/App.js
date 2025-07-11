import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductsByCategoryPage from './pages/ProductsByCategoryPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import Navbar from './components/Navbar';
import OrderSuccessPage from './pages/OrderSuccessPage';


function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Persist cart to localStorage
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // On mount, if token exists, fetch user profile
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data._id) {
            setUser({
              id: data._id,
              name: data.name,
              email: data.email,
              isAdmin: data.isAdmin
            });
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
          setAuthLoading(false);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token');
          setAuthLoading(false);
        });
    } else {
      setAuthLoading(false);
    }
  }, []); // Only run on mount

  if (authLoading) {
    return <div style={{textAlign:'center',marginTop:'3rem',fontSize:'1.2rem'}}>Loading...</div>;
  }

  return (
    <Router>
      <Navbar
        user={user}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
        cart={cart}
      />
      <Routes>
        {/* If admin, only show admin pages */}
        {user && user.isAdmin ? (
          <>
            <Route path="/admin/orders" element={<AdminOrdersPage user={user} />} />
            <Route path="/admin/products" element={<AdminProductsPage user={user} />} />
            {/* Redirect all other routes to /admin/products */}
            <Route path="*" element={<AdminProductsPage user={user} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsByCategoryPage />} />
            <Route path="/product/:id" element={<ProductPage cart={cart} setCart={setCart} />} />
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} user={user} />} />
            <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
            <Route path="/orders" element={<OrderHistoryPage user={user} />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

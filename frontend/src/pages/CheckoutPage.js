import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutPage({ cart, setCart, user }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      // Save intended redirect
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cart.map(item => ({
            product: item._id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image
          })),
          shippingAddress: { address, city, postalCode, country },
          paymentMethod: 'Cash on Delivery',
          totalPrice: cart.reduce((sum, item) => sum + item.price * item.qty, 0)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCart([]);
      // Generate random orderId
      const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
      navigate('/order-success', {
        state: {
          orderId,
          orderItems: cart
        }
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="checkout-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          left: 24,
          top: 24,
          bottom: -10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 28,
          color: '#007bff',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Go back"
        title="Go back"
      >
        ←
      </button>
      <h2>Checkout</h2>
      <form onSubmit={handleOrder} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        <input type="text" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required style={{ width: '100%', marginBottom: 20 }} />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button type="submit" style={{ width: '100%', maxWidth: 300, margin: 'auto', display: 'block', marginBottom: -50 }}>Place Order</button>
        </div>
      </form>
      {message && <div className="checkout-message">{message}</div>}
    </div>
  );
}

export default CheckoutPage;

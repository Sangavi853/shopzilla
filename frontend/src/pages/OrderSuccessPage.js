import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId, orderItems } = state || {};

  return (
    <div className="order-success-container" style={{ maxWidth: 500, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', textAlign: 'center' }}>
      <h2 style={{ color: '#28a745', fontWeight: 700, marginBottom: 16 }}>Hooray! Order Placed 🎉</h2>
      <p style={{ fontSize: 18, marginBottom: 24 }}>Thank you for shopping with us.</p>
      <div style={{ marginBottom: 24 }}>
        <strong>Order ID:</strong> <span style={{ color: '#007bff', fontWeight: 600 }}>{orderId}</span>
      </div>
      <div style={{ textAlign: 'left', margin: '0 auto 24px', maxWidth: 400 }}>
        <h4 style={{ marginBottom: 8 }}>Items Ordered:</h4>
        <ul style={{ paddingLeft: 20 }}>
          {orderItems && orderItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>
              {item.name} x {item.qty} <span style={{ color: '#888' }}>₹{item.price * item.qty}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => navigate('/products')}
        style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 16, cursor: 'pointer' }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default OrderSuccessPage;

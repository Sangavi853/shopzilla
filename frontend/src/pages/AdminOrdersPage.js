import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch orders'));
  }, [user]);

  if (!user || !user.isAdmin) return <div>Admin access required.</div>;

  return (
    <div>
      <h2>All Orders (Admin)</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul>
          {orders.map(order => (
            <li key={order._id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
              <div>Order ID: {order._id}</div>
              <div>User: {order.user?.name} ({order.user?.email})</div>
              <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
              <div>Total: ₹{order.totalPrice}</div>
              <div>Status: {order.isDelivered ? 'Delivered' : 'Pending'}</div>
              <div>Items:
                <ul>
                  {order.orderItems.map(item => (
                    <li key={item.product?._id || item.name}>{item.name} x {item.qty}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminOrdersPage;

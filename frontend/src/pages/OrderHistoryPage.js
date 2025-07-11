import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderHistoryPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="order-history-container" style={{ maxWidth: 700, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginBottom: 24 }}>My Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Order ID</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Total</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>Items</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ padding: 8, border: '1px solid #eee', color: '#007bff', fontWeight: 600 }}>{order._id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{new Date(order.createdAt).toLocaleString()}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>₹{order.totalPrice}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {order.orderItems.map((item, idx) => (
                      <li key={idx}>{item.name} x {item.qty}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>
                  {!order.isDelivered && (
                    <button
                      style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}
                      onClick={async () => {
                        if (!window.confirm('Are you sure you want to cancel this order?')) return;
                        try {
                          const token = localStorage.getItem('token');
                          await axios.delete(`http://localhost:5000/api/orders/${order._id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setOrders(orders.filter(o => o._id !== order._id));
                        } catch (err) {
                          alert('Failed to cancel order');
                        }
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistoryPage;

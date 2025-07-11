import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProductsByCategoryPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const category = query.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        // Remap categories: Audio, Computers, Cameras, Wearables -> Electronics
        const products = res.data.map(p => {
          if (["Audio", "Computers", "Cameras", "Wearables"].includes(p.category)) {
            return { ...p, category: "Electronics" };
          }
          return p;
        });
        const filtered = category && category !== 'All' ? products.filter(p => p.category === category) : products;
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="container mt-4" style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 40, paddingRight: 20, position: 'relative' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
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
      <h2 style={{ textAlign: 'center' }}>{category ? `Products in ${category.replace('Clothing', '').trim()}` : 'All Products'}</h2>
      {loading ? <div style={{ textAlign: 'center' }}>Loading...</div> : (
        <div className="product-list" style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {products.length === 0 && <div>No products found.</div>}
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <a href={`/product/${product._id}`}>View</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsByCategoryPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


function ProductPage({ cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);


  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
    setAdded(false); // Reset 'added' when navigating to a new product
    setQty(1); // Optionally reset quantity
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const addToCart = () => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + qty } : item));
    } else {
      setCart([...cart, { ...product, qty }]);
    }
    setAdded(true);
  };

  return (
    <div className="product-detail-container" style={{ position: 'relative' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          left: 24,
          top: 24,
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
      <div className="product-detail-image-section">
        <img className="product-detail-image" src={product.image || 'https://via.placeholder.com/400'} alt={product.name} />
      </div>
      <div className="product-detail-info-section">
        <h2 className="product-detail-title">{product.name}</h2>
        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-price">Price: <span>₹{product.price}</span></p>
        <p className="product-detail-stock">Stock: <span>{product.countInStock}</span></p>
        <div className="product-detail-actions">
          <label htmlFor="qty">Qty: </label>
          <input id="qty" type="number" min="1" max={product.countInStock} value={qty} onChange={e => setQty(Number(e.target.value))} disabled={added} />
          {added ? (
            <button className="btn btn-success add-to-cart-btn" onClick={() => navigate('/cart')}>View Cart</button>
          ) : (
            <button onClick={addToCart} disabled={product.countInStock === 0}>Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

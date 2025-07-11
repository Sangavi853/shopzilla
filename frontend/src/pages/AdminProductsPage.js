
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Use the same card style as HomePage
function AdminProductsPage({ user }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    fetchProducts();
    // eslint-disable-next-line
  }, [user]);

  const fetchProducts = (newProductId) => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        let prods = res.data;
        if (newProductId) {
          // Move the new product to the front
          const idx = prods.findIndex(p => p._id === newProductId);
          if (idx > -1) {
            const [newProd] = prods.splice(idx, 1);
            prods = [newProd, ...prods];
          }
        }
        setProducts(prods);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch products'));
  };


  const handleEdit = (product) => {
    setEditId(product._id);
    setEditFields({ ...product });
  };

  const handleFieldChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, editFields, { headers: { Authorization: `Bearer ${token}` } });
      setEditId(null);
      setEditFields({});
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/products', {
        name: 'New Product',
        description: 'Description',
        price: 0,
        image: 'https://via.placeholder.com/300x200?text=Product',
        countInStock: 0,
        category: 'Category'
      }, { headers: { Authorization: `Bearer ${token}` } });
      // Refetch and open the new product in edit mode, and show it first
      if (res.data && res.data._id) {
        await fetchProducts(res.data._id);
        setEditId(res.data._id);
        setEditFields(res.data);
      } else {
        await fetchProducts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (!user || !user.isAdmin) return <div>Admin access required.</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 40, paddingRight: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Admin Product Management</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <button onClick={handleAdd} style={{marginBottom:24, background:'#007bff', color:'#fff', border:'none', borderRadius:6, padding:'0.7rem 1.2rem', fontWeight:600, fontSize:'1.1rem', cursor:'pointer'}}>Add Product</button>
      <h3 style={{ textAlign: 'center', marginTop: 32 }}>All Products</h3>
      <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'flex-start', alignItems: 'stretch' }}>
        {products.map(product => (
          <div key={product._id} className="category-card" style={{ maxWidth: 340, minWidth: 220, flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, background: '#fff', padding: 16, textAlign: 'center', border: '1px solid #eee', position: 'relative', margin: '0 auto' }}>
            <img
              src={editId === product._id ? (editFields.image || 'https://via.placeholder.com/300x200?text=Product') : (product.image || 'https://via.placeholder.com/300x200?text=Product')}
              alt={editId === product._id ? editFields.name : product.name}
              className="category-img"
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
            />
            {editId === product._id ? (
              <>
                <input name="name" value={editFields.name} onChange={handleFieldChange} placeholder="Name" style={{ fontWeight: 700, fontSize: 22, color: '#222', marginTop: 8, textAlign:'center', marginBottom:4 }} />
                <input name="category" value={editFields.category} onChange={handleFieldChange} placeholder="Category" style={{ color: '#888', fontSize: 15, margin: '8px 0', textAlign:'center' }} />
                <input name="price" type="number" value={editFields.price} onChange={handleFieldChange} placeholder="Price" style={{ color: '#007bff', fontWeight: 600, fontSize: 18, textAlign:'center' }} />
                <input name="description" value={editFields.description} onChange={handleFieldChange} placeholder="Description" style={{ color: '#444', fontSize: 15, margin: '6px 0', textAlign:'center' }} />
                <input name="countInStock" type="number" value={editFields.countInStock} onChange={handleFieldChange} placeholder="Stock" style={{ color: '#888', fontSize: 14, textAlign:'center' }} />
                <input name="image" value={editFields.image} onChange={handleFieldChange} placeholder="Image URL" style={{ color: '#888', fontSize: 14, textAlign:'center' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                  <button onClick={()=>handleSave(product._id)} style={{marginRight:8}}>Save</button>
                  <button onClick={()=>{setEditId(null);setEditFields({});}}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="category-title" style={{ fontWeight: 700, fontSize: 22, color: '#222', marginTop: 8 }}>{product.name}</div>
                <div style={{ color: '#888', fontSize: 15, margin: '8px 0' }}>{product.category}</div>
                <div style={{ color: '#007bff', fontWeight: 600, fontSize: 18 }}>₹{product.price}</div>
                <div style={{ color: '#444', fontSize: 15, margin: '6px 0' }}>{product.description}</div>
                <div style={{ color: '#888', fontSize: 14 }}>Stock: <span style={{ color: '#222', fontWeight: 500 }}>{product.countInStock}</span></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                  <button onClick={()=>handleEdit(product)} style={{marginRight:8}}>Edit</button>
                  <button onClick={()=>handleDelete(product._id)} style={{background:'#d32f2f', color:'#fff'}}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


export default AdminProductsPage;

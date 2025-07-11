

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Representative images for some common categories
const categoryImages = {
  'Men Clothing': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  'Women Clothing': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  'Footwear': 'https://images.unsplash.com/photo-1591142204497-eae224609ff8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fEZvb3R3ZWFyfGVufDB8MnwwfHx8Mg%3D%3D',
};

function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        // Remap categories: Audio, Computers, Cameras, Wearables -> Electronics
        const products = res.data.map(p => {
          if (["Audio", "Computers", "Cameras", "Wearables"].includes(p.category)) {
            return { ...p, category: "Electronics" };
          }
          return p;
        });
        // Get unique categories from remapped products
        const cats = Array.from(new Set(products.map(p => p.category)));
        setCategories(['All', ...cats]);
      })
      .catch(err => console.error(err));
  }, []);

  // Arrange categories in a 3x3 matrix (rows of 3)
  const rows = [];
  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 40, paddingRight: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Shop by Category</h2>
      <div className="category-grid">
        {categories.map(category => (
          <a
            key={category}
            href={category === 'All' ? '/products' : `/products?category=${encodeURIComponent(category)}`}
            className="category-card text-decoration-none"
            aria-label={`Shop ${category} collection`}
            style={{ flex: 1, maxWidth: 340, minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, background: '#fff', padding: 16, textAlign: 'center', transition: 'box-shadow 0.2s', border: '1px solid #eee' }}
          >
            <img
              src={category === 'All' ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' : (categoryImages[category] || 'https://via.placeholder.com/300x200?text=Category')}
              alt={category + ' image'}
              className="category-img"
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
            />
            <div className="category-title" style={{ fontWeight: 700, fontSize: 22, color: '#222', marginTop: 8 }}>{category === 'All' ? 'All' : category.replace('Clothing', '').trim()}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

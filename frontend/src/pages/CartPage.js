import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  }, [cart]);

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  return (
    <div
      className="checkout-container"
      style={{
        maxWidth: 800,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "60px 2rem",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2000,
        width: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 28,
          color: "#007bff",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Go back"
        title="Go back"
      >
        ←
      </button>
      <h2 style={{ textAlign: "center", marginBottom: 15 }}>Your Cart</h2>
      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div>Your Cart</div>
          <div style={{ fontSize: 20, color: "#888", marginBottom: 12 }}>
            Cart is empty
          </div>
          <a
            href="/products"
            className="btn"
            style={{
              background: "#007bff",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 600,
              padding: "0.7rem 2.2rem",
              fontSize: 18,
              textDecoration: "none",
              marginTop: 8,
            }}
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cart.map((item) => (
              <div
                key={item._id}
                className="cart-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  padding: 16,
                  background: "#fafbfc",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                    background: "#f7f7f7",
                    marginRight: 16,
                  }}
                />
                <div style={{ flex: 2 }}>
                  <div style={{ fontWeight: 600, fontSize: 18 }}>
                    {item.name}
                  </div>
                  <div style={{ color: "#666", fontSize: 15 }}>
                    Qty: <span style={{ fontWeight: 500 }}>{item.qty}</span>
                  </div>
                  <div
                    style={{ color: "#007bff", fontWeight: 600, fontSize: 16 }}
                  >
                    Price: ₹{item.price}
                  </div>
                </div>
                <button
                  className="btn"
                  style={{
                    background: "#d32f2f",
                    color: "#fff",
                    borderRadius: 6,
                    fontWeight: 600,
                    padding: "0.5rem 1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              background: "#f7f7f7",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Total: <span style={{ color: "#007bff" }}>₹{total}</span>
            </div>
            <a
              href="/checkout"
              className="btn btn-success"
              style={{
                marginTop: 10,
                fontSize: 18,
                padding: "0.7rem 2.2rem",
                borderRadius: 8,
              }}
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;

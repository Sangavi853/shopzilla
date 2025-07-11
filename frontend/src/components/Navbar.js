import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout, cart }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">ShopZilla</Link>
      </div>
      <div className="navbar-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          // onChange={...} // You can add search logic here
        />
      </div>
      <div className="navbar-right">
        {user && user.isAdmin ? (
          <>
            <Link to="/admin/products" style={{ marginLeft: 8 }}>
              Manage Products
            </Link>
            <Link to="/admin/orders" style={{ marginLeft: 8 }}>
              All Orders
            </Link>
            <button style={{ marginLeft: 8 }} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {!isHome && <Link to="/">Home</Link>}
            <Link to="/cart" className="cart-link" style={{ marginLeft: 12 }}>
              <span className="cart-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-basket-icon lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
                <span className="cart-badge">
                  {cart && cart.length ? cart.length : 0}
                </span>
              </span>
            </Link>
            {user ? (
              <>
                <Link to="/orders" style={{ marginLeft: 8 }}>
                  My Orders
                </Link>
                <button style={{ marginLeft: 8 }} onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              isHome && (
                <Link style={{ marginLeft: 8 }} to="/login">
                  Login
                </Link>
              )
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

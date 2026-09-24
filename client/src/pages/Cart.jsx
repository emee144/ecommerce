import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQty = async (productId, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
      setError(`Only ${stock} in stock`);
      return;
    }

    setError('');
    try {
      const { data } = await axios.put(`${API_URL}/api/cart/items/${productId}`,
        { qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update qty');
    }
  };

  const handleRemove = async (productId) => {
    setError('');
    try {
      const { data } = await axios.delete(`${API_URL}/api/cart/items/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Empty your cart?')) return;

    setError('');
    try {
      const { data } = await axios.delete(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };
   
  
  if (loading) return <div className="loading">Loading cart...</div>;

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.qty;
  }, 0);
 
  const handleCheckout = () => {
  if (items.length === 0) return;

  const confirmed = window.confirm(
    `Place order for $${subtotal.toFixed(2)}?`
  );

  if (confirmed) {
    setCart({ items: [] });         
    alert('Order placed successfully');
  }
};
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">AccountHub</div>
        <nav>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/my-products" className="nav-link">My Products</Link>
          <Link to="/cart" className="nav-link active">Cart</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </nav>
      </header>

      <div className="dashboard-content">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ margin: 0 }}>My Cart</h1>
          {items.length > 0 && (
            <button className="btn-delete" onClick={handleClear}>
              Clear cart
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link to="/products" className="btn-primary" style={{ marginTop: '1rem' }}>
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {items.map((item) => {
                const p = item.product;
                if (!p) return null;

                return (
                  <div key={p._id} className="product-card">
                    <img src={p.image} alt={p.name} className="product-image" />
                    <div className="product-info">
                      <h3>{p.name}</h3>
                      <p className="product-category">{p.category}</p>
                      <p className="product-price">${Number(p.price).toFixed(2)}</p>
                      <p className="product-stock">
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                          margin: '0.75rem 0',
                        }}
                      >
                        <button
                          className="btn-delete"
                          disabled={item.qty <= 1}
                          onClick={() => handleQty(p._id, item.qty - 1, p.stock)}
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          className="btn-add"
                          disabled={item.qty >= p.stock}
                          onClick={() => handleQty(p._id, item.qty + 1, p.stock)}
                        >
                          +
                        </button>
                      </div>

                      <p className="product-price">
                        Line: ${(p.price * item.qty).toFixed(2)}
                      </p>

                      <button
                        className="btn-delete"
                        style={{ width: '100%' }}
                        onClick={() => handleRemove(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
              <button className="btn-checkout" onClick={handleCheckout} style={{ marginTop: '1rem' }} disabled={items.length === 0}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
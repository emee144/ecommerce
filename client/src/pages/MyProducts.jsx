import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
  const token = localStorage.getItem('token');

  const { data } = await axios.get(`${API_URL}/api/products/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  setProducts(data);
} catch (err) {
  setError(err.response?.data?.message || 'Failed to load your products');
}finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product forever? This action cannot be undone.'
    );

    if (!confirmed) return;

    setDeletingId(productId);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      // Remove product from UI
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="loading">Loading your products...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">AccountHub</div>
        <nav>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/my-products" className="nav-link active">My Products</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
        </nav>
      </header>

      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0 }}>My Products</h1>

          <Link to="/products/create" className="btn-add">
            + Add Product
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {products.length === 0 ? (
          <div className="empty-state">
            <p>You haven't added any products yet.</p>
            <Link to="/products/create" className="btn-primary" style={{ marginTop: '1rem' }}>
              Create your first product
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card" style={{height: "470px"}}>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">${product.price?.toFixed(2)}</p>
                  <p className="product-stock">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
                 <Link to={`/product/edit/${product._id}`} className='btn-addy' style={{width: "100%"}}>
                    Edit 
                  </Link>
                  <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="btn-delete"
                    >
                      {deletingId === product._id ? 'Deleting...' : 'Delete'}
                    </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProducts;
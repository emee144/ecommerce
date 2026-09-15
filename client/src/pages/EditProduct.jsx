import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==============================
  // GET PRODUCT
  // ==============================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('You are not logged in. Please log in again.');
        }

        const { data } = await axios.get(
          `${API_URL}/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setName(data.name || '');
        setCategory(data.category || '');
        setPrice(data.price ?? '');
        setStock(data.stock ?? '');
        setDescription(data.description || '');
        setImage(data.image || '');
      } catch (err) {
        console.error('Fetch product error:', err);

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load product'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ==============================
  // UPDATE PRODUCT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('You are not logged in. Please log in again.');
      }

      await axios.put(
        `${API_URL}/api/products/${id}`,
        {
          name,
          category,
          price: Number(price),
          stock: Number(stock),
          description,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/my-products');
    } catch (err) {
      console.error('Update product error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to update product'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="loading">
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">AccountHub</div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          <Link to="/products" className="nav-link">
            Products
          </Link>

          <Link to="/my-products" className="nav-link active">
            My Products
          </Link>

          <Link to="/settings" className="nav-link">
            Settings
          </Link>
        </nav>
      </header>

      <div className="dashboard-content">
        <div className="form-header">
          <h1>Edit Product</h1>

          <Link to="/my-products" className="btn-secondary">
            ← Back to My Products
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">

          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>

            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter product name"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>

            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="e.g. Electronics, Clothing..."
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>

            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">Stock *</label>

            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
              placeholder="0"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              placeholder="Enter a detailed description of the product..."
            />
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="image">Image URL</label>

            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Image Preview */}
          {image && (
            <div className="image-preview">
              <p>Image Preview:</p>

              <img
                src={image}
                alt="Preview"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <Link
              to="/my-products"
              className="btn-secondary"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;
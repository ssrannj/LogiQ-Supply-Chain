import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { wishlistService } from '../services/wishlistService';
import { Trash2, Loader2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await wishlistService.getWishlist();
            setWishlistItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await wishlistService.removeFromWishlist(id);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Wishlist</h1>
                    <p className="text-muted">You have {wishlistItems.length} items here</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>
                        Back to Shop
                    </Link>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p className="text-muted mt-4">Curating your favorites...</p>
                </div>
            ) : error ? (
                <div className="form-error" style={{ textAlign: 'center', padding: '3rem', background: '#fee2e2', borderRadius: '1rem' }}>
                    <p style={{ marginBottom: '1rem' }}>{error}</p>
                    <button onClick={fetchWishlist} className="btn-primary" style={{ width: 'auto' }}>Retry Connection</button>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="auth-card" style={{ textAlign: 'center', padding: '4rem', maxWidth: '100%' }}>
                    <ShoppingBag size={64} className="text-muted" style={{ margin: '0 auto 1.5rem', display: 'block', opacity: 0.5 }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
                    <p className="text-muted mb-6">Explore our catalog and find something you love!</p>
                    <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {wishlistItems.map(item => (
                        <div key={item.id} className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: '0', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item.productName}</h3>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', margin: '0.5rem 0' }}>${item.price}</p>

                                    <span className={`badge ${item.outOfStock ? 'badge-error' : 'badge-success'}`}>
                                        {item.outOfStock ? 'Waiting for Stock' : 'In Stock'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="btn-secondary"
                                    style={{
                                        color: '#ef4444',
                                        borderColor: '#fecaca',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem'
                                    }}
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    disabled={item.outOfStock}
                                    style={{
                                        flex: 2,
                                        fontSize: '0.875rem',
                                        padding: '0.6rem',
                                        opacity: item.outOfStock ? 0.5 : 1
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <Link
                                    to={`/customer/dashboard`}
                                    className="btn-secondary"
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        padding: '0.6rem'
                                    }}
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;

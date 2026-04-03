import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, Heart, Truck, ShieldCheck } from 'lucide-react';
import productService from '../services/productService';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            // Error handled by UI state if needed, but removing console log as requested
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            loadProducts();
            return;
        }

        try {
            setIsLoading(true);
            const data = await productService.searchProducts(keyword);
            setProducts(data);
        } catch (error) {
            // Error silent or handled by UI state
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadProducts();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Furniture Catalog</h1>
                    <p className="text-muted">Welcome back, {user?.fullName}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/wishlist" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <Heart size={18} /> Wishlist
                    </Link>
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '2.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px' }}>
                    <div style={{ flexGrow: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Search products by name or description..." 
                            className="form-input"
                            style={{ paddingLeft: '2.75rem', marginBottom: 0 }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 1.5rem' }}>Search</button>
                </form>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    {keyword ? `Search Results for "${keyword}"` : 'Available Products'}
                </h2>
                
                {isLoading ? (
                    <p className="text-muted">Loading products...</p>
                ) : products.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ 
                        padding: '4rem 2rem', 
                        textAlign: 'center', 
                        backgroundColor: '#f9fafb', 
                        borderRadius: '1rem',
                        border: '1px dashed #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ 
                            backgroundColor: '#f1f5f9', 
                            padding: '1.25rem', 
                            borderRadius: '50%',
                            color: '#64748b'
                        }}>
                            <Search size={32} />
                        </div>
                        <div>
                            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>No products found</p>
                            <p className="text-muted">We couldn't find anything matching "{keyword}"</p>
                        </div>
                        <button 
                            className="btn-secondary" 
                            style={{ marginTop: '0.5rem', width: 'auto' }}
                            onClick={() => { setKeyword(''); loadProducts(); }}
                        >
                            Clear search and see all
                        </button>
                    </div>
                )}
            </div>

            <div className="auth-card" style={{ maxWidth: '100%', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Your Orders & Protection</h3>
                        <p className="text-muted">Track shipments and manage warranties</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/customer/tracking" className="btn-primary" style={{ width: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Truck size={18} /> Track Order
                        </Link>
                        <Link to="/customer/warranties" className="btn-secondary" style={{ width: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={18} /> My Warranties
                        </Link>
                    </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.75rem', border: '1px solid #e0f2fe' }}>
                        <p style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Shipment</p>
                        <p style={{ fontWeight: 'bold' }}>ORD-5542</p>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Status: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>In Transit</span></p>
                        <Link to="/customer/tracking/ORD-5542" className="link" style={{ fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>View Timeline →</Link>
                    </div>
                    <div>
                        <p className="text-muted">No other active orders found in the last 30 days.</p>
                        <button className="btn-secondary mt-4" style={{ width: 'auto' }}>View Order History</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;

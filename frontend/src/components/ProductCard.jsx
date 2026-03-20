import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';

const ProductCard = ({ product, onWishlistUpdate }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleAddToWishlist = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            await wishlistService.addToWishlist(product.id);
            setSuccess(true);
            if (onWishlistUpdate) onWishlistUpdate();
            // Reset success after 2 seconds
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="auth-card card-hover" style={{ maxWidth: '100%', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>${product.price}</p>
                    </div>

                    <span className={`badge ${isOutOfStock ? 'badge-error' : 'badge-success'}`}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <button
                        onClick={handleAddToWishlist}
                        disabled={loading}
                        className="btn-secondary"
                        style={{
                            padding: '0.6rem',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            backgroundColor: success ? '#fee2e2' : 'white',
                            borderColor: success ? '#ef4444' : 'var(--border)',
                            color: success ? '#ef4444' : 'var(--text-muted)'
                        }}
                        title={isOutOfStock ? "Get notified" : "Add to Wishlist"}
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Heart size={20} fill={success ? "#ef4444" : "none"} color={success ? "#ef4444" : "currentColor"} />
                        )}
                    </button>
                </div>
            </div>

            {error && <p className="form-error" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>{error}</p>}

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    disabled={isOutOfStock}
                    className="btn-primary"
                    onClick={() => navigate('/customer/checkout', { state: { order: { id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), total: product.price, items: [{ name: product.name, count: 1, price: product.price }] } } })}
                    style={{
                        flex: 1,
                        fontSize: '0.875rem',
                        padding: '0.6rem',
                        opacity: isOutOfStock ? 0.5 : 1
                    }}
                >
                    Add to Cart
                </button>
            </div>

            {success && (
                <div className="toast" style={{ bottom: '1rem', right: '1rem', padding: '0.5rem 1rem', fontSize: '0.875rem', border: '1px solid #dcfce3' }}>
                    <div style={{ color: '#166534', fontWeight: '600' }}>Added to wishlist!</div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;

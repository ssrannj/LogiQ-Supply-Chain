import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Clock, AlertCircle, ArrowLeft, Loader2, Package, MoreVertical, CreditCard } from 'lucide-react';
import { warrantyService } from '../services/warrantyService';

const Warranties = () => {
    const navigate = useNavigate();
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchWarranties();
    }, []);

    const fetchWarranties = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await warrantyService.getWarranties();
            setWarranties(data);
        } catch (err) {
            setError('Failed to load protection plans. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const isExpired = (status) => status === 'EXPIRED';

    const handleClaim = async (id) => {
        setActionLoading(id);
        try {
            await warrantyService.claimSupport(id);
            alert('Support claim received! Our team will contact you shortly.');
        } catch (err) {
            alert('Error submitting claim: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>My Warranties</h1>
                        <p className="text-muted">Manage protection plans for your LogiQ products</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={fetchWarranties} disabled={loading}>
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Refresh Records'}
                </button>
            </div>

            {error && (
                <div className="form-error" style={{ marginBottom: '2rem', padding: '1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                    <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Securing your warranty records...</p>
                </div>
            ) : warranties.length === 0 ? (
                <div className="auth-card" style={{ textAlign: 'center', padding: '5rem', maxWidth: '100%', border: '2px dashed var(--border)', backgroundColor: '#f8fafc' }}>
                     <ShieldCheck size={64} className="text-muted" style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                     <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>No Active Warranties</h2>
                     <p className="text-muted">You don't have any products with registered warranties yet.</p>
                     <Link to="/customer/dashboard" className="btn-primary mt-6" style={{ width: 'auto' }}>Browse Furniture</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                    {warranties.map((warranty) => (
                        <div key={warranty.id} className="auth-card card-hover" style={{ 
                            maxWidth: '100%', 
                            marginBottom: 0, 
                            padding: '2rem', 
                            border: `1px solid ${isExpired(warranty.status) ? '#fee2e2' : 'var(--border)'}`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        backgroundColor: isExpired(warranty.status) ? '#fff1f2' : '#f0f9ff', 
                                        borderRadius: '0.75rem',
                                        boxShadow: `0 4px 6px -1px ${isExpired(warranty.status) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                                    }}>
                                        <ShieldCheck size={24} style={{ color: isExpired(warranty.status) ? '#ef4444' : 'var(--primary)' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{warranty.productName}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                                                <Package size={12} /> {warranty.orderId}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                                                <CreditCard size={12} /> ${warranty.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge ${isExpired(warranty.status) ? 'badge-error' : 'badge-success'}`} style={{ padding: '0.4rem 0.8rem', fontWeight: '700' }}>
                                    {warranty.status}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '2rem 0', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem' }}>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                        <Calendar size={14} /> Registered On
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1rem' }}>{warranty.purchaseDate}</p>
                                </div>
                                <div>
                                    <p className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                        <Clock size={14} /> Expires On
                                    </p>
                                    <p style={{ fontWeight: '700', fontSize: '1rem', color: isExpired(warranty.status) ? '#ef4444' : 'var(--text-main)' }}>{warranty.expiryDate}</p>
                                </div>
                            </div>

                            <div style={{ 
                                padding: '1rem', 
                                backgroundColor: isExpired(warranty.status) ? '#fff1f2' : '#eff6ff', 
                                borderRadius: '0.75rem', 
                                border: `1px solid ${isExpired(warranty.status) ? '#fecaca' : '#dbeafe'}` 
                            }}>
                                <p style={{ fontSize: '0.85rem', color: isExpired(warranty.status) ? '#e11d48' : '#1e40af', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', lineHeight: '1.5' }}>
                                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                                    <span>
                                        {isExpired(warranty.status) 
                                            ? 'Coverage has ended. You can still apply for a one-time extension within 30 days.' 
                                            : `Active LogiQ protection for ${warranty.period}. This covers all structural issues and manufacturing defects.`}
                                    </span>
                                </p>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button 
                                    className="btn-secondary" 
                                    style={{ flex: 1, fontSize: '0.9rem', fontWeight: '600' }}
                                    onClick={() => handleClaim(warranty.id)}
                                    disabled={actionLoading === warranty.id}
                                >
                                    {actionLoading === warranty.id ? <Loader2 size={16} className="animate-spin" /> : 'Claim Support'}
                                </button>
                                {isExpired(warranty.status) && (
                                    <button className="btn-primary" style={{ flex: 1, fontSize: '0.9rem', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
                                        Extend Plan
                                    </button>
                                )}
                            </div>
                            
                            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.5rem', fontFamily: 'monospace' }}>
                                PROTECTION ID: {warranty.id}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Warranties;


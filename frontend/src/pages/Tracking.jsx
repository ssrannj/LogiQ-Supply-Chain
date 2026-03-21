import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Package, Truck, Check, Clock, ShieldCheck, MapPin, ArrowLeft, Loader2, Search, AlertTriangle, FileText } from 'lucide-react';
import { orderService } from '../services/orderService';

const Tracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');

    const trackingSteps = [
        { key: 'VERIFYING', label: 'Verifying Payment', icon: FileText, desc: 'Checking bank transfer receipt' },
        { key: 'PROCESSING', label: 'Processing Order', icon: Clock, desc: 'Preparing item at warehouse' },
        { key: 'PACKED', label: 'Item Packed', icon: ShieldCheck, desc: 'Securely ready for shipping' },
        { key: 'SHIPPED', label: 'In Transit', icon: Truck, desc: 'On its way to destination' },
        { key: 'DELIVERED', label: 'Delivered', icon: Check, desc: 'Successfully handed over' }
    ];

    useEffect(() => {
        if (orderId) {
            fetchTracking(orderId);
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchTracking = async (id) => {
        setLoading(true);
        setError('');
        try {
            const data = await orderService.getTrackingStatus(id);
            setOrder(data);
        } catch (err) {
            setError('Shipment not found. Please check your tracking number and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/customer/tracking/${searchId.trim()}`);
        }
    };

    const getCurrentStepIndex = () => {
        const statusMap = {
            'VERIFYING': 0,
            'PROCESSING': 1,
            'PACKED': 2,
            'SHIPPED': 3,
            'DELIVERED': 4
        };
        return statusMap[order?.status] ?? -1;
    };

    const currentStepIndex = getCurrentStepIndex();

    if (loading) {
        return (
            <div className="dashboard-container">
                <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                    <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 2rem' }} />
                    <p className="text-muted" style={{ fontSize: '1.2rem' }}>Locating your shipment in our global logistics network...</p>
                </div>
            </div>
        );
    }

    if (!orderId) {
        return (
            <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div className="header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                            <ArrowLeft size={22} />
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Track Your Order</h1>
                            <p className="text-muted">Enter your shipment number to see real-time updates</p>
                        </div>
                    </div>
                </div>

                <div className="auth-card" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem' }}>
                    <form onSubmit={handleSearch}>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Search size={24} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="ORD-XXXXXX" 
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                style={{ paddingLeft: '3.5rem', height: '3.5rem', fontSize: '1.1rem' }} 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ height: '3.5rem', fontSize: '1.1rem' }}>Track Shipment</button>
                    </form>
                    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                            <strong>Example IDs:</strong> ORD-5542, ORD-1011
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
                <div className="auth-card" style={{ textAlign: 'center', padding: '6rem 4rem', maxWidth: '36rem', margin: '4rem auto' }}>
                    <div style={{ backgroundColor: '#fef2f2', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <AlertTriangle size={48} color="#ef4444" style={{ opacity: 0.5 }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Shipment Not Found</h2>
                    <p className="text-muted mb-8" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {error || "We couldn't find any tracking information for this Order ID."}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                         <button onClick={() => navigate('/customer/tracking')} className="btn-secondary" style={{ width: 'auto', padding: '1rem 2rem' }}>Try Another ID</button>
                         <Link to="/customer/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '1rem 2rem' }}>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/customer/dashboard" className="btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Shipment Details</h1>
                        <p className="text-muted">Tracking Reference: <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{order.id}</span></p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => fetchTracking(orderId)}>Refresh Status</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Order Details Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="auth-card" style={{ maxWidth: '100%', padding: '2rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.2rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Metadata</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: '#f8fafc', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                <Package size={36} className="text-primary" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '700', fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{order.productName}</p>
                                <p className="text-muted" style={{ fontWeight: '600' }}>Unit Value: ${order.price.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div style={{ padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '1rem', border: '1px solid #e0f2fe' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#0369a1' }}>
                                <Truck size={20} /> <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>SHIPPING SCHEDULE</span>
                            </div>
                            <p style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>{order.estimatedDelivery}</p>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Estimated Arrival Window</p>
                        </div>
                    </div>

                    <div className="auth-card" style={{ maxWidth: '100%', padding: '2rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.2rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Destination</h3>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <MapPin size={24} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-main" style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.6' }}>{order.address}</p>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Verified Logistics Hub Destination</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracking Progress */}
                <div className="auth-card" style={{ maxWidth: '100%', padding: '0', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Journey Timeline</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Real-time updates from transit sensors</p>
                        </div>
                        <span className="badge badge-success" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                            {order.status}
                        </span>
                    </div>
                    
                    <div style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {trackingSteps.map((step, index) => {
                                const isCompleted = index < currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const isPending = index > currentStepIndex;
                                
                                return (
                                    <div key={step.key} style={{ display: 'flex', gap: '2.5rem', position: 'relative', paddingBottom: index === trackingSteps.length - 1 ? '0' : '2.5rem' }}>
                                        {/* Timeline Line */}
                                        {index !== trackingSteps.length - 1 && (
                                            <div style={{
                                                position: 'absolute',
                                                left: '20px',
                                                top: '40px',
                                                bottom: '0',
                                                width: '2px',
                                                backgroundColor: isCompleted ? '#10b981' : '#e2e8f0',
                                                zIndex: 0
                                            }}></div>
                                        )}

                                        {/* Status Icon */}
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '50%',
                                            backgroundColor: isCompleted ? '#ecfdf5' : isCurrent ? '#eff6ff' : '#f8fafc',
                                            border: `2px solid ${isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : '#e2e8f0'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : '#94a3b8',
                                            zIndex: 1,
                                            boxShadow: isCurrent ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {isCompleted ? <Check size={20} strokeWidth={3} /> : <step.icon size={20} />}
                                        </div>

                                        {/* Status Content */}
                                        <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <p style={{ 
                                                        fontSize: '1.1rem',
                                                        fontWeight: '800',
                                                        color: isPending ? '#94a3b8' : 'var(--text-main)',
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        {step.label}
                                                    </p>
                                                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                                                </div>
                                                {isCompleted && (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        <Check size={14} /> COMPLETED
                                                    </span>
                                                )}
                                                {isCurrent && (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', backgroundColor: '#eff6ff', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', animation: 'pulse 2s infinite' }}>
                                                        CURRENT STATUS
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Step Details (if current or completed) */}
                                            {!isPending && (
                                                <div style={{ 
                                                    marginTop: '1.25rem', 
                                                    padding: '1.25rem', 
                                                    backgroundColor: isCurrent ? '#f0f9ff' : '#f8fafc', 
                                                    borderRadius: '1rem', 
                                                    border: `1px solid ${isCurrent ? '#dbeafe' : '#f1f5f9'}`,
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontWeight: '700', color: '#475569' }}>
                                                            {index === 0 ? 'Payment Verified' : index === 1 ? 'Warehouse Output' : index === 2 ? 'Packing Station 4' : index === 3 ? 'Carrier: LogiQ Fleet' : 'Signed by Customer'}
                                                        </span>
                                                        <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>12:45 PM</span>
                                                    </div>
                                                    <p className="text-muted">Item processed through automated scanner and verified against manifest.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracking;


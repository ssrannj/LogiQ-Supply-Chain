import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { damageTicketService } from '../services/damageTicketService';
import { AlertCircle, CheckCircle, Loader2, Camera, FileText, ArrowLeft, Package, ShieldAlert } from 'lucide-react';

const DamageReport = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        orderId: '',
        productId: '',
        description: '',
        image: null
    });

    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [preview, setPreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [createdTicket, setCreatedTicket] = useState(null);
    const [showQR, setShowQR] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.orderId.trim()) errors.orderId = 'Order ID is required';
        if (!formData.productId) errors.productId = 'Product ID is required';
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            errors.description = 'Please provide more details (min 20 characters)';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if (!validateForm()) return;

        setStatus('submitting');
        
        try {
            const ticket = await damageTicketService.createTicket({
                ...formData,
                userId: user?.id || 1 
            });
            setCreatedTicket(ticket);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMessage(err.message || 'Transmission failed. Logistics uplink unstable.');
        }
    };

    if (status === 'success') {
        const qrUrl = `http://localhost:8081/api/damage-tickets/${createdTicket?.id}/qr`;
        
        return (
            <div className="auth-container animate-fade-in">
                <div className="auth-card text-center glass-card" style={{ maxWidth: '40rem', padding: '4rem' }}>
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <ShieldAlert size={48} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Item Quarantined</h2>
                    <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                        The damage report for Order #{formData.orderId} has been filed. The item has been marked as **QUARANTINED** in the central manifest for audit.
                    </p>

                    {showQR ? (
                        <div className="animate-scale-in" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '1.5rem', display: 'inline-block', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                            <img src={qrUrl} alt="Ticket QR Label" style={{ width: '200px', height: '200px' }} />
                            <p style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-main)' }}>SCAN FOR LOGISTICS AUDIT</p>
                        </div>
                    ) : (
                        <button 
                            className="btn-secondary" 
                            style={{ marginBottom: '2rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            onClick={() => setShowQR(true)}
                        >
                            GENERATE LOGISTICS QR LABEL
                        </button>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/admin/dashboard" className="btn-primary">RETURN TO DASHBOARD</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="header" style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/admin/dashboard" className="btn-secondary" style={{ padding: '0', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '900' }}>Damage Protocol</h1>
                        <p className="text-muted">Initiate item quarantine and report logistics discrepancy</p>
                    </div>
                </div>
            </div>

            <div className="auth-card" style={{ maxWidth: '50rem', margin: '0 0 4rem 0', padding: '3.5rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Order Reference ID</label>
                            <div style={{ position: 'relative' }}>
                                <Package size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                <input
                                    type="text"
                                    name="orderId"
                                    className="form-input"
                                    style={{ paddingLeft: '3.5rem' }}
                                    placeholder="e.g. ORD-9921"
                                    value={formData.orderId}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '3.5rem', borderColor: fieldErrors.orderId ? '#ef4444' : '' }}
                                />
                                {fieldErrors.orderId && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{fieldErrors.orderId}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Product Vector ID</label>
                            <input
                                type="number"
                                name="productId"
                                className="form-input"
                                placeholder="e.g. 104"
                                value={formData.productId}
                                onChange={handleInputChange}
                                style={{ borderColor: fieldErrors.productId ? '#ef4444' : '' }}
                            />
                            {fieldErrors.productId && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{fieldErrors.productId}</p>}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                        <label className="form-label">Anomaly Description</label>
                        <textarea
                            name="description"
                            className="form-input"
                            style={{ minHeight: '12rem', paddingTop: '1.5rem' }}
                            placeholder="Describe the physical damage or shipment discrepancy in detail..."
                            value={formData.description}
                            onChange={handleInputChange}
                            style={{ minHeight: '12rem', paddingTop: '1.5rem', borderColor: fieldErrors.description ? '#ef4444' : '' }}
                        ></textarea>
                        {fieldErrors.description && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{fieldErrors.description}</p>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '3.5rem' }}>
                        <label className="form-label">Visual Evidence Artifact</label>
                        <div style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: '1.25rem',
                            padding: preview ? '1rem' : '4rem 2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '1rem', display: 'block' }} />
                            ) : (
                                <div>
                                    <Camera size={48} className="text-muted" style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                                    <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>Capture/Upload Damage Photo</p>
                                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>High-resolution evidentiary visual required</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {status === 'error' && (
                        <div style={{ backgroundColor: '#fff1f2', border: '1px solid #ef4444', color: '#991b1b', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <AlertCircle size={20} />
                            <span style={{ fontWeight: '700' }}>{errorMessage}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={status === 'submitting'}
                        style={{ height: '4.5rem', fontSize: '1.1rem', fontWeight: '900', letterSpacing: '0.05em' }}
                    >
                        {status === 'submitting' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                                <Loader2 size={24} className="animate-spin" /> INITIALIZING QUARANTINE...
                            </div>
                        ) : (
                            'SUBMIT DAMAGE REPORT'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DamageReport;

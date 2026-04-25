import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Wallet, Users, ArrowUpRight, DollarSign, Loader2 } from 'lucide-react';

const AccountantDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [driverSummary, setDriverSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txRes, summaryRes] = await Promise.all([
                api.get('/accountant/transactions'),
                api.get('/accountant/driver-summary')
            ]);
            setTransactions(txRes.data);
            setDriverSummary(summaryRes.data);
        } catch (err) {
            console.error("Failed to fetch accountant data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '10rem' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                <p className="text-muted mt-4">Syncing financial records...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="header" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '900' }}>Accountant Dashboard</h1>
                    <p className="text-muted">Cash reconciliation and logistics financial audit</p>
                </div>
                <button className="btn-secondary" onClick={fetchData}>Refresh Data</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
                {/* Driver Summary */}
                <div>
                    <div className="auth-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                <Users size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Cash per Driver</h3>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {driverSummary.map((item, idx) => (
                                <div key={idx} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '1.25rem',
                                    backgroundColor: 'var(--bg-color)',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border)'
                                }}>
                                    <span style={{ fontWeight: '600' }}>{item.driverName}</span>
                                    <span style={{ color: 'var(--success)', fontWeight: '900', fontSize: '1.1rem' }}>
                                        ${item.totalCash.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {driverSummary.length === 0 && <p className="text-muted">No collections recorded.</p>}
                        </div>
                    </div>

                    <div className="auth-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <Wallet size={24} style={{ opacity: 0.6 }} />
                            <span style={{ opacity: 0.6, fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.05em' }}>TOTAL LIQUIDITY</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>
                            ${driverSummary.reduce((acc, curr) => acc + curr.totalCash, 0).toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="auth-card" style={{ padding: '2rem', maxWidth: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <ArrowUpRight size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Transactions</h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '0 1rem' }}>ORDER ID</th>
                                    <th style={{ padding: '0 1rem' }}>DRIVER</th>
                                    <th style={{ padding: '0 1rem' }}>STATUS</th>
                                    <th style={{ padding: '0 1rem', textAlign: 'right' }}>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (tx.driverName && 
                                    <tr key={tx.id} style={{ backgroundColor: 'var(--bg-color)', transition: 'all 0.2s' }}>
                                        <td style={{ padding: '1.25rem 1rem', borderRadius: '1rem 0 0 1rem', fontWeight: 'bold' }}>{tx.orderId}</td>
                                        <td style={{ padding: '1.25rem 1rem' }}>{tx.driverName}</td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <span className={`badge ${tx.status === 'REJECTED' ? 'badge-error' : 'badge-success'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', borderRadius: '0 1rem 1rem 0', textAlign: 'right', fontWeight: '900' }}>
                                            ${tx.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantDashboard;

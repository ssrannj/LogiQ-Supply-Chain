import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Calculator, User, Star, AlertCircle, TrendingUp, DollarSign, PenTool, CheckCircle, X } from 'lucide-react';

const SignatureCanvas = ({ onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Blue-900
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  const save = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    onSave(dataURL);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full h-40 bg-white cursor-crosshair touch-none rounded-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      <div className="flex justify-between mt-2">
        <button onClick={clear} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1">Clear Signature</button>
        <span className="text-[10px] text-gray-400 self-center italic">Sign above to authorize payout</span>
      </div>
    </div>
  );
};

const BonusCalculator = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [bonusData, setBonusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyRemittance, setDailyRemittance] = useState([]);
  const [loadingRemittance, setLoadingRemittance] = useState(false);
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [signature, setSignature] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const API_BASE = 'http://localhost:8081/api/ledger';

  useEffect(() => {
    fetchDrivers();
    fetchDailyRemittance();
  }, []);

  const fetchDailyRemittance = async () => {
    setLoadingRemittance(true);
    try {
      const response = await axios.get(`${API_BASE}/daily-remittance`);
      setDailyRemittance(response.data);
    } catch (error) {
      console.error('Error fetching remittance:', error);
    } finally {
      setLoadingRemittance(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/drivers`);
      setDrivers(response.data);
      if (response.data.length > 0) {
        setSelectedDriverId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const calculateBonus = async () => {
    if (!selectedDriverId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/bonus/${selectedDriverId}`);
      setBonusData(response.data);
      setPaymentAmount(response.data.finalBonus.toFixed(2));
    } catch (error) {
      console.error('Error calculating bonus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (signatureData) => {
    if (!paymentAmount || !signatureData) {
        setMessage('Please provide amount and signature.');
        return;
    }

    setProcessingPayment(true);
    try {
      const response = await axios.post(`${API_BASE}/payment`, {
        driverId: selectedDriverId,
        amount: parseFloat(paymentAmount),
        signatureBase64: signatureData
      });
      setMessage(response.data);
      setShowPaymentModal(false);
      fetchDailyRemittance();
      setBonusData(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage('Failed to process payment.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const seedData = async () => {
    try {
      const response = await axios.post(`${API_BASE}/seed`);
      setMessage(response.data);
      fetchDrivers();
      fetchDailyRemittance();
    } catch (error) {
      setMessage('Error seeding data');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50/30">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-3 text-gray-900 tracking-tight">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Calculator className="text-white" size={28} />
            </div>
            Driver Ledger
          </h1>
          <p className="text-gray-500 mt-1">Financial management and bonus settlements</p>
        </div>
        <button 
          onClick={seedData}
          className="bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 px-5 py-2.5 rounded-xl transition-all text-sm font-semibold shadow-sm flex items-center gap-2"
        >
          <TrendingUp size={16} className="text-blue-500" />
          Seed Demo
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm animate-in fade-in zoom-in duration-300">
          <CheckCircle size={20} className="text-emerald-500" />
          <span className="font-medium">{message}</span>
          <button onClick={() => setMessage('')} className="ml-auto text-emerald-400 hover:text-emerald-600">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="relative z-10">
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-wider">Select Driver for Settlement</label>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <div className="relative group">
                <select 
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all font-medium text-gray-800"
                >
                  <option value="">-- Choose a driver --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.fullName} (ID: {d.id})</option>
                  ))}
                </select>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <TrendingUp size={16} className="text-gray-300" />
                </div>
              </div>
            </div>
            <button 
              onClick={calculateBonus}
              disabled={!selectedDriverId || loading}
              className="bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white px-10 py-4 rounded-2xl transition-all font-bold shadow-lg shadow-gray-200 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Calculate Earnings <TrendingUp size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {bonusData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Performance Audit</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-gray-600 font-bold flex items-center gap-3"><TrendingUp size={20} className="text-blue-500"/> Deliveries</span>
                  <span className="font-black text-2xl text-gray-900">{bonusData.deliveryCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-gray-600 font-bold flex items-center gap-3"><Star size={20} className="text-yellow-500"/> Avg Rating</span>
                  <span className="font-black text-2xl text-gray-900">{bonusData.averageRating.toFixed(1)} <span className="text-gray-400 text-sm">/ 5.0</span></span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl">
                  <span className="text-red-700 font-bold flex items-center gap-3"><AlertCircle size={20} className="text-red-500"/> Penalties</span>
                  <span className="font-black text-2xl text-red-600">-${bonusData.totalPenalties.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 text-[11px] text-gray-400 italic">
              * Calculated based on Sprint 4 performance metrics.
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-10 rounded-3xl shadow-2xl shadow-blue-200 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
            
            <h3 className="text-blue-200 text-xs font-black uppercase tracking-[0.2em] mb-8">Net Settlement Amount</h3>
            <div className="flex flex-col justify-center h-full">
              <p className="text-blue-200 text-sm mb-2 font-medium opacity-80">Final Calculated Bonus</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-blue-300">$</span>
                <span className="text-7xl font-black tracking-tighter leading-none">{bonusData.finalBonus.toFixed(2)}</span>
              </div>
              
              <div className="mt-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                  <span className="font-bold">Ready for payout</span>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-white text-blue-900 hover:bg-blue-50 py-4 rounded-xl font-black transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Pay Now <CheckCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-600 p-8 text-white relative">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black mb-2">Confirm Payment</h2>
              <p className="text-blue-100 text-sm opacity-80 font-medium">Authorize bonus payout to driver</p>
            </div>
            
            <div className="p-8">
              <div className="mb-8">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Payout Amount ($)</label>
                <div className="relative group">
                  <input 
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 px-6 text-3xl font-black text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                  />
                  <DollarSign className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={28} />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                  <PenTool size={14} /> Driver Signature
                </label>
                <SignatureCanvas onSave={(data) => handlePayment(data)} onClear={() => {}} />
              </div>

              <button 
                onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                        const dataURL = canvas.toDataURL('image/png');
                        handlePayment(dataURL);
                    }
                }}
                disabled={processingPayment || !paymentAmount}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              >
                {processingPayment ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>Submit Settlement <CheckCircle size={22} /></>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-6 font-medium">
                Payments are processed via LogiQ Secure Ledger Gateway
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Daily Remittance Table */}
      <div className="mt-12 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Daily Settlement Overview</h2>
            <p className="text-sm text-gray-500 font-medium">History of driver earnings and payouts</p>
          </div>
          <button 
            onClick={fetchDailyRemittance}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-gray-500"
            title="Refresh Ledger"
          >
            <TrendingUp size={20} className="rotate-90" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Driver Identity</th>
                <th className="px-8 py-5 text-center">Volume</th>
                <th className="px-8 py-5 text-right">Settled Amount</th>
                <th className="px-8 py-5 text-right">Ledger Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loadingRemittance ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-bold text-gray-500 tracking-widest uppercase text-xs">Accessing Ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : dailyRemittance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Calculator size={48} className="text-gray-200" />
                      <span className="font-medium">No ledger entries for the current cycle</span>
                    </div>
                  </td>
                </tr>
              ) : (
                dailyRemittance.map((item) => (
                  <tr key={item.driverId} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all font-black">
                          {item.driverName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-gray-900 group-hover:text-blue-900 transition-colors">{item.driverName}</div>
                          <div className="text-[11px] font-bold text-gray-400 tracking-wider">REF ID: #{item.driverId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-black group-hover:bg-blue-100 group-hover:text-blue-700 transition-all">
                        {item.transactionCount} Trans.
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-all">
                        ${item.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {dailyRemittance.length > 0 && (
              <tfoot className="bg-gray-50/80 font-bold border-t border-gray-100">
                <tr>
                  <td className="px-8 py-8">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Cumulative Ledger</span>
                    <span className="text-gray-900 font-black">Total Batch Sum</span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="text-2xl font-black text-gray-900">
                      {dailyRemittance.reduce((acc, curr) => acc + curr.transactionCount, 0)}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <span className="text-3xl font-black text-blue-700">
                      ${dailyRemittance.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default BonusCalculator;

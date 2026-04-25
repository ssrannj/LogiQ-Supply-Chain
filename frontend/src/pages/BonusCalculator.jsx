import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, User, Star, AlertCircle, TrendingUp } from 'lucide-react';

const BonusCalculator = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [bonusData, setBonusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyRemittance, setDailyRemittance] = useState([]);
  const [loadingRemittance, setLoadingRemittance] = useState(false);
  const [message, setMessage] = useState('');

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
    } catch (error) {
      console.error('Error calculating bonus:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    try {
      const response = await axios.post(`${API_BASE}/seed`);
      setMessage(response.data);
      fetchDrivers();
    } catch (error) {
      setMessage('Error seeding data');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="text-blue-600" />
          Driver Bonus Ledger
        </h1>
        <button 
          onClick={seedData}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Seed Demo Data
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Driver</label>
            <div className="relative">
              <select 
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
              >
                <option value="">-- Choose a driver --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.fullName} ({d.email})</option>
                ))}
              </select>
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>
          <button 
            onClick={calculateBonus}
            disabled={!selectedDriverId || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded-lg transition-all font-semibold flex items-center gap-2"
          >
            {loading ? 'Calculating...' : 'Calculate Bonus'}
          </button>
        </div>
      </div>

      {bonusData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">Performance Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><TrendingUp size={16}/> Deliveries</span>
                <span className="font-bold text-lg">{bonusData.deliveryCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><Star size={16} className="text-yellow-500"/> Avg Rating</span>
                <span className="font-bold text-lg">{bonusData.averageRating.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><AlertCircle size={16} className="text-red-500"/> Penalties</span>
                <span className="font-bold text-lg text-red-600">-${bonusData.totalPenalties.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white">
            <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-4">Final Payout</h3>
            <div className="flex flex-col justify-center h-full pb-6">
              <p className="text-blue-100 text-xs mb-1">Total Bonus Earned</p>
              <p className="text-5xl font-black">${bonusData.finalBonus.toFixed(2)}</p>
              <div className="mt-6 pt-4 border-t border-blue-400/30 text-xs text-blue-100">
                Formula: (Deliveries × ${bonusData.baseRate}) × (Rating/5) - Penalties
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Remittance Table */}
      <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daily Remittance Overview</h2>
            <p className="text-sm text-gray-500">Summary of today's driver earnings and activities</p>
          </div>
          <button 
            onClick={fetchDailyRemittance}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            Refresh Table
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Driver Name</th>
                <th className="px-6 py-4 font-semibold text-center">Transactions</th>
                <th className="px-6 py-4 font-semibold text-right">Total Remittance</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingRemittance ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading remittance data...
                    </div>
                  </td>
                </tr>
              ) : dailyRemittance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    No transactions recorded for today yet.
                  </td>
                </tr>
              ) : (
                dailyRemittance.map((item) => (
                  <tr key={item.driverId} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.driverName}</div>
                      <div className="text-xs text-gray-500">ID: #{item.driverId}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {item.transactionCount} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-lg font-bold text-blue-600">
                        ${item.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Processed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {dailyRemittance.length > 0 && (
              <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                <tr>
                  <td className="px-6 py-4">Total Report Sum</td>
                  <td className="px-6 py-4 text-center">
                    {dailyRemittance.reduce((acc, curr) => acc + curr.transactionCount, 0)}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-700">
                    ${dailyRemittance.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
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

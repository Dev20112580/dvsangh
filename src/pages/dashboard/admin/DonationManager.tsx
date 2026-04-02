import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Plus, Filter, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../supabase';

export default function DonationManager() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    thisMonth: 0,
    pending80G: 0,
    activeRecurring: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch Donations
      const { data: donData, error: donError } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (donError) throw donError;
      setDonations(donData || []);

      // Calculate Stats
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const thisMonthTotal = (donData || [])
        .filter(d => d.created_at >= firstDay && d.status === 'completed')
        .reduce((sum, d) => sum + Number(d.amount), 0);

      const pending80GCount = (donData || [])
        .filter(d => d.donor_pan && !d.is_80g_issued)
        .length;

      // Fetch Recurring Stats
      const { count: recurringCount, error: recError } = await supabase
        .from('recurring_donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (recError) throw recError;

      setStats({
        thisMonth: thisMonthTotal,
        pending80G: pending80GCount,
        activeRecurring: recurringCount || 0
      });

    } catch (err: any) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Donor', 'Amount', 'Date', 'Status', 'Method', 'PAN'];
    const rows = donations.map(d => [
      d.id,
      d.donor_name,
      d.amount,
      new Date(d.created_at).toLocaleDateString(),
      d.status,
      d.payment_method,
      d.donor_pan || 'N/A'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DVS_Donations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function handleIssue80G(id: string) {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ is_80g_issued: true })
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold text-dark-text">Donation Management</h3>
        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white border border-gray-200 text-dark-text px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm text-sm">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={exportToCSV}
            className="flex-1 md:flex-none bg-dvs-orange text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-sm text-sm"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => alert('NEFT Batch generated.')}
            className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-sm text-sm"
          >
            <Download size={16} /> NEFT
          </button>
          <button className="flex-1 md:flex-none bg-dvs-dark-green text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-sm text-sm">
            <Plus size={16} /> Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 bg-orange-50/30">
          <p className="text-sm text-medium-gray font-medium mb-1">Total Received (This Month)</p>
          <h4 className="text-3xl font-bold text-dvs-orange">₹{stats.thisMonth.toLocaleString()}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 bg-blue-50/30">
          <p className="text-sm text-medium-gray font-medium mb-1">80G Pending</p>
          <h4 className="text-3xl font-bold text-blue-600">{stats.pending80G}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 bg-green-50/30">
          <p className="text-sm text-medium-gray font-medium mb-1">Active Recurring</p>
          <h4 className="text-3xl font-bold text-green-600">{stats.activeRecurring} Donors</h4>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && !donations.length ? (
          <div className="p-12 text-center text-medium-gray flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-dvs-orange" />
            <p className="font-bold">Loading transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Transaction</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Donor</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Amount</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Status / Method</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(don => (
                  <tr key={don.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <p className="font-bold text-dark-text text-sm truncate max-w-[120px]">{don.id.split('-')[0]}...</p>
                      <p className="text-[10px] text-medium-gray">{new Date(don.created_at).toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-dark-text">{don.donor_name}</p>
                      <p className="text-xs text-medium-gray font-mono">{don.donor_pan || 'No PAN'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-dvs-orange">₹{Number(don.amount).toLocaleString()}</p>
                      <p className="text-xs text-medium-gray lowercase">education fund</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold mb-1 uppercase ${don.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{don.status}</span>
                      <p className="text-xs text-medium-gray">{don.payment_method}</p>
                    </td>
                    <td className="p-4">
                      {don.donor_pan && !don.is_80g_issued && (
                        <button 
                          onClick={() => handleIssue80G(don.id)}
                          className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Issue 80G
                        </button>
                      )}
                      {don.is_80g_issued && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
                          <CheckCircle2 size={12} /> Issued
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

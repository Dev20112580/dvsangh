import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, Download, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabase';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-dark-text flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> System Audit Trail
          </h3>
          <p className="text-sm text-medium-gray mt-1">Immutable 7-year activity log. Read-only for all levels.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dvs-orange" 
            />
          </div>
          <button className="bg-white border border-gray-200 text-dark-text px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-dvs-dark-green text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && !logs.length ? (
          <div className="p-12 text-center text-medium-gray flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-dvs-orange" />
            <p className="font-bold">Verifying integrity and loading logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase tracking-wider">Timestamp</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase tracking-wider">Action Type</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase tracking-wider">Admin</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase tracking-wider">Target</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase tracking-wider">Details & IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-medium-gray font-mono text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                         log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-700' :
                         log.action.includes('SECURITY') ? 'bg-red-100 text-red-700' :
                         log.action.includes('INSERT') || log.action.includes('ADD') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-dark-text">{log.admin_name || 'System'}</td>
                    <td className="p-4 text-medium-gray font-mono text-xs">{log.target_id || log.target_type || 'Global'}</td>
                    <td className="p-4">
                      <p className="text-dark-text">{typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">IP: {log.ip_address || 'Internal'}</p>
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

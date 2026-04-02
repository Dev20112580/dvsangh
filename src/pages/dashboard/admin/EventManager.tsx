import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Users, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../supabase';

export default function EventManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'workshop',
    event_date: '',
    location: '',
    description: '',
    capacity: 50
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          status: 'upcoming',
          registration_open: true
        }]);

      if (error) throw error;
      
      setShowForm(false);
      setFormData({
        title: '',
        event_type: 'workshop',
        event_date: '',
        location: '',
        description: '',
        capacity: 50
      });
      fetchEvents();
    } catch (err: any) {
      alert('Error saving event: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (err: any) {
      alert('Error deleting event: ' + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-dark-text">Event Management</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-dvs-dark-green text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90"
        >
          <Plus size={18} /> {showForm ? 'Close Form' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <h4 className="font-bold text-lg text-dark-text mb-4">New Event Details</h4>
          <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-medium-gray uppercase mb-1">Event Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-dvs-dark-green" 
                placeholder="E.g., Career Seminar" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-medium-gray uppercase mb-1">Event Type</label>
              <select 
                value={formData.event_type}
                onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-dvs-dark-green"
              >
                <option value="workshop">Workshop</option>
                <option value="sports">Sports</option>
                <option value="coaching">Coaching</option>
                <option value="cultural">Cultural</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-medium-gray uppercase mb-1">Date & Time</label>
              <input 
                type="datetime-local" 
                required
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-dvs-dark-green" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-medium-gray uppercase mb-1">Location / Link</label>
              <input 
                type="text" 
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-dvs-dark-green" 
                placeholder="Address or Zoom link" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-medium-gray uppercase mb-1">Capacity (Max Seats)</label>
              <input 
                type="number" 
                required
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-dvs-dark-green" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-medium-gray uppercase mb-1">Description</label>
              <textarea 
                rows={3} 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-dvs-dark-green" 
                placeholder="Event details..."
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl font-bold text-medium-gray bg-gray-100">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl font-bold text-white bg-dvs-dark-green flex items-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />} Save Event
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && !events.length ? (
          <div className="p-12 text-center text-medium-gray flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-dvs-orange" />
            <p className="font-bold">Fetching latest events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-medium-gray">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">No events scheduled yet.</p>
            <button onClick={() => setShowForm(true)} className="text-dvs-orange text-sm font-bold mt-2 hover:underline">Create your first event</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Title & Date</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Location</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Registrations</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <p className="font-bold text-dark-text">{ev.title}</p>
                      <p className="text-xs text-medium-gray flex items-center gap-1">
                        <Calendar size={12}/> {new Date(ev.event_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-medium-gray flex items-center gap-1"><MapPin size={14}/> {ev.location}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-dvs-dark-green h-2 rounded-full" 
                            style={{ width: `${Math.min((ev.registrations_count || 0) / (ev.capacity || 1) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-dark-text">{ev.registrations_count || 0}/{ev.capacity}</span>
                      </div>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button 
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      ><Trash2 size={16} /></button>
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

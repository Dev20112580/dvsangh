import React, { useState, useEffect } from 'react';
import { FileText, Image, Newspaper, UploadCloud, Plus, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../../../supabase';

export default function ContentManager() {
  const [activeSubTab, setActiveSubTab] = useState('news');
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    if (activeSubTab === 'news') fetchNews();
    if (activeSubTab === 'materials') fetchMaterials();
    if (activeSubTab === 'gallery') fetchGallery();
  }, [activeSubTab]);

  async function fetchNews() {
    setLoading(true);
    const { data } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false });
    setNews(data || []);
    setLoading(false);
  }

  async function fetchMaterials() {
    setLoading(true);
    const { data } = await supabase.from('study_materials').select('*').order('created_at', { ascending: false });
    setMaterials(data || []);
    setLoading(false);
  }

  async function fetchGallery() {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setGallery(data || []);
    setLoading(false);
  }

  async function handlePublishNews(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const content = formData.get('content');
    
    setLoading(true);
    const { error } = await supabase.from('news_articles').insert([{ 
      title, 
      content, 
      status: 'published',
      slug: (title as string).toLowerCase().replace(/ /g, '-') + '-' + Date.now()
    }]);
    
    if (error) alert(error.message);
    else {
      e.target.reset();
      fetchNews();
    }
    setLoading(false);
  }

  async function handleDelete(table: string, id: string) {
    if (!confirm('Are you sure?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert(error.message);
    else {
      if (table === 'news_articles') fetchNews();
      if (table === 'study_materials') fetchMaterials();
      if (table === 'gallery') fetchGallery();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-dark-text">Content Management</h3>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4 overflow-x-auto">
        <button onClick={() => setActiveSubTab('news')} className={`font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeSubTab === 'news' ? 'bg-blue-50 text-blue-600' : 'text-medium-gray hover:bg-gray-50'}`}>News & Blog</button>
        <button onClick={() => setActiveSubTab('materials')} className={`font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeSubTab === 'materials' ? 'bg-orange-50 text-orange-600' : 'text-medium-gray hover:bg-gray-50'}`}>Study Materials</button>
        <button onClick={() => setActiveSubTab('gallery')} className={`font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeSubTab === 'gallery' ? 'bg-green-50 text-green-600' : 'text-medium-gray hover:bg-gray-50'}`}>Photo Gallery</button>
      </div>

      {activeSubTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-lg text-dark-text mb-4">Publish News Article</h4>
            <form onSubmit={handlePublishNews} className="space-y-4">
              <input name="title" required type="text" placeholder="Article Title" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" />
              <textarea name="content" required rows={5} placeholder="Write the article content..." className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"></textarea>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 flex items-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />} Publish Article
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Title</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase">Status</th>
                  <th className="p-4 text-xs font-bold text-medium-gray uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {news.map(item => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="p-4 font-bold text-dark-text">{item.title}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">{item.status}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete('news_articles', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-dashed border-2 text-center py-12">
            <UploadCloud size={48} className="mx-auto text-orange-300 mb-4" />
            <h4 className="font-bold text-lg text-dark-text mb-2">Upload Study Reference</h4>
            <p className="text-sm text-medium-gray mb-6">PDF files up to 10MB for Student /Gyan access</p>
            <button type="button" onClick={() => alert('Storage integration pending bucket setup. Use DB insert for now.')} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90">Browse Files</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map(mat => (
              <div key={mat.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-dark-text">{mat.title}</p>
                  <p className="text-xs text-medium-gray">{mat.subject} • {mat.file_type}</p>
                </div>
                <button onClick={() => handleDelete('study_materials', mat.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'gallery' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-medium-gray mb-4">Live public gallery management</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button 
              onClick={() => alert('Batch upload integration pending.')}
              className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-200"
            >
              <Plus size={24} className="text-gray-400" />
            </button>
            {gallery.map(img => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={img.photo_url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => handleDelete('gallery', img.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

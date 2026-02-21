import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  History, 
  Download, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  Sparkles,
  Target,
  Clock,
  GraduationCap,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSyllabus } from './services/geminiService';
import { Syllabus, SyllabusRequest } from './types';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Syllabus[]>([]);
  const [currentSyllabus, setCurrentSyllabus] = useState<string | null>(null);
  const [formData, setFormData] = useState<SyllabusRequest>({
    title: '',
    level: 'Intermediate',
    targetAudience: 'Professional Developers',
    duration: '8 Weeks'
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/syllabi');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setLoading(true);
    try {
      const content = await generateSyllabus(formData);
      if (content) {
        setCurrentSyllabus(content);
        // Save to backend
        await fetch('/api/syllabi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            level: formData.level,
            content
          })
        });
        fetchHistory();
      }
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSyllabus = async (id: number) => {
    try {
      await fetch(`/api/syllabi/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Navigation */}
      <nav className="border-b border-black/5 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">CurricuForge AI</span>
          </div>
          <div className="flex gap-1 bg-black/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'generate' ? 'bg-white shadow-sm text-black' : 'text-black/60 hover:text-black'}`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Generate
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-black' : 'text-black/60 hover:text-black'}`}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'generate' ? (
            <motion.div 
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-12"
            >
              {/* Form Section */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-4">Forge Your Curriculum</h1>
                  <p className="text-black/60 text-lg">Design industry-aligned syllabi in seconds using advanced AI reasoning.</p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6 bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> Course Title
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Advanced Cloud Architecture"
                      className="w-full bg-black/5 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black transition-all outline-none"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-black/40 flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" /> Level
                      </label>
                      <select 
                        className="w-full bg-black/5 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                        value={formData.level}
                        onChange={e => setFormData({...formData, level: e.target.value})}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-black/40 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Duration
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. 12 Weeks"
                        className="w-full bg-black/5 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                        value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 flex items-center gap-2">
                      <Target className="w-3 h-3" /> Target Audience
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Senior Software Engineers"
                      className="w-full bg-black/5 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                      value={formData.targetAudience}
                      onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Generate Syllabus
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Result Section */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-black/5 shadow-sm min-h-[600px] flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                    <div className="flex items-center gap-3">
                      <Layout className="w-5 h-5 text-black/40" />
                      <span className="font-bold">Preview</span>
                    </div>
                    {currentSyllabus && (
                      <button 
                        onClick={() => {
                          const blob = new Blob([currentSyllabus], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${formData.title.replace(/\s+/g, '_')}_Syllabus.md`;
                          a.click();
                        }}
                        className="flex items-center gap-2 text-sm font-bold bg-black/5 px-4 py-2 rounded-xl hover:bg-black/10 transition-all"
                      >
                        <Download className="w-4 h-4" /> Export MD
                      </button>
                    )}
                  </div>
                  <div className="flex-1 p-8 overflow-y-auto prose prose-slate max-w-none">
                    {currentSyllabus ? (
                      <ReactMarkdown>{currentSyllabus}</ReactMarkdown>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                        <Sparkles className="w-16 h-16" />
                        <p className="text-xl font-medium">Your generated syllabus will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">History</h1>
                  <p className="text-black/60">Access and manage your previously forged syllabi.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-black/5 rounded-2xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <button 
                        onClick={() => item.id && deleteSyllabus(item.id)}
                        className="p-2 text-black/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="font-bold text-xl mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-black/40 mb-4">
                      <span className="bg-black/5 px-2 py-0.5 rounded-md font-medium">{item.level}</span>
                      <span>•</span>
                      <span>{new Date(item.created_at || '').toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setCurrentSyllabus(item.content);
                        setFormData({ ...formData, title: item.title, level: item.level });
                        setActiveTab('generate');
                      }}
                      className="w-full py-3 bg-black/5 rounded-xl font-bold hover:bg-black hover:text-white transition-all"
                    >
                      View Syllabus
                    </button>
                  </motion.div>
                ))}
                {history.length === 0 && (
                  <div className="col-span-full py-24 text-center space-y-4 opacity-20">
                    <History className="w-16 h-16 mx-auto" />
                    <p className="text-xl font-medium">No history found. Start forging!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

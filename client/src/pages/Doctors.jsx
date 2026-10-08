import { useState } from 'react';
import { Stethoscope, Users, CheckCircle2, UserPlus, Trash2, Edit, X } from 'lucide-react';

export default function Doctors({ doctors, setDoctors }) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', username: '', password: '', specialization: '' });
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    const ids = doctors.map(d => parseInt(d.id.replace('DOC-', ''), 10));
    const nextNum = doctors.length > 0 ? Math.max(...ids) + 1 : 1;
    setFormData({ id: `DOC-${String(nextNum).padStart(2, '0')}`, name: '', username: '', password: '', specialization: '' });
    setFormError('');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (doc) => {
    setFormData(doc);
    setFormError('');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing && doctors.some(d => d.username === formData.username)) {
      return setFormError('Username already taken.');
    }
    
    const newDoc = { ...formData, activePatients: isEditing ? formData.activePatients : 0, successRate: isEditing ? formData.successRate : 'N/A' };
    
    if (isEditing) {
      setDoctors(doctors.map(d => d.id === formData.id ? newDoc : d));
    } else {
      setDoctors([...doctors, newDoc]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this doctor and revoke portal access?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Medical Staff Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Hospital-wide overview of active doctors and portal credentials.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <UserPlus size={18} /> Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col transition-colors duration-300 relative group">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenEdit(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button>
              <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
            </div>
            
            <div className="flex items-start justify-between mb-6 pr-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{doc.specialization}</p>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 inline-block">
              Portal Username: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{doc.username}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1"><Users size={16} /><span className="text-xs font-semibold uppercase tracking-wider">Active Patients</span></div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{doc.activePatients}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1"><CheckCircle2 size={16} /><span className="text-xs font-semibold uppercase tracking-wider">Success Rate</span></div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{doc.successRate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Doctor Profile' : 'Add Medical Staff'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="p-3 bg-red-50 border-red-200 text-red-600 text-sm rounded-lg font-medium">{formError}</div>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name (with Title)</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Dr. John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                <input type="text" required value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="IVF Specialist" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Portal Username</label>
                  <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Portal Password</label>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg font-medium">Cancel</button>
                <button type="submit" className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  {isEditing ? 'Save Changes' : 'Create Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
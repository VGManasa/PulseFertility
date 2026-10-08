import { useState } from 'react';
import { Search, Trash2, UserPlus, X, Phone, Edit } from 'lucide-react';

export default function Patients({ authData, patients, setPatients, doctors }) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');

  // Separated ID logic for the form to prevent "P-" deletion
  const [formData, setFormData] = useState({ 
    patient_id_num: '', 
    full_name: '', 
    country_code: '91', 
    phone_number: '', 
    assigned_doctor: '', 
    treatment_type: 'OI', 
    language_preference: 'en' 
  });

  const visiblePatients = authData.role === 'ADMIN' 
    ? patients 
    : patients.filter(p => p.assigned_doctor === authData.name);

  const filteredPatients = visiblePatients.filter(patient => 
    patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone_number.includes(searchQuery)
  );

  const handleOpenAdd = () => {
    let nextNum = '0001';
    if (patients.length > 0) {
      const ids = patients.map(p => parseInt(p.patient_id.replace('P-', ''), 10));
      const maxId = Math.max(...ids);
      nextNum = String(maxId + 1).padStart(4, '0');
    }
    
    setFormData({ 
      patient_id_num: nextNum, 
      full_name: '', 
      country_code: '91', 
      phone_number: '', 
      assigned_doctor: authData.role === 'DOCTOR' ? authData.name : (doctors[0]?.name || ''), 
      treatment_type: 'OI', 
      language_preference: 'en' 
    });
    setFormError('');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (patient) => {
    // Extract country code and base number for the form
    const isUS = patient.phone_number.startsWith('1');
    const cCode = isUS ? '1' : '91';
    const basePhone = patient.phone_number.replace(cCode, '');
    const idNum = patient.patient_id.replace('P-', '');

    setFormData({
      patient_id_num: idNum,
      full_name: patient.full_name,
      country_code: cCode,
      phone_number: basePhone,
      assigned_doctor: patient.assigned_doctor,
      treatment_type: patient.treatment_type,
      language_preference: patient.language_preference
    });
    setFormError('');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.phone_number.length < 7 || formData.phone_number.length > 15) return setFormError('Invalid phone number length.');
    const fullPatientId = `P-${formData.patient_id_num.padStart(4, '0')}`;
    
    if (!isEditing && patients.some(p => p.patient_id === fullPatientId)) {
      return setFormError('Patient ID sequence conflict.');
    }

    const updatedPatient = {
      patient_id: fullPatientId,
      full_name: formData.full_name,
      phone_number: `${formData.country_code}${formData.phone_number}`,
      assigned_doctor: formData.assigned_doctor,
      treatment_type: formData.treatment_type,
      language_preference: formData.language_preference
    };

    if (isEditing) {
      setPatients(patients.map(p => p.patient_id === fullPatientId ? updatedPatient : p));
    } else {
      setPatients([...patients, updatedPatient]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to remove patient ${id}?`)) {
      setPatients(patients.filter(p => p.patient_id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Patient Directory</h2>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <UserPlus size={18} /> Add Patient
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by ID, Name, or Phone..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Language</th>
                {authData.role === 'ADMIN' && <th className="p-4 font-semibold">Doctor</th>}
                <th className="p-4 font-semibold">Protocol</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map((patient) => (
                <tr key={patient.patient_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{patient.patient_id}</td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{patient.full_name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">+{patient.phone_number}</td>
                  <td className="p-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold uppercase">{patient.language_preference}</span></td>
                  {authData.role === 'ADMIN' && <td className="p-4 text-slate-600 dark:text-slate-300">{patient.assigned_doctor}</td>}
                  <td className="p-4"><span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-semibold">{patient.treatment_type}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenEdit(patient)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(patient.patient_id)} className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-1"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-slate-500">No records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Patient' : 'Enroll New Patient'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="p-3 bg-red-50 border-red-200 text-red-600 text-sm rounded-lg font-medium">{formError}</div>}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient ID</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-sm">P-</span>
                    <input 
                      type="text" 
                      required 
                      disabled={isEditing}
                      value={formData.patient_id_num} 
                      onChange={(e) => setFormData({...formData, patient_id_num: e.target.value.replace(/\D/g, '').slice(0, 4)})} 
                      className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-r-lg text-sm font-mono dark:text-white focus:outline-none ${isEditing ? 'opacity-70' : 'focus:ring-2 focus:ring-blue-500'}`} 
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" required value={formData.full_name} onChange={(e) => /^[A-Za-z\s]*$/.test(e.target.value) && setFormData({...formData, full_name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number</label>
                <div className="flex gap-2">
                  <select value={formData.country_code} onChange={(e) => setFormData({...formData, country_code: e.target.value})} className="w-1/3 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="91">🇮🇳 +91</option>
                    <option value="1">🇺🇸 +1</option>
                  </select>
                  <div className="relative w-2/3">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="tel" required value={formData.phone_number} onChange={(e) => /^\d*$/.test(e.target.value) && setFormData({...formData, phone_number: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
                  <select value={formData.language_preference} onChange={(e) => setFormData({...formData, language_preference: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="en">English (en)</option>
                    <option value="ta">Tamil (ta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Protocol Type</label>
                  <select value={formData.treatment_type} onChange={(e) => setFormData({...formData, treatment_type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="OI">OI</option>
                    <option value="IUI">IUI</option>
                    <option value="IVF">IVF</option>
                    <option value="PREGNANCY">PREGNANCY</option>
                  </select>
                </div>
              </div>

              {authData.role === 'ADMIN' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Doctor</label>
                  <select value={formData.assigned_doctor} onChange={(e) => setFormData({...formData, assigned_doctor: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg font-medium">Cancel</button>
                <button type="submit" className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  {isEditing ? 'Save Changes' : <><UserPlus size={18} /> Register Patient</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
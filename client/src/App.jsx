import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, AlertCircle, 
  FileText, Menu, ChevronLeft, Bell, Sun, Moon, LogOut, Stethoscope 
} from 'lucide-react';
import DashboardHome from './pages/DashboardHome';
import Login from './pages/Login';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';

const Sidebar = ({ isExpanded, setIsExpanded, onLogout, authData }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} />, roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Patients', path: '/patients', icon: <Users size={22} />, roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Doctors Directory', path: '/doctors', icon: <Stethoscope size={22} />, roles: ['ADMIN'] },
    { name: 'Appointments', path: '/appointments', icon: <Calendar size={22} />, roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Escalations', path: '/escalations', icon: <AlertCircle size={22} />, roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Billing', path: '/billing', icon: <FileText size={22} />, roles: ['ADMIN'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(authData.role));

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 z-20 flex flex-col ${isExpanded ? 'w-[260px]' : 'w-[80px]'}`}>
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight whitespace-nowrap">PulseFertility</h1>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 absolute right-4">
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{authData.role} VIEW</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{authData.name}</p>
      </div>

      <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className={`flex items-center px-3 py-3 rounded-xl transition-colors duration-200 ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <div className={`flex items-center justify-center shrink-0 min-w-[24px] ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{item.icon}</div>
              <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button onClick={onLogout} className="flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <div className="flex items-center justify-center shrink-0 min-w-[24px]"><LogOut size={22} /></div>
          <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const Topbar = ({ isDark, setIsDark, authData }) => (
  <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
    <div className="text-slate-800 dark:text-slate-200 font-medium text-sm">Clinic Operations Center</div>
    <div className="flex items-center gap-4">
      <button onClick={() => setIsDark(!isDark)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
        <Bell size={20} />
      </button>
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
        {authData.name.substring(0, 2)}
      </div>
    </div>
  </header>
);

export default function App() {
  const [authData, setAuthData] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') return document.documentElement.classList.contains('dark');
    return false;
  });

  // Centralized State for Mock Database
  const [doctorsList, setDoctorsList] = useState([
    { id: 'DOC-01', name: 'Dr. Keshav Krishnan', username: 'dr_keshav', password: 'pass', specialization: 'IVF Specialist', activePatients: 42, successRate: '78%' },
    { id: 'DOC-02', name: 'Dr. Viswanathan S', username: 'dr_viswa', password: 'pass', specialization: 'Reproductive Endocrinologist', activePatients: 38, successRate: '81%' },
  ]);

  const [patientsList, setPatientsList] = useState([
    { patient_id: 'P-1042', full_name: 'Anjali Sharma', phone_number: '919876543210', assigned_doctor: 'Dr. Keshav Krishnan', treatment_type: 'IVF', language_preference: 'en' },
    { patient_id: 'P-1088', full_name: 'Riya Patel', phone_number: '919876543211', assigned_doctor: 'Dr. Viswanathan S', treatment_type: 'IUI', language_preference: 'ta' }
  ]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  if (!authData) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <Login onLogin={setAuthData} isDark={isDark} setIsDark={setIsDark} doctors={doctorsList} />
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} onLogout={() => setAuthData(null)} authData={authData} />
          <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'ml-[260px]' : 'ml-[80px]'}`}>
            <Topbar isDark={isDark} setIsDark={setIsDark} authData={authData} />
            <main className="p-8 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<DashboardHome authData={authData} />} />
                <Route path="/patients" element={<Patients authData={authData} patients={patientsList} setPatients={setPatientsList} doctors={doctorsList} />} />
                <Route path="/doctors" element={authData.role === 'ADMIN' ? <Doctors doctors={doctorsList} setDoctors={setDoctorsList} /> : <Navigate to="/" />} />
                <Route path="/appointments" element={<div className="p-8 text-slate-500">Appointments Module</div>} />
                <Route path="/escalations" element={<div className="p-8 text-slate-500">Escalations Module</div>} />
                <Route path="/billing" element={<div className="p-8 text-slate-500">Billing Module</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </div>
  );
}
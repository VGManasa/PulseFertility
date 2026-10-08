import { useState } from 'react';
import { Sun, Moon, Lock, User } from 'lucide-react';

export default function Login({ onLogin, isDark, setIsDark, doctors }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check Main Admin
    if (username === 'admin' && password === 'admin') {
      onLogin({ role: 'ADMIN', name: 'Main Hospital Admin' });
      return;
    }
    
    // Check Dynamic Doctor Credentials
    const doctorMatch = doctors.find(doc => doc.username === username && doc.password === password);
    if (doctorMatch) {
      onLogin({ role: 'DOCTOR', name: doctorMatch.name });
      return;
    }

    setError('Invalid credentials. Check username or password.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <button onClick={() => setIsDark(!isDark)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">PulseFertility</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Secure Staff Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium">{error}</div>}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" placeholder="Username" />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors" placeholder="Password" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm">Authenticate</button>
        </form>
      </div>
    </div>
  );
}
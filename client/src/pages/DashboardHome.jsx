import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, MessageSquare, PhoneCall, ChevronRight } from 'lucide-react';

export default function DashboardHome({ authData }) {
  const masterEscalations = [
    {
      message_id: 'MSG_10492', patient_id: 'P-1042', doctor: 'Dr. Keshav Krishnan',
      content_text: 'I am experiencing severe pelvic pain and mild fever following my oocyte pickup yesterday.',
      escalation_reason: 'EMERGENCY', timestamp: new Date().toISOString(),
    },
    {
      message_id: 'MSG_10493', patient_id: 'P-1089', doctor: 'Dr. Viswanathan S',
      content_text: 'Missed my morning progesterone trigger injection. Should I take it right now?',
      escalation_reason: 'MEDICATION_QUERY', timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ];

  const masterCycles = [
    { cycle_id: 'CYC_001', patient_id: 'P-1042', doctor: 'Dr. Keshav Krishnan', protocol_type: 'IVF', next_milestone: 'EMBRYO_TRANSFER', scheduled_date: '2026-10-12' },
    { cycle_id: 'CYC_002', patient_id: 'P-1088', doctor: 'Dr. Viswanathan S', protocol_type: 'IUI', next_milestone: 'DAY_3_BASELINE_SCAN', scheduled_date: '2026-10-10' }
  ];

  const escalations = authData.role === 'ADMIN' ? masterEscalations : masterEscalations.filter(e => e.doctor === authData.name);
  const activeCycles = authData.role === 'ADMIN' ? masterCycles : masterCycles.filter(c => c.doctor === authData.name);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {authData.role === 'ADMIN' ? 'Hospital Overview' : `Welcome, ${authData.name}`}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Live monitoring of WhatsApp engagement and AI triage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: authData.role === 'ADMIN' ? 'Total Escalations' : 'Your Escalations', value: escalations.length, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: authData.role === 'ADMIN' ? 'Total Protocols' : 'Your Protocols', value: activeCycles.length, icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Messages Sent (24h)', value: '128', icon: MessageSquare, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Pending Reminders', value: '14', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</h3>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Triage Queue</h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full">{escalations.length} Pending</span>
          </div>
          <div className="flex-1 p-2">
            {escalations.map((item) => (
              <div key={item.message_id} className="p-4 m-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.patient_id}</span>
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">{item.escalation_reason}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 pl-3 border-l-2 border-slate-200 dark:border-slate-700">{item.content_text}</p>
                <div className="flex gap-3">
                  <button className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 rounded-lg transition-colors"><PhoneCall size={16} className="inline mr-2" /> Call</button>
                  <button className="flex-[2] text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 py-2 rounded-lg transition-colors">Resolve & Reply</button>
                </div>
              </div>
            ))}
            {escalations.length === 0 && <p className="p-8 text-center text-slate-500">Queue clear.</p>}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Milestones</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-3 pl-2 font-medium">Patient ID</th>
                  {authData.role === 'ADMIN' && <th className="pb-3 font-medium">Assigned Doctor</th>}
                  <th className="pb-3 font-medium">Protocol</th>
                  <th className="pb-3 pr-2 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {activeCycles.map((cycle) => (
                  <tr key={cycle.cycle_id} className="group">
                    <td className="py-4 pl-2 font-semibold text-slate-900 dark:text-slate-200">{cycle.patient_id}</td>
                    {authData.role === 'ADMIN' && <td className="py-4 text-slate-500 dark:text-slate-400">{cycle.doctor}</td>}
                    <td className="py-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold">{cycle.protocol_type}</span></td>
                    <td className="py-4 pr-2 text-right text-slate-500 dark:text-slate-400">{cycle.scheduled_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
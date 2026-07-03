import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area, LineChart, Line, Legend 
} from 'recharts';
import { Activity, Brain, BedDouble } from 'lucide-react';

// Datasets for interactive charts
const clinicFlowData = [
  { hour: '08:00 AM', appointments: 2, walkins: 1, waiting: 3 },
  { hour: '10:00 AM', appointments: 4, walkins: 3, waiting: 5 },
  { hour: '12:00 PM', appointments: 1, walkins: 2, waiting: 2 },
  { hour: '02:00 PM', appointments: 5, walkins: 1, waiting: 4 },
  { hour: '04:00 PM', appointments: 3, walkins: 2, waiting: 3 },
  { hour: '06:00 PM', appointments: 1, walkins: 0, waiting: 1 }
];

const aiPerformanceData = [
  { month: 'Jan', cloudAI: 99.1, optimizedAI: 97.8, localAI: 94.2 },
  { month: 'Feb', cloudAI: 99.3, optimizedAI: 98.1, localAI: 94.8 },
  { month: 'Mar', cloudAI: 99.5, optimizedAI: 98.4, localAI: 95.3 },
  { month: 'Apr', cloudAI: 99.4, optimizedAI: 98.5, localAI: 95.6 },
  { month: 'May', cloudAI: 99.7, optimizedAI: 98.7, localAI: 96.1 },
  { month: 'Jun', cloudAI: 99.8, optimizedAI: 98.9, localAI: 96.4 }
];

const ccuOccupancyData = [
  { day: 'Mon', ICU: 80, CCU: 75, Ward: 82 },
  { day: 'Tue', ICU: 85, CCU: 80, Ward: 80 },
  { day: 'Wed', ICU: 80, CCU: 85, Ward: 85 },
  { day: 'Thu', ICU: 90, CCU: 90, Ward: 88 },
  { day: 'Fri', ICU: 95, CCU: 80, Ward: 92 },
  { day: 'Sat', ICU: 80, CCU: 70, Ward: 78 },
  { day: 'Sun', ICU: 75, CCU: 65, Ward: 72 }
];

export default function InteractiveCharts() {
  const [activeTab, setActiveTab] = useState<'flow' | 'ai' | 'occupancy'>('flow');

  return (
    <div id="interactive-charts-card" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">Interactive Command Analytics</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Analyze live clinic flow, AI diagnostic latency, and ICU bed metrics</p>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-xs gap-1">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Clinic Flow</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Benchmark</span>
          </button>
          
          <button
            onClick={() => setActiveTab('occupancy')}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'occupancy'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>ICU Occupancy</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 w-full">
        {activeTab === 'flow' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={clinicFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: '#1E293B',
                  borderRadius: '16px',
                  color: '#FFF',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              <Area type="monotone" dataKey="appointments" name="Scheduled Appointments" stroke="#3B82F6" fillOpacity={1} fill="url(#colorApts)" strokeWidth={2} />
              <Area type="monotone" dataKey="walkins" name="Walk-ins Triaged" stroke="#10B981" fillOpacity={0} strokeWidth={2} />
              <Area type="monotone" dataKey="waiting" name="Average Waiting" stroke="#EF4444" fillOpacity={1} fill="url(#colorWait)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'ai' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aiPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[90, 100]} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: '#1E293B',
                  borderRadius: '16px',
                  color: '#FFF',
                  fontSize: '12px'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              <Line type="monotone" dataKey="cloudAI" name="Cloud AI (Gemini 1.5 Pro)" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="optimizedAI" name="Optimized AI (Gemini Flash)" stroke="#6366F1" strokeWidth={2.5} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="localAI" name="Local AI (Gemma 2B Offline)" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'occupancy' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ccuOccupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.15)" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: '#1E293B',
                  borderRadius: '16px',
                  color: '#FFF',
                  fontSize: '12px'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              <Bar dataKey="ICU" name="Cardiac ICU Occupancy (%)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="CCU" name="Step-down Ward (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ward" name="Standard Medical (%)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dynamic Summary footer */}
      <div className="grid grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800/40">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Clinic Peak hour</span>
          <strong className="text-sm text-slate-800 dark:text-slate-200 font-mono block mt-0.5">10:00 AM</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">AI Avg. Latency</span>
          <strong className="text-sm text-blue-600 dark:text-blue-400 font-mono block mt-0.5">186ms</strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">ICU Bed Safety</span>
          <strong className="text-sm text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">Green (2 Open)</strong>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldAlert, AlertTriangle, CloudRain, Flame, 
  Droplet, TrafficCone, Info, Check, Calendar, MapPin
} from 'lucide-react';
import { useRouter } from '../router';

interface AreaAlert {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Moderate' | 'Info';
  category: 'Water' | 'Power' | 'Traffic' | 'Weather' | 'Safety';
  location: string;
  date: string;
  isResolved: boolean;
}

export const AlertsView: React.FC = () => {
  const { goBack } = useRouter();
  const [alerts, setAlerts] = useState<AreaAlert[]>([
    {
      id: 'a1',
      title: 'Water Logged Footpath & Drainage Overflow',
      description: 'Heavily clogged stormwater drain has overflowed onto the road near Indiranagar Double Road. Citizens advised to avoid this lane.',
      severity: 'High',
      category: 'Water',
      location: 'Double Road Junction',
      date: 'Today, 08:30 AM',
      isResolved: false
    },
    {
      id: 'a2',
      title: 'Severe Traffic Delay due to Metro Trenching',
      description: 'One lane blocked on CMH Road for construction. Extreme gridlocks reported. Divert through alternative lanes.',
      severity: 'High',
      category: 'Traffic',
      location: 'CMH Road Main Stretch',
      date: 'Today, 07:00 AM',
      isResolved: false
    },
    {
      id: 'a3',
      title: 'Scheduled BESCOM Transformer Replacement',
      description: 'Power cut in Stage 2 pockets from 10:00 AM to 02:00 PM today. Work in progress.',
      severity: 'Moderate',
      category: 'Power',
      location: 'Stage 2, Block B',
      date: 'Today, 10:00 AM',
      isResolved: false
    },
    {
      id: 'a4',
      title: 'Heavy Rainfall Advisory',
      description: 'Karnataka State Disaster Management issues moderate-to-heavy rainfall warnings for East Bengaluru zone for the next 24 hours.',
      severity: 'Moderate',
      category: 'Weather',
      location: 'East Bengaluru',
      date: 'Yesterday',
      isResolved: false
    },
    {
      id: 'a5',
      title: 'Resolved: Falling Tree Branch Cleaned',
      description: 'Fallen massive branch on 5th Cross Road has been fully cleared by BBMP forest cell crew. Road is clear.',
      severity: 'Info',
      category: 'Safety',
      location: '5th Cross Indiranagar',
      date: 'June 23',
      isResolved: true
    }
  ]);

  const [filter, setFilter] = useState<string>('All');

  const getSeverityStyle = (severity: string, isResolved: boolean) => {
    if (isResolved) return 'border-slate-200 bg-slate-50 text-slate-500';
    switch (severity) {
      case 'High': return 'border-red-200 bg-red-50 text-red-800';
      case 'Moderate': return 'border-amber-200 bg-amber-50 text-amber-800';
      default: return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getAlertIcon = (category: string) => {
    switch (category) {
      case 'Water': return <Droplet size={16} className="text-sky-600" />;
      case 'Power': return <Flame size={16} className="text-amber-600" />;
      case 'Traffic': return <TrafficCone size={16} className="text-orange-600" />;
      case 'Weather': return <CloudRain size={16} className="text-blue-600" />;
      default: return <ShieldAlert size={16} className="text-rose-600" />;
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !a.isResolved;
    if (filter === 'Resolved') return a.isResolved;
    return a.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-4 flex flex-col gap-5 min-h-screen pb-24">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <button 
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-all duration-150"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <ShieldAlert size={16} className="text-amber-600" />
            Area Alerts
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Safety & Disruption Desk
          </p>
        </div>
      </div>

      {/* Warning Alert Banner */}
      <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-20">
          <AlertTriangle size={80} />
        </div>
        <div className="relative z-10">
          <span className="text-[8px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            Critical Safety Notice
          </span>
          <h4 className="font-extrabold text-white text-xs mt-1.5">Monsoon Safety Regulations</h4>
          <p className="text-[9px] text-amber-50 mt-1 leading-relaxed font-semibold">
            BBMP Ward 4 officers advise staying clear of old walls, open stormwater channels, and heavy electrical poles during high winds and monsoon thunderclaps.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Active', 'Resolved', 'Water', 'Power', 'Traffic'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl border shrink-0 transition-all cursor-pointer ${
              filter === f 
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="flex flex-col gap-3.5">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`border rounded-2xl p-4 shadow-xs flex flex-col gap-3 transition-all duration-150 ${
              getSeverityStyle(alert.severity, alert.isResolved)
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                alert.isResolved 
                  ? 'bg-slate-100 text-slate-400 border-slate-200' 
                  : alert.severity === 'High' 
                    ? 'bg-red-100 text-red-700 border-red-200' 
                    : 'bg-amber-100 text-amber-700 border-amber-200'
              }`}>
                {alert.isResolved ? 'Resolved' : `${alert.severity} Risk`}
              </span>
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                <Calendar size={11} />
                {alert.date}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 text-xs tracking-tight flex items-center gap-2">
                {getAlertIcon(alert.category)}
                {alert.title}
              </h4>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed font-semibold">
                {alert.description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100/40 text-[9px] font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-0.5">
                <MapPin size={11} />
                {alert.location}
              </span>

              {alert.isResolved ? (
                <span className="text-emerald-600 font-black flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded">
                  <Check size={11} className="stroke-[3px]" />
                  Cleared
                </span>
              ) : (
                <span className="text-slate-500 font-black flex items-center gap-0.5 bg-slate-100 px-2 py-0.5 rounded">
                  Active Issue
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

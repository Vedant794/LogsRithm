
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'error' | 'warning';
}

export interface LogDetailsProps {
  logs: LogEntry[];
}

const LogDetails: React.FC<LogDetailsProps> = ({ logs }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm text-white rounded-xl shadow-md overflow-hidden border border-slate-700/50">
      <div className="p-4 bg-slate-800/90 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-300">build-and-deploy</h2>
        <div className="relative w-64">
          <Input 
            type="text" 
            placeholder="Search logs" 
            className="pl-9 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 text-sm focus:ring-purple-500 focus:border-purple-500 w-full rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>
      <div className="overflow-auto h-[300px] p-4 space-y-2 font-mono text-sm bg-slate-900/30">
        {logs.map((log) => (
          <div key={log.id} className="flex">
            <span className="text-slate-500 mr-4">{log.timestamp}</span>
            <span className={`
              ${log.level === 'info' ? 'text-slate-300' : ''}
              ${log.level === 'error' ? 'text-red-400' : ''}
              ${log.level === 'warning' ? 'text-yellow-400' : ''}
            `}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogDetails;

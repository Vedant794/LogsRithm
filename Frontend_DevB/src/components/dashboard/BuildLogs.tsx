
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BuildLogsProps {
  totalBuildLogs: number;
  successCount: number;
  errorCount: number;
}

const BuildLogs: React.FC<BuildLogsProps> = ({ 
  totalBuildLogs, 
  successCount, 
  errorCount 
}) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-purple-900/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-400 font-medium">Total Build Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-slate-100">{totalBuildLogs}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-purple-900/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-400 font-medium">Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">{successCount}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-purple-900/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-400 font-medium">Error / Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-red-400">{errorCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildLogs;

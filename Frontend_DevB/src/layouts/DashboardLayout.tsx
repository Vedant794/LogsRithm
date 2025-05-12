
import React from 'react';
import { Outlet } from 'react-router-dom';
import { GitBranch, Home, Settings, BarChart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SidebarItem = ({ icon: Icon, label, active = false }: { 
  icon: React.ElementType; 
  label: string;
  active?: boolean;
}) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-colors",
      active 
        ? "bg-slate-800/60 text-white" 
        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Button>
);

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-slate-700/50 bg-sidebar p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-sidebar flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-white">DevBeacon</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <SidebarItem icon={Home} label="Dashboard" active />
          <SidebarItem icon={GitBranch} label="Repositories" />
          <SidebarItem icon={BarChart} label="Analytics" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>
        
        <Separator className="my-4 bg-slate-700/50" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback>UR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-slate-400">user@example.com</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </aside>
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, GitBranch, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Repository = {
  id: string;
  name: string;
  owner: string;
};

interface RepositorySelectProps {
  repositories: Repository[];
  onAddRepo: () => void;
  onRepoChange?: (repoId: string) => void;
}
const RepositorySelect: React.FC<RepositorySelectProps> = ({ repositories, onAddRepo, onRepoChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  

  interface RepositorySelectProps {
    repositories: Repository[];
    onRepoChange?: (repoId: string) => void;
  }
  

  const handleSelectRepo = (repoId: string) => {
    const newValue = repoId === value ? "" : repoId;
    setValue(newValue);
    setOpen(false);
    
    if (onRepoChange && newValue) {
      onRepoChange(newValue);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-slate-800/80 border-slate-700/50 text-slate-200 shadow-md hover:bg-slate-700/80"
          >
            <div className="flex items-center gap-2 truncate">
              <GitBranch className="h-4 w-4 text-purple-400" />
              {value
                ? repositories.find((repo) => repo.id === value)?.name
                : "Select Repository"}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700/50">
          <div className="max-h-[300px] overflow-y-auto p-1">
            <div className="p-2">
              <input 
                className="w-full px-3 py-2 text-sm border rounded-md bg-slate-700/80 border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/70" 
                placeholder="Search repositories..." 
              />
            </div>
            <div className="py-1">
              {repositories.length === 0 && (
                <div className="py-6 text-center text-sm text-slate-400">No repository found.</div>
              )}
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-slate-700/80 hover:text-white transition-colors",
                    value === repo.id ? "bg-purple-600/30 text-white" : "text-slate-300"
                  )}
                  onClick={() => handleSelectRepo(repo.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-purple-400",
                      value === repo.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{repo.name}</span>
                    <span className="text-xs text-slate-400">{repo.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        onClick={onAddRepo}
        className="bg-purple-600/90 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm shadow-purple-900/20"
      >
        <Plus className="h-4 w-4" />
        Add Repository
      </Button>
    </div>
  );
};

export default RepositorySelect;

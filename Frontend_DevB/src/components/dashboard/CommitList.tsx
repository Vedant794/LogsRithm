
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GitCommit } from 'lucide-react';

interface Commit {
  id: string;
  number: number;
  title: string;
  selected?: boolean;
}

interface CommitListProps {
  commits: Commit[];
  onSelectCommit: (id: string) => void;
  selectedCommitId: string | null;
}

const CommitList: React.FC<CommitListProps> = ({ 
  commits, 
  onSelectCommit,
  selectedCommitId
}) => {
  return (
    <div className="flex flex-col gap-2">
      {commits.map((commit) => (
        <Card 
          key={commit.id}
          className={`cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${
            selectedCommitId === commit.id 
              ? 'bg-purple-900/30 border-purple-500/50 shadow-md shadow-purple-900/10' 
              : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/50'
          }`}
          onClick={() => onSelectCommit(commit.id)}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <div className="bg-slate-700/50 rounded-full p-1.5">
              <GitCommit className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex flex-col">
              <div className="text-md font-medium text-slate-200">
                Commit {commit.number}
              </div>
              <div className="text-xs text-slate-400">
                {commit.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommitList;

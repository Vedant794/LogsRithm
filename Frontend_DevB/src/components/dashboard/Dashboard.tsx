import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuildLogs from './BuildLogs';
import LogDetails, { LogEntry } from './LogDetails';
import RepositorySelect from '../ui/RepositorySelect';
import CommitList from './CommitList';
import { toast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [commits, setCommits] = useState<any[]>([]);
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [buildLogsData, setBuildLogsData] = useState<any | null>(null);
  const [logsData, setLogsData] = useState<LogEntry[]>([]);


  useEffect(() => {
    const fetchRepositories = async () => {
      const cachedRepos = sessionStorage.getItem("repositories");
      if (cachedRepos) {
        setRepositories(JSON.parse(cachedRepos));
        return;
      }

      try {
        const response = await fetch('https://devbecons-node-backend-gwfbckg9fbatg9dz.canadacentral-01.azurewebsites.net/user/repos');
        const data = await response.json();
        console.log(data);
        setRepositories(data);
        sessionStorage.setItem("repositories", JSON.stringify(data)); // Store in session storage
      } catch (error) {
        console.error('Error fetching repositories:', error);
        toast({ title: "Error", description: "Failed to fetch repositories" });
      }
    };

    fetchRepositories(); // Call the function directly
  }, []);

  // Handle repository selection
  const handleRepoChange = (repoId: string) => {
    setSelectedRepo(repoId);
    setSelectedCommitId(null); // Reset commit when repo changes
    setBuildLogsData(null);
    setLogsData([]);

    const cachedCommits = sessionStorage.getItem(`commits-${repoId}`);
    if (cachedCommits) {
      setCommits(JSON.parse(cachedCommits));
    } else {
      fetch(`/user/repos/${repoId}/commits`)
        .then((res) => res.json())
        .then((data) => {
          setCommits(data);
          sessionStorage.setItem(`commits-${repoId}`, JSON.stringify(data)); // Cache commits
        })
        .catch((error) => console.error('Error fetching commits:', error));
    }

    toast({
      title: 'Repository changed',
      description: `Now viewing repository: ${repoId}`,
    });
  };

  // Handle commit selection
  const handleSelectCommit = (commitId: string) => {
    setSelectedCommitId(commitId);
    setBuildLogsData(null);
    setLogsData([]);

    fetch(`/user/repos/${selectedRepo}/}`)
      .then((res) => res.json())
      .then((data) => setBuildLogsData(data))
      .catch((error) => console.error('Error fetching build logs:', error));
  };

  // Fetch log details when "Log Details" tab is selected
  const fetchLogsData = () => {
    if (!buildLogsData?.runId) return;
    fetch(`/user/repos/${selectedRepo}/${buildLogsData.runId}/getLogs`)
      .then((res) => res.json())
      .then((data) => setLogsData(data))
      .catch((error) => console.error('Error fetching logs:', error));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-100">Dashboard</h1>
        <p className="text-slate-300">Monitor your builds and performance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-1 space-y-6 flex justify-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-slate-800/60 border-slate-700/50 text-slate-200 hover:bg-slate-700/60 hover:text-white flex items-center gap-2"
              >
                <GitBranch className="h-4 w-4 text-purple-400" />
                Repositories
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] bg-slate-800/95 backdrop-blur-md border-slate-700/50">
              <SheetHeader>
                <SheetTitle className="text-slate-100">Repositories</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <RepositorySelect 
                  repositories={repositories}
                  onRepoChange={handleRepoChange} 
                  onAddRepo={() => console.log('Add repository functionality not implemented yet')} 
                />
                {selectedRepo && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-slate-100 mb-3">Recent Commits</h3>
                    <CommitList 
                      commits={commits}
                      onSelectCommit={handleSelectCommit}
                      selectedCommitId={selectedCommitId}
                    />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="lg:col-span-1">
          <Tabs defaultValue="buildLogs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl mb-4 overflow-hidden">
              <TabsTrigger 
                value="buildLogs" 
                className="data-[state=active]:bg-purple-600/80 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:text-white"
              >
                Build Logs
              </TabsTrigger>
              <TabsTrigger 
                value="logDetails" 
                className="data-[state=active]:bg-purple-600/80 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:text-white"
                onClick={fetchLogsData}
              >
                Log Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="buildLogs">
              {buildLogsData ? (
                <BuildLogs 
                  totalBuildLogs={buildLogsData.totalBuildLogs}
                  successCount={buildLogsData.successCount}
                  errorCount={buildLogsData.errorCount}
                />
              ) : (
                <p className="text-slate-300">Select a commit to view build logs.</p>
              )}
            </TabsContent>
            <TabsContent value="logDetails">
              {logsData.length > 0 ? (
                <LogDetails logs={logsData} />
              ) : (
                <p className="text-slate-300">Select a commit and load log details.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

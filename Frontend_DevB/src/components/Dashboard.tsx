import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GitBranch, BarChart2, GitCommit, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { RepositorySelect } from './RepositorySelect';
import { WorkflowList } from './WorkflowList';
import { LogViewer } from './LogViewer';
import { Repository, Workflow } from '@/services/api';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const { accessToken, ownerName } = useAuth();

  useEffect(() => {
    if (accessToken && ownerName) {
      toast.success(`Welcome ${ownerName}!`, {
        description: 'Select a repository to view workflows',
      });
    }
  }, []);

  const handleSelectRepository = (repo: Repository) => {
    setSelectedRepo(repo);
    setSelectedWorkflow(null);
    toast.info(`Repository ${repo.repoName} selected`);
  };

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
  };

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      if (!selectedRepo) {
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="glass-panel p-8 max-w-md text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-devbeacons-primary" />
              <h2 className="text-2xl font-semibold mb-4">Welcome to DevBeacons</h2>
              <p className="text-muted-foreground mb-6">
                Select a repository to view its workflows and monitor your CI/CD pipelines.
              </p>
              <div className="max-w-xs mx-auto">
                <RepositorySelect onSelectRepository={handleSelectRepository} />
              </div>
            </div>
          </div>
        );
      }

      if (selectedRepo && !selectedWorkflow) {
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="glass-panel p-8 max-w-md text-center">
              <GitCommit className="w-12 h-12 mx-auto mb-4 text-devbeacons-primary" />
              <h2 className="text-2xl font-semibold mb-4">Select a Workflow</h2>
              <p className="text-muted-foreground mb-6">
                Choose a workflow from the sidebar to view its execution logs.
              </p>
            </div>
          </div>
        );
      }

      if (selectedRepo && selectedWorkflow) {
        return (
          <LogViewer 
            repoName={selectedRepo.repoName} 
            workflowId={selectedWorkflow.id} 
            workflowTitle={selectedWorkflow.display_title} 
          />
        );
      }
    }

    if (activeSection === 'repositories') {
      return (
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">Repositories</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Active Repository</h3>
            <RepositorySelect onSelectRepository={handleSelectRepository} />
          </div>
          
          {selectedRepo && (
            <Card>
              <CardHeader>
                <CardTitle>Repository Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Repository Name</p>
                    <p className="font-medium">{selectedRepo.repoName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{ownerName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="glass-panel p-8 text-center">
            <BarChart2 className="w-12 h-12 mx-auto mb-4 text-devbeacons-primary" />
            <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
            <p className="text-muted-foreground">
              Detailed workflow analytics and performance metrics will be available in a future update.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-devbeacons-dark">
      <Sidebar 
        activeSection={activeSection} 
        onChangeSection={setActiveSection}
      >
        {selectedRepo && (
          <>
            <div className="px-4 py-2 border-t border-sidebar-border mt-2">
              <p className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
                Selected Repository
              </p>
              <p className="text-sm font-medium truncate">{selectedRepo.repoName}</p>
            </div>
            
            <div className="mt-2 border-t border-sidebar-border">
              <WorkflowList 
                repoName={selectedRepo.repoName}
                onSelectWorkflow={handleSelectWorkflow}
              />
            </div>
          </>
        )}
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-devbeacons-darker border-b border-sidebar-border flex items-center justify-between px-6">
          <div className="flex items-center">
            {activeSection === 'dashboard' && <LayoutDashboard className="w-5 h-5 mr-2 text-devbeacons-primary" />}
            {activeSection === 'repositories' && <GitBranch className="w-5 h-5 mr-2 text-devbeacons-primary" />}
            {activeSection === 'analytics' && <BarChart2 className="w-5 h-5 mr-2 text-devbeacons-primary" />}
            <h1 className="text-lg font-semibold capitalize">{activeSection}</h1>
          </div>

          {!selectedRepo && (
            <div className="w-64">
              <RepositorySelect onSelectRepository={handleSelectRepository} />
            </div>
          )}
          
          {selectedRepo && (
            <div className="flex items-center gap-2">
              <StatusBadge status="success" />
              <span className="text-sm font-medium">{ownerName}/{selectedRepo.repoName}</span>
            </div>
          )}
        </header>

        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
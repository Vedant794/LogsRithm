import React, { useState, useEffect } from "react";
import { Activity, Clock } from "lucide-react";
import { Workflow, WorkflowStats, fetchWorkflows } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { toast } from "sonner";

interface WorkflowListProps {
  repoName: string;
  onSelectWorkflow: (workflow: Workflow) => void;
}

export function WorkflowList({
  repoName,
  onSelectWorkflow,
}: WorkflowListProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [stats, setStats] = useState<WorkflowStats>({
    success: 0,
    failure: 0,
    progress: 0,
    cancel: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );
  const { accessToken, ownerName } = useAuth();

  useEffect(() => {
    async function loadWorkflows() {
      if (!accessToken || !ownerName || !repoName) return;

      try {
        setLoading(true);
        const { workflows, stats } = await fetchWorkflows(
          accessToken,
          ownerName,
          repoName
        );
        setWorkflows(workflows);
        setStats(stats);

        // Auto-select the first workflow if available
        if (workflows.length > 0) {
          setSelectedWorkflowId(workflows[0].id);
          onSelectWorkflow(workflows[0]);
        }
      } catch (error) {
        console.error("Failed to fetch workflows:", error);
        toast.error("Failed to load workflows");
      } finally {
        setLoading(false);
      }
    }

    loadWorkflows();
  }, [accessToken, ownerName, repoName]);

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflowId(workflow.id);
    onSelectWorkflow(workflow);
  };

  if (loading) {
    return (
      <div className="px-4 py-2 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-devbeacons-primary" />
          <p className="text-sm font-medium">Workflows</p>
        </div>

        {[1, 2, 3].map((index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-5 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        ))}
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No workflows found for this repository.
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-devbeacons-primary" />
          <p className="text-sm font-medium">Workflows</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-devbeacons-success">{stats.success}</span>
          <span>/</span>
          <span className="text-devbeacons-error">{stats.failure}</span>
        </div>
      </div>

      {/* Scrollable container for workflows */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-none">
        {workflows.map((workflow) => (
          <button
            key={workflow.id}
            onClick={() => handleSelectWorkflow(workflow)}
            className={`text-left w-full px-3 py-2 rounded-md transition-colors text-sm ${
              selectedWorkflowId === workflow.id
                ? "bg-devbeacons-primary/20 text-white"
                : "hover:bg-devbeacons-darker text-muted-foreground hover:text-white"
            }`}
          >
            {workflow.display_title}
          </button>
        ))}
      </div>
    </div>
  );
}

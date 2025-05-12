import React, { useState, useEffect } from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Repository, fetchRepositories } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RepositorySelectProps {
  onSelectRepository: (repo: Repository) => void;
}

export function RepositorySelect({
  onSelectRepository,
}: RepositorySelectProps) {
  const [open, setOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    async function loadRepositories() {
      if (!accessToken) return;

      try {
        setLoading(true);
        const repos = await fetchRepositories(accessToken);
        setRepositories(repos || []);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        toast.error("Failed to load repositories");
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    }

    loadRepositories();
  }, [accessToken]);

  const handleSelectRepository = (repo: Repository) => {
    setSelectedRepo(repo);
    onSelectRepository(repo);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedRepo ? selectedRepo.repoName : "Select repository..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-devbeacons-darker border-sidebar-border">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search repository..."
            className="border-none focus:ring-0 text-foreground"
          />

          {loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-devbeacons-primary border-t-transparent mr-2"></div>
              Loading repositories...
            </div>
          ) : (
            <>
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No repository found.
              </CommandEmpty>
              <CommandGroup>
                {Array.isArray(repositories) && repositories.length > 0 ? (
                  repositories.map((repo) => (
                    <CommandItem
                      key={repo.repoName}
                      onSelect={() => handleSelectRepository(repo)}
                      className="cursor-pointer"
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRepo?.repoName === repo.repoName
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {repo.repoName}
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No repositories available.
                  </div>
                )}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

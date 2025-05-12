
import React from 'react';
import { Github, Code, GitPullRequest, GitMerge, GitBranch, GitCommit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { getGitHubAuthUrl } from '@/services/api';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-devbeacons-dark overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[5%] w-32 h-32 bg-devbeacons-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 bg-devbeacons-success/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[5%] w-40 h-40 bg-devbeacons-primary/5 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="container py-6 z-10">
        <div className="flex justify-between items-center">
          <Logo size="md" />
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors py-1 px-3 rounded-md hover:bg-white/5"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="container flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <Logo size="lg" className="mb-8" />
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Monitor Your</span>
          <br />
          <span className="bg-gradient-to-r from-devbeacons-primary to-devbeacons-success bg-clip-text text-transparent">
            CI/CD Workflows
          </span>
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mb-12">
          A powerful dashboard for DevOps engineers to monitor GitHub Action workflows.
          Get real-time logs, track performance, and never miss a build status.
        </p>
        
        <Button 
  onClick={() => {
    const button = document.activeElement;
    if (button) {
      button.classList.add("active:scale-95");
      setTimeout(() => button.classList.remove("active:scale-95"), 150);
    }
    window.location.href = getGitHubAuthUrl();
  }}
  className="flex items-center gap-2 text-lg py-6 px-8 bg-white/10 
             hover:bg-white/15 text-white border border-white/10 
             transition duration-150 ease-in-out 
             hover:shadow-[0px_10px_20px_-5px_rgba(138,43,226,0.8)] 
             hover:-translate-y-1 active:scale-95 rounded-xl"
>
  <Github className="w-5 h-5" />
  Continue with GitHub
</Button>




        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl">
  <div className="glass-panel p-6 flex flex-col items-center text-center 
                  transition duration-300 ease-in-out rounded-lg 
                  hover:shadow-[0_4px_15px_rgba(138,43,226,0.3)] hover:-translate-y-1">
    <div className="w-12 h-12 rounded-full bg-devbeacons-primary/20 
                    flex items-center justify-center mb-4 transition duration-300 
                    hover:bg-devbeacons-primary/30">
      <GitPullRequest className="w-6 h-6 text-devbeacons-primary" />
    </div>
    <h3 className="text-lg font-medium mb-2">Pull Request Tracking</h3>
    <p className="text-gray-400 text-sm">Monitor all pull request workflows in one unified dashboard</p>
  </div>

  <div className="glass-panel p-6 flex flex-col items-center text-center 
                  transition duration-300 ease-in-out rounded-lg 
                  hover:shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:-translate-y-1">
    <div className="w-12 h-12 rounded-full bg-devbeacons-success/20 
                    flex items-center justify-center mb-4 transition duration-300 
                    hover:bg-devbeacons-success/30">
      <Code className="w-6 h-6 text-devbeacons-success" />
    </div>
    <h3 className="text-lg font-medium mb-2">Real-time Logs</h3>
    <p className="text-gray-400 text-sm">Access detailed logs without switching contexts</p>
  </div>

  <div className="glass-panel p-6 flex flex-col items-center text-center 
                  transition duration-300 ease-in-out rounded-lg 
                  hover:shadow-[0_4px_15px_rgba(138,43,226,0.3)] hover:-translate-y-1">
    <div className="w-12 h-12 rounded-full bg-devbeacons-primary/20 
                    flex items-center justify-center mb-4 transition duration-300 
                    hover:bg-devbeacons-primary/30">
      <GitMerge className="w-6 h-6 text-devbeacons-primary" />
    </div>
    <h3 className="text-lg font-medium mb-2">Multi-repo Support</h3>
    <p className="text-gray-400 text-sm">View all your GitHub repositories in a single platform</p>
  </div>
</div>

      </main>

      {/* CI/CD animation elements */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <GitBranch className="absolute top-[25%] left-[15%] text-devbeacons-primary/20 w-8 h-8" />
        <GitCommit className="absolute top-[40%] left-[10%] text-devbeacons-success/20 w-6 h-6" />
        <GitPullRequest className="absolute bottom-[30%] left-[20%] text-devbeacons-primary/20 w-10 h-10" />
        <GitMerge className="absolute top-[20%] right-[15%] text-devbeacons-success/20 w-10 h-10" />
        <GitBranch className="absolute bottom-[25%] right-[18%] text-devbeacons-primary/20 w-8 h-8" />
        <GitCommit className="absolute bottom-[35%] right-[25%] text-devbeacons-success/20 w-6 h-6" />
      </div>

      {/* Footer */}
      <footer className="container py-6 text-center text-gray-500 text-sm z-10">
        &copy; {new Date().getFullYear()} DevBeacons. All rights reserved.
      </footer>
    </div>
  );
}

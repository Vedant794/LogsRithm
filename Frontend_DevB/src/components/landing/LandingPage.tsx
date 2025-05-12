
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleGitHubSignIn = () => {
    window.location.href = "https://devbecons-node-backend-gwfbckg9fbatg9dz.canadacentral-01.azurewebsites.net/auth/github";
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
      <div className="w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl md:text-6xl">
              <span className="text-gradient">DevBeacon</span>
            </h1>
          </div>
          
          <p className="mt-3 max-w-md mx-auto text-lg text-slate-300 sm:text-xl md:mt-5 md:max-w-3xl">
            Monitor your builds, track performance, and visualize your development workflow in one elegant dashboard.
          </p>
          
          <div className="mt-10 flex justify-center">
            <Button 
              onClick={handleGitHubSignIn} 
              className="scale-up flex items-center space-x-2 h-12 px-8 rounded-full text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-purple-900/30"
            >
              <Github className="h-5 w-5" />
              <span>Sign in with GitHub</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 animate-fade-in shadow-md hover:shadow-purple-900/10 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">Real-time Monitoring</h3>
            <p className="text-slate-300">Track all your builds and tests in real-time with detailed logs and statistics.</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 animate-fade-in shadow-md hover:shadow-purple-900/10 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">Performance Insights</h3>
            <p className="text-slate-300">Analyze build performance and optimize your development workflow.</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 animate-fade-in shadow-md hover:shadow-purple-900/10 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
            <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">GitHub Integration</h3>
            <p className="text-slate-300">Seamlessly connect with your GitHub repositories and track all your commits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizes[size]} ${className}`}>
      <div className="bg-devbeacons-primary/20 p-1.5 rounded-md">
        <Zap className="text-devbeacons-primary" size={size === 'lg' ? 28 : size === 'md' ? 22 : 18} />
      </div>
      {showText && (
        <span className="bg-gradient-to-r from-devbeacons-primary to-devbeacons-success bg-clip-text text-transparent">
          DevBeacons
        </span>
      )}
    </div>
  );
}
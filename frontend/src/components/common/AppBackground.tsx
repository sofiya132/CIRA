import React from 'react';
import { BackgroundVideo } from './BackgroundVideo';

interface AppBackgroundProps {
  currentScreen: string;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({ currentScreen }) => {
  const isHomeScreen = currentScreen === 'HOME';

  if (isHomeScreen) {
    return <BackgroundVideo />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      {/* Uploaded Campus Operations Room Background Image - Crisp & Clearly Visible */}
      <img
        src="/ops-bg.jpg"
        alt="Campus Operations Command Center Background"
        className="w-full h-full object-cover opacity-75 scale-[1.01] transform origin-center transition-opacity duration-700 filter contrast-[1.05] brightness-[0.95]"
      />

      {/* Elegant frosted ambient glass vignette to ensure UI cards and buttons have 100% crisp typography */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/25 to-slate-950/50 backdrop-blur-[0.5px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30 pointer-events-none" />
    </div>
  );
};

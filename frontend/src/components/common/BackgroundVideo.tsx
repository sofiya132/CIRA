import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      {/* 
        High-clarity video background:
        - Completely muted (audio removed)
        - Continuously looped
        - scale-[1.08] with overflow-hidden to crop out any edge/corner watermarks
        - 100% full clarity without heavy blur
      */}
      <video
        src="/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-100 scale-[1.08] transform origin-center transition-transform duration-300"
      />
      {/* Light subtle vignette for top & bottom contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />
    </div>
  );
};

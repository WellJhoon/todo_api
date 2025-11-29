import React from 'react';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-16 px-6 relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm">
            NEXUS TASKS
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase font-medium">
            System Online
          </p>
        </div>

        <div className="glass rounded-3xl p-6 space-y-6 border border-white/5 shadow-2xl shadow-primary/5">
          {children}
        </div>
      </div>
    </div>
  );
}

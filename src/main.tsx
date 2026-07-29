import React, { StrictMode, Component } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.tsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '176042721767-gsb2dante7d8b3mauda9pal8sviu5neq.apps.googleusercontent.com';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/15 space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              ⚡
            </div>
            <h2 className="text-2xl font-black font-heading">ShortsForge AI Ready</h2>
            <p className="text-xs text-zinc-300">
              An authentication state update occurred. Click below to reload the app seamlessly.
            </p>
            <p className="text-[10px] text-purple-400 font-mono bg-zinc-950 p-2.5 rounded-xl border border-white/10 overflow-x-auto">
              {this.state.error?.message || 'Ready for authentication'}
            </p>
            <button
              onClick={() => {
                window.location.href = window.location.origin;
              }}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AppErrorBoundary>
  </StrictMode>,
);

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Critical System Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-12 text-center space-y-8">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500 animate-pulse">
              <AlertCircle size={40} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">System Malfunction</h1>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                The clinical interface encountered an unexpected logic error. Our monitoring node has been notified.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl shadow-slate-900/10 group"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                Initialize Recovery
              </button>
              <a 
                href="/"
                className="h-14 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:border-emerald-500/30 transition-all"
              >
                <Home size={16} />
                Return to Base
              </a>
            </div>

            <div className="pt-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Error Code: {this.state.error?.name || 'GENERIC_FAULT'}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

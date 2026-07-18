import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-slate-55">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-6 shadow-sm shadow-amber-100">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">Something went wrong</h1>
          <p className="text-slate-500 mt-2 max-w-md">
            An unexpected error occurred while rendering the page. Please reload to try again.
          </p>
          <pre className="mt-4 p-4 bg-slate-100 text-red-600 text-left text-xs rounded-xl max-w-2xl overflow-auto border border-slate-200 w-full font-mono">
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

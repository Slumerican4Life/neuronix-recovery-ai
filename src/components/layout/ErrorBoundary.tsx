
import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You could send to error reporting service here
    console.error("ErrorBoundary caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black/90 text-center text-red-400">
          <h1 className="text-2xl font-bold mb-3">😔 Something went wrong!</h1>
          <pre className="bg-black/50 text-pink-200 border border-pink-600 rounded p-4 mb-3 max-w-lg overflow-auto">
            {this.state.error?.message || "An unexpected error occurred."}
          </pre>
          <p>Please reload or contact support if this persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

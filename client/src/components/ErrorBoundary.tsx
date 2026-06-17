import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-background p-8 text-center">
          <span className="text-5xl mb-4">🍞</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Toast ran into an unexpected issue. Let's try again.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-3 rounded-2xl bg-[#FFCC02] text-gray-900 font-semibold text-sm hover:bg-[#FFD633] transition-colors"
            data-testid="button-error-retry"
          >
            Try Again
          </button>
          <button
            onClick={() => { window.location.href = "/"; }}
            className="mt-3 px-6 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="button-error-home"
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

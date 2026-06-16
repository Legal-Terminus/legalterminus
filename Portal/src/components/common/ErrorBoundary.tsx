import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Receives the error + a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors in its subtree so a single bad row / malformed
 * record degrades gracefully instead of unmounting the whole page (blank screen).
 * Use around lists/tables that render server data of uncertain shape.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface for debugging; replace with real logging if/when available.
    console.error('[ErrorBoundary] render error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="card p-8 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Something went wrong displaying this section.</p>
          <p className="text-xs text-ink-faint mt-1">{error.message}</p>
        </div>
        <button onClick={this.reset} className="btn-secondary">Try again</button>
      </div>
    );
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('report_evidence_pages_v3');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 text-center space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Ocurrió un detalle técnico
              </h2>
              <p className="text-sm text-slate-600">
                No te preocupes, puedes reiniciar la aplicación con un solo toque.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

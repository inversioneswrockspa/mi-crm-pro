import {StrictMode, Component, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ProfileProvider } from './contexts/ProfileContext';
import { CatalogProvider } from './contexts/CatalogContext';
import { QuoteProvider } from './contexts/QuoteContext';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      let errorMsg = 'Unknown error';
      try {
        if (this.state.error instanceof Error) {
          errorMsg = this.state.error.stack || this.state.error.message;
        } else {
          errorMsg = JSON.stringify(this.state.error, null, 2);
        }
      } catch(e) {
        errorMsg = 'Error object could not be stringified.';
      }
      return <div style={{padding: 20, color: 'red', backgroundColor: 'white'}}><h1>Error:</h1><pre style={{whiteSpace: 'pre-wrap'}}>{errorMsg}</pre></div>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProfileProvider>
        <CatalogProvider>
          <QuoteProvider>
            <App />
          </QuoteProvider>
        </CatalogProvider>
      </ProfileProvider>
    </ErrorBoundary>
  </StrictMode>,
);

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DVS Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#fef2f2'
        }}>
          <h1 style={{ color: '#dc2626' }}>Oops! Something went wrong.</h1>
          <p style={{ color: '#7f1d1d', maxWidth: '500px' }}>
            DVS encountered an unexpected error. Our digital curators have been notified. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '20px', 
              padding: '12px 24px', 
              background: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
          >
            Refresh System
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ 
              marginTop: '40px', 
              textAlign: 'left', 
              background: '#fee2e2', 
              padding: '20px', 
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              maxWidth: '90vw'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

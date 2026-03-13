'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div
                        style={{
                            padding: '1.5rem',
                            textAlign: 'center',
                            color: '#f87171',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <p>Что-то пошло не так</p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            style={{
                                background: 'rgba(239,68,68,0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.3)',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            Попробовать снова
                        </button>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}

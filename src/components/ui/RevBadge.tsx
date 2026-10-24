import React from 'react';

export type RevBadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';

export interface RevBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: RevBadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const RevBadge: React.FC<RevBadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'success':
        return {
          background: 'var(--status-ok-dim)',
          color: 'var(--status-ok)',
          borderColor: 'rgba(16, 185, 129, 0.4)',
        };
      case 'warning':
        return {
          background: 'var(--status-warn-dim)',
          color: 'var(--status-warn)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
        };
      case 'error':
        return {
          background: 'var(--status-error-dim)',
          color: 'var(--status-error)',
          borderColor: 'rgba(239, 68, 68, 0.4)',
        };
      case 'info':
        return {
          background: 'var(--status-info-dim)',
          color: 'var(--status-info)',
          borderColor: 'rgba(56, 189, 248, 0.4)',
        };
      case 'accent':
        return {
          background: 'var(--accent-pwr-dim)',
          color: 'var(--accent-pwr)',
          borderColor: 'var(--accent-pwr-border)',
        };
      case 'default':
      default:
        return {
          background: 'var(--surface-badge)',
          color: 'var(--text-secondary)',
          borderColor: 'var(--border-subtle)',
        };
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`rev-badge rev-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: isSmall ? '9px' : '10.5px',
        fontWeight: 700,
        lineHeight: 1.25,
        padding: isSmall ? '1px 5px' : '2px 8px',
        borderRadius: 'var(--radius-xs)',
        border: '1px solid',
        letterSpacing: '0.02em',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

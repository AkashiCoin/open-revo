import React from 'react';
import { Loader2 } from 'lucide-react';

export type RevButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface RevButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: RevButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const RevButton: React.FC<RevButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--accent-pwr)',
          color: '#ffffff',
          borderColor: 'var(--accent-pwr-border)',
          boxShadow: '0 0 10px var(--accent-pwr-glow)',
        };
      case 'danger':
        return {
          background: 'var(--status-error)',
          color: '#ffffff',
          borderColor: 'rgba(239, 68, 68, 0.5)',
          boxShadow: '0 0 10px var(--status-error-dim)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-medium)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          borderColor: 'transparent',
        };
      case 'secondary':
      default:
        return {
          background: 'var(--surface-pill)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-subtle)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '2px 8px',
          fontSize: '10px',
          borderRadius: 'var(--radius-xs)',
        };
      case 'lg':
        return {
          padding: '8px 16px',
          fontSize: '13px',
          borderRadius: 'var(--radius-md)',
        };
      case 'md':
      default:
        return {
          padding: '5px 12px',
          fontSize: '11.5px',
          borderRadius: 'var(--radius-sm)',
        };
    }
  };

  return (
    <button
      className={`rev-button rev-button-${variant} ${className}`}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: '1px solid',
        transition: 'var(--transition-fast)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        lineHeight: 1.25,
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="rev-button-icon">{icon}</span>
      )}
      {children}
    </button>
  );
};

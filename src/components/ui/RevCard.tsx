import React from 'react';

export type RevCardVariant = 'default' | 'sunken' | 'elevated' | 'accent';

export interface RevCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: RevCardVariant;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  glow?: boolean;
}

export const RevCard: React.FC<RevCardProps> = ({
  variant = 'default',
  title,
  subtitle,
  icon,
  action,
  glow = false,
  children,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'sunken':
        return {
          background: 'var(--surface-sunken)',
          borderColor: 'var(--border-subtle)',
        };
      case 'elevated':
        return {
          background: 'var(--surface-card-hover)',
          borderColor: 'var(--border-medium)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        };
      case 'accent':
        return {
          background: 'linear-gradient(135deg, var(--accent-pwr-dim) 0%, var(--surface-card) 100%)',
          borderColor: 'var(--accent-pwr-border)',
          boxShadow: glow ? '0 0 16px var(--accent-pwr-glow)' : 'none',
        };
      case 'default':
      default:
        return {
          background: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
        };
    }
  };

  const hasHeader = title || subtitle || icon || action;

  return (
    <div
      className={`rev-card rev-card-${variant} ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'var(--transition-fast)',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {icon && <div className="rev-card-icon" style={{ flexShrink: 0 }}>{icon}</div>}
            <div style={{ minWidth: 0 }}>
              {title && (
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.02em',
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </div>
              )}
              {subtitle && (
                <div
                  style={{
                    fontSize: '9.5px',
                    color: 'var(--text-dim)',
                    lineHeight: 1.25,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          {action && <div className="rev-card-action" style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

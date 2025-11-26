import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils';

// Card Component
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, gradient = false, glass = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl border shadow-card overflow-hidden',
          glass
            ? 'bg-surface-50/50 backdrop-blur-xl border-white/10'
            : 'bg-surface-50 border-white/5',
          hover && 'transition-all duration-500 hover:border-accent/30 hover:shadow-glow-md hover:-translate-y-1',
          gradient && 'gradient-border',
          className
        )}
        {...props}
      >
        {glass && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// Motion Card
export const MotionCard = forwardRef<HTMLDivElement, CardProps & HTMLMotionProps<'div'>>(
  ({ className, hover = false, gradient = false, glass = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-2xl border shadow-card overflow-hidden',
          glass
            ? 'bg-surface-50/50 backdrop-blur-xl border-white/10'
            : 'bg-surface-50 border-white/5',
          hover && 'transition-all duration-500 hover:border-accent/30 hover:shadow-glow-md hover:-translate-y-1',
          gradient && 'gradient-border',
          className
        )}
        whileHover={hover ? { y: -4, boxShadow: '0 20px 60px -12px rgba(201, 169, 98, 0.25)' } : undefined}
        {...props}
      >
        {glass && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
        {children}
      </motion.div>
    );
  }
);
MotionCard.displayName = 'MotionCard';

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'relative bg-gradient-to-r from-accent via-accent to-accent-light text-surface hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] overflow-hidden group',
      secondary: 'bg-surface-100 text-text-primary border border-white/10 hover:bg-surface-200 hover:border-accent/30 hover:shadow-glow-sm active:scale-[0.98]',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-100/50',
      danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 hover:shadow-glow-sm hover:shadow-danger/20 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {variant === 'primary' && !disabled && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        )}
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';

// Badge Component
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'accent';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface-200 text-text-secondary',
      success: 'bg-success/15 text-success',
      danger: 'bg-danger/15 text-danger',
      warning: 'bg-warning/15 text-warning',
      accent: 'bg-accent/15 text-accent',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

// Progress Component
interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, size = 'md', ...props }, ref) => {
    const percentage = Math.min(100, (value / max) * 100);

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">{value.toLocaleString()}</span>
            <span className="text-text-muted">{max.toLocaleString()}</span>
          </div>
        )}
        <div className={cn('w-full bg-surface-200 rounded-full overflow-hidden', sizes[size])}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              percentage >= 100
                ? 'bg-success'
                : percentage >= 75
                ? 'bg-accent'
                : percentage >= 50
                ? 'bg-warning'
                : 'bg-accent'
            )}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

// Avatar Component
interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="font-semibold text-accent">{fallback}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-text-primary placeholder:text-text-muted',
              'transition-all duration-200 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              icon && 'pl-12',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Export Modal separately
export { default as Modal } from './Modal';

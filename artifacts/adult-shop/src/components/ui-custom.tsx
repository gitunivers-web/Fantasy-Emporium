import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    variant?: 'default' | 'outline' | 'ghost' | 'glass', 
    size?: 'sm' | 'md' | 'lg' | 'icon',
    isLoading?: boolean
  }
>(({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:from-primary/90 hover:to-primary",
    outline: "border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary",
    ghost: "hover:bg-primary/10 text-foreground hover:text-primary",
    glass: "glass-panel hover:bg-white/10 text-foreground"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 py-2 text-sm",
    lg: "h-14 px-8 text-base",
    icon: "h-11 w-11"
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = "Button";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-xl border bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300",
        "border-border/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus:border-destructive focus:ring-destructive/50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/90",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Badge = ({ className, variant = 'default', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' | 'destructive' }) => {
  const variants = {
    default: "bg-primary/20 text-primary border border-primary/30",
    outline: "border border-border text-muted-foreground",
    destructive: "bg-destructive/20 text-destructive border border-destructive/30"
  };
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

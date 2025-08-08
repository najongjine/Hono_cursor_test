import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../../utils/cn';
import * as React from 'react';
export const Button = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2';
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-accent',
    };
    return _jsx("button", { ref: ref, className: cn(base, variants[variant], className), ...props });
});
Button.displayName = 'Button';

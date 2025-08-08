import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../utils/cn';
export const Label = React.forwardRef(({ className, ...props }, ref) => (_jsx("label", { ref: ref, className: cn('text-sm font-medium', className), ...props })));
Label.displayName = 'Label';

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
export function AppLayout() {
    const { pathname } = useLocation();
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx("header", { className: "border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10", children: _jsxs("div", { className: "container flex items-center justify-between h-14", children: [_jsx(Link, { to: "/", className: "font-semibold", children: "Plant Detector" }), _jsxs("nav", { className: "flex gap-4 text-sm", children: [_jsx(NavLink, { to: "/", active: pathname === '/', children: "Detect" }), _jsx(NavLink, { to: "/history", active: pathname.startsWith('/history'), children: "History" }), _jsx(NavLink, { to: "/model", active: pathname.startsWith('/model'), children: "Model" }), _jsx(NavLink, { to: "/settings", active: pathname.startsWith('/settings'), children: "Settings" })] })] }) }), _jsx("main", { className: "container py-6 flex-1", children: _jsx(Outlet, {}) }), _jsx("footer", { className: "border-t py-4 text-center text-xs text-muted-foreground", children: "Demo app \u2014 not medical advice." })] }));
}
function NavLink({ to, active, children }) {
    return (_jsx(Link, { to: to, className: cn('px-2 py-1 rounded-md hover:bg-accent', active && 'bg-accent'), children: children }));
}

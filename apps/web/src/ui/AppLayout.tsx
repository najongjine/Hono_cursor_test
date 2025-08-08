import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

export function AppLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-semibold">Plant Detector</Link>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" active={pathname === '/'}>Detect</NavLink>
            <NavLink to="/history" active={pathname.startsWith('/history')}>History</NavLink>
            <NavLink to="/model" active={pathname.startsWith('/model')}>Model</NavLink>
            <NavLink to="/settings" active={pathname.startsWith('/settings')}>Settings</NavLink>
          </nav>
        </div>
      </header>
      <main className="container py-6 flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Demo app — not medical advice.
      </footer>
    </div>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className={cn('px-2 py-1 rounded-md hover:bg-accent', active && 'bg-accent')}>{children}</Link>
  );
}
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../stores/authStore';
import { 
  Home, 
  Building2, 
  ClipboardList, 
  Users, 
  LogOut,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const isLeader = user?.role === 'leader';

  const navigation = [
    {
      name: 'Dashboard',
      href: isLeader ? '/dashboard' : '/my-tasks',
      icon: Home,
      show: true,
    },
    {
      name: 'Settlements',
      href: '/settlements',
      icon: Building2,
      show: isLeader,
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: ClipboardList,
      show: isLeader,
    },
    {
      name: 'My Tasks',
      href: '/my-tasks',
      icon: ClipboardList,
      show: !isLeader,
    },
    {
      name: 'Players',
      href: '/players',
      icon: Users,
      show: isLeader,
    },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Guild Resource Manager</h1>
              {user && (
                <span className="text-sm text-muted-foreground">
                  {user.username} ({user.role})
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="w-64 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
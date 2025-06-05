import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings,
  Zap,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, current: true },
  { name: "Analytics", icon: BarChart3, current: false },
  { name: "Customers", icon: Users, current: false },
  { name: "Billing", icon: CreditCard, current: false },
  { name: "Settings", icon: Settings, current: false },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-full backdrop-blur-xl bg-white/80 dark:bg-black/20 border-r border-gray-200 dark:border-white/10 z-40 shadow-lg">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">SaaSPro</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={item.current ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 rounded-xl text-left font-medium transition-all duration-200",
                  item.current 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" 
                    : "text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-3 p-3 rounded-xl backdrop-blur-xl bg-white/90 dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="User avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john@company.com</p>
            </div>
            <Button variant="ghost" size="sm" className="p-1.5 h-auto rounded-lg hover:bg-white/10">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

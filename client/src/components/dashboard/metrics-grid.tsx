import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from "@/hooks/use-dashboard-data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { DollarSign, Users, TrendingUp, Activity, ArrowUp, ArrowDown } from "lucide-react";

const metricConfigs = [
  {
    key: "revenue",
    label: "Total Revenue",
    icon: DollarSign,
    color: "green",
    formatter: formatCurrency,
    changeKey: "revenueChange"
  },
  {
    key: "users",
    label: "Active Users",
    icon: Users,
    color: "blue",
    formatter: formatNumber,
    changeKey: "usersChange"
  },
  {
    key: "conversionRate",
    label: "Conversion Rate",
    icon: TrendingUp,
    color: "purple",
    formatter: (value: string | number) => `${value}%`,
    changeKey: "conversionChange"
  },
  {
    key: "growthRate",
    label: "Growth Rate",
    icon: Activity,
    color: "orange",
    formatter: (value: string | number) => `${value}%`,
    changeKey: "growthChange"
  }
];

const colorClasses = {
  green: "bg-green-500/20 text-green-500",
  blue: "bg-blue-500/20 text-blue-500",
  purple: "bg-purple-500/20 text-purple-500",
  orange: "bg-orange-500/20 text-orange-500",
};

export function MetricsGrid() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="backdrop-blur-xl bg-white/90 dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="w-24 h-8 mb-1" />
              <Skeleton className="w-20 h-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">No metrics data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricConfigs.map((config, index) => {
        const Icon = config.icon;
        const value = metrics[config.key as keyof typeof metrics];
        const change = metrics[config.changeKey as keyof typeof metrics];
        const changeValue = typeof change === 'string' ? parseFloat(change) : change;
        const isPositive = changeValue > 0;
        
        return (
          <Card 
            key={config.key} 
            className="backdrop-blur-xl bg-white/90 dark:bg-black/20 border border-gray-200 dark:border-white/10 hover:scale-105 transition-all duration-300 group shadow-lg"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${colorClasses[config.color]} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  isPositive 
                    ? 'text-green-500 bg-green-500/20' 
                    : 'text-red-500 bg-red-500/20'
                }`}>
                  {isPositive ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {formatPercentage(changeValue)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {config.formatter(value)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{config.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

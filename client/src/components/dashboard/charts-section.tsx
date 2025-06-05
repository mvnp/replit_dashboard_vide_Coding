import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenueData } from "@/hooks/use-dashboard-data";
import { ActivityFeed } from "./activity-feed";
import { BarChart3 } from "lucide-react";

const timeRanges = [
  { label: "7D", value: 7, active: true },
  { label: "30D", value: 30, active: false },
  { label: "90D", value: 90, active: false },
];

export function ChartsSection() {
  const { data: revenueData, isLoading } = useRevenueData(7);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Revenue Chart */}
      <Card className="lg:col-span-2 backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Revenue Analytics
            </CardTitle>
            <div className="flex items-center space-x-2">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={range.active ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs h-8 ${
                    range.active 
                      ? "bg-primary-500 text-white" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ) : (
            <div className="h-80 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Interactive Revenue Chart</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Chart visualization will be implemented here
                </p>
                {revenueData && (
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                    Data points: {revenueData.length}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}

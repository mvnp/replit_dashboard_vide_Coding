import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities } from "@/hooks/use-dashboard-data";
import { getRelativeTime } from "@/lib/utils";
import { 
  Check, 
  UserPlus, 
  CreditCard, 
  AlertTriangle, 
  ExternalLink 
} from "lucide-react";

const iconMap = {
  "check": Check,
  "user-plus": UserPlus,
  "credit-card": CreditCard,
  "alert-triangle": AlertTriangle,
};

const colorMap = {
  green: "bg-green-500/20 text-green-500",
  blue: "bg-blue-500/20 text-blue-500",
  purple: "bg-purple-500/20 text-purple-500",
  orange: "bg-orange-500/20 text-orange-500",
};

export function ActivityFeed() {
  const { data: activities, isLoading } = useActivities(4);

  return (
    <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary-500 hover:text-primary-600 text-sm font-medium hover:bg-white/10"
          >
            View All
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Check;
              const colorClass = colorMap[activity.iconColor as keyof typeof colorMap] || colorMap.green;
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

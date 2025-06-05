import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { formatDate } from "@/lib/utils";
import { Search, Filter, Edit, Trash2, UserPlus } from "lucide-react";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface UsersTableProps {
  onEditUser?: (user: User) => void;
  onCreateUser?: () => void;
}

const roleColors = {
  admin: "bg-red-500/20 text-red-500",
  manager: "bg-blue-500/20 text-blue-500",
  user: "bg-green-500/20 text-green-500",
};

export function UsersTable({ onEditUser, onCreateUser }: UsersTableProps) {
  const { data: users, isLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast({
        title: "User deleted",
        description: `${user.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Card className="backdrop-blur-xl bg-white/90 dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Users Management
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32 bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-md">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 shadow-md"
              />
            </div>
            
            {onCreateUser && (
              <Button 
                onClick={onCreateUser}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-24 h-3" />
                </div>
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-24 h-4" />
              </div>
            ))}
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || roleFilter !== "all" ? "No users match your filters" : "No users available"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-white/5 dark:hover:bg-black/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                          alt={`${user.name} avatar`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {user.username}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        className={`text-xs capitalize ${roleColors[user.role as keyof typeof roleColors] || roleColors.user}`}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {onEditUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditUser(user)}
                            className="p-2 h-auto hover:bg-blue-500/10 text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 h-auto hover:bg-red-500/10 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900 dark:text-white">
                                Delete User
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                Are you sure you want to delete {user.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deleteUserMutation.isPending}
                              >
                                {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
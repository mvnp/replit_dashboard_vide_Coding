import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { UserForm } from "@/components/users/user-form";
import { UsersTable } from "@/components/users/users-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { User } from "@shared/schema";

type ViewMode = "list" | "create" | "edit";

export default function UsersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setViewMode("create");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setViewMode("edit");
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setViewMode("list");
  };

  const handleSuccess = () => {
    setViewMode("list");
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <main className="ml-64 p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {viewMode !== "list" && (
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="p-2 hover:bg-white/10 dark:hover:bg-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {viewMode === "list" ? "Users Management" : 
                 viewMode === "create" ? "Create New User" : "Edit User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {viewMode === "list" ? "Manage your application users and their permissions." :
                 viewMode === "create" ? "Add a new user to your application." : 
                 `Edit ${selectedUser?.name}'s information and permissions.`}
              </p>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <UsersTable 
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
          />
        ) : (
          <UserForm
            user={selectedUser || undefined}
            onSuccess={handleSuccess}
            onCancel={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}
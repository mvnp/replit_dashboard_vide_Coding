import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema, updateUserSchema } from "@shared/schema";
import type { User, InsertUser, UpdateUser } from "@shared/schema";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Save } from "lucide-react";

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { toast } = useToast();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  
  const isEditing = !!user;
  const schema = isEditing ? updateUserSchema : insertUserSchema;
  
  const form = useForm<InsertUser | UpdateUser>({
    resolver: zodResolver(schema),
    defaultValues: isEditing ? {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || "",
    } : {
      username: "",
      password: "",
      email: "",
      name: "",
      role: "user",
      avatar: "",
    },
  });

  const onSubmit = async (data: InsertUser | UpdateUser) => {
    try {
      if (isEditing && user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          userData: data as UpdateUser
        });
        toast({
          title: "User updated",
          description: "User has been updated successfully.",
        });
      } else {
        await createUserMutation.mutateAsync(data as InsertUser);
        toast({
          title: "User created",
          description: "User has been created successfully.",
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Card className="backdrop-blur-xl bg-white/90 dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          {isEditing ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              Edit User
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Add New User
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter full name"
                        className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter username"
                        className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email address"
                        className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/20">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter password"
                          className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter avatar URL"
                        className="bg-white/90 dark:bg-white/5 border border-gray-200 dark:border-white/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Update User" : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
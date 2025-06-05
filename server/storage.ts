import { 
  users, 
  dashboardMetrics, 
  transactions, 
  activities, 
  revenueData,
  type User, 
  type InsertUser,
  type DashboardMetrics,
  type InsertDashboardMetrics,
  type Transaction,
  type InsertTransaction,
  type Activity,
  type InsertActivity,
  type RevenueData,
  type InsertRevenueData
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDashboardMetrics(): Promise<DashboardMetrics | undefined>;
  updateDashboardMetrics(metrics: InsertDashboardMetrics): Promise<DashboardMetrics>;
  getTransactions(limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRevenueData(days?: number): Promise<RevenueData[]>;
  createRevenueData(data: InsertRevenueData): Promise<RevenueData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dashboardMetrics: DashboardMetrics | null;
  private transactions: Map<number, Transaction>;
  private activities: Map<number, Activity>;
  private revenueData: Map<number, RevenueData>;
  private currentUserId: number;
  private currentTransactionId: number;
  private currentActivityId: number;
  private currentRevenueId: number;
  private currentMetricsId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.activities = new Map();
    this.revenueData = new Map();
    this.dashboardMetrics = null;
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    this.currentActivityId = 1;
    this.currentRevenueId = 1;
    this.currentMetricsId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample user
    const user: User = {
      id: this.currentUserId++,
      username: "johndoe",
      password: "hashedpassword",
      email: "john@company.com",
      name: "John Doe",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      createdAt: new Date(),
    };
    this.users.set(user.id, user);

    // Initialize dashboard metrics
    this.dashboardMetrics = {
      id: this.currentMetricsId++,
      revenue: "47892.00",
      users: 12847,
      conversionRate: "24.80",
      growthRate: "89.20",
      revenueChange: "12.50",
      usersChange: "8.20",
      conversionChange: "3.10",
      growthChange: "15.30",
      updatedAt: new Date(),
    };

    // Initialize transactions
    const sampleTransactions: Omit<Transaction, 'id'>[] = [
      {
        customerId: 1,
        customerName: "Alex Johnson",
        customerEmail: "alex@company.com",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        plan: "Pro Plan",
        amount: "99.00",
        status: "completed",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        customerId: 2,
        customerName: "Sarah Wilson",
        customerEmail: "sarah@startup.co",
        customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332c63d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        plan: "Enterprise",
        amount: "299.00",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        customerId: 3,
        customerName: "Michael Chen",
        customerEmail: "mike@tech.io",
        customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        plan: "Basic Plan",
        amount: "29.00",
        status: "completed",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      }
    ];

    sampleTransactions.forEach((transaction) => {
      const newTransaction = { ...transaction, id: this.currentTransactionId++ };
      this.transactions.set(newTransaction.id, newTransaction);
    });

    // Initialize activities
    const sampleActivities: Omit<Activity, 'id'>[] = [
      {
        type: "subscription_started",
        description: "New subscription started",
        icon: "check",
        iconColor: "green",
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        type: "user_registered",
        description: "User registered",
        icon: "user-plus",
        iconColor: "blue",
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        type: "payment_processed",
        description: "Payment processed",
        icon: "credit-card",
        iconColor: "purple",
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        type: "system_maintenance",
        description: "System maintenance",
        icon: "alert-triangle",
        iconColor: "orange",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      }
    ];

    sampleActivities.forEach((activity) => {
      const newActivity = { ...activity, id: this.currentActivityId++ };
      this.activities.set(newActivity.id, newActivity);
    });

    // Initialize revenue data for the last 7 days
    const today = new Date();
    const sampleRevenueData = [
      { date: this.formatDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)), revenue: "12000.00" },
      { date: this.formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)), revenue: "19000.00" },
      { date: this.formatDate(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)), revenue: "15000.00" },
      { date: this.formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)), revenue: "25000.00" },
      { date: this.formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)), revenue: "22000.00" },
      { date: this.formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)), revenue: "30000.00" },
      { date: this.formatDate(today), revenue: "28000.00" },
    ];

    sampleRevenueData.forEach((data) => {
      const newData = { ...data, id: this.currentRevenueId++, createdAt: new Date() };
      this.revenueData.set(newData.id, newData);
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics | undefined> {
    return this.dashboardMetrics || undefined;
  }

  async updateDashboardMetrics(metrics: InsertDashboardMetrics): Promise<DashboardMetrics> {
    const updated: DashboardMetrics = {
      ...metrics,
      id: this.dashboardMetrics?.id || this.currentMetricsId++,
      updatedAt: new Date(),
    };
    this.dashboardMetrics = updated;
    return updated;
  }

  async getTransactions(limit: number = 10): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = {
      ...activity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getRevenueData(days: number = 7): Promise<RevenueData[]> {
    return Array.from(this.revenueData.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  }

  async createRevenueData(data: InsertRevenueData): Promise<RevenueData> {
    const id = this.currentRevenueId++;
    const newData: RevenueData = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.revenueData.set(id, newData);
    return newData;
  }
}

export const storage = new MemStorage();

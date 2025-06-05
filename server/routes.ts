import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertActivitySchema, insertRevenueDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard metrics endpoint
  app.get("/api/dashboard/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      if (!metrics) {
        return res.status(404).json({ message: "Dashboard metrics not found" });
      }
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Transactions endpoint
  app.get("/api/dashboard/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const transactions = await storage.getTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Create transaction endpoint
  app.post("/api/dashboard/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Activities endpoint
  app.get("/api/dashboard/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Create activity endpoint
  app.post("/api/dashboard/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  // Revenue data endpoint
  app.get("/api/dashboard/revenue", async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const revenueData = await storage.getRevenueData(days);
      res.json(revenueData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  // Create revenue data endpoint
  app.post("/api/dashboard/revenue", async (req, res) => {
    try {
      const validatedData = insertRevenueDataSchema.parse(req.body);
      const revenueData = await storage.createRevenueData(validatedData);
      res.status(201).json(revenueData);
    } catch (error) {
      res.status(400).json({ message: "Invalid revenue data" });
    }
  });

  // Export dashboard data
  app.get("/api/dashboard/export", async (_req, res) => {
    try {
      const [metrics, transactions, activities, revenueData] = await Promise.all([
        storage.getDashboardMetrics(),
        storage.getTransactions(100),
        storage.getActivities(50),
        storage.getRevenueData(30)
      ]);

      const exportData = {
        metrics,
        transactions,
        activities,
        revenueData,
        exportedAt: new Date().toISOString()
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="dashboard-export.json"');
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

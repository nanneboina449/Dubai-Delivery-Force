import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRiderApplicationSchema, 
  insertContractorApplicationSchema, 
  insertBusinessInquirySchema,
  updateRiderApplicationSchema,
  updateContractorApplicationSchema,
  updateBusinessInquirySchema
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Rider Application endpoint
  app.post("/api/rider-applications", async (req, res) => {
    try {
      const validatedData = insertRiderApplicationSchema.parse(req.body);
      const application = await storage.createRiderApplication(validatedData);
      res.status(201).json({ success: true, data: application });
    } catch (error) {
      console.error("Rider application error:", error);
      res.status(400).json({ success: false, error: "Invalid application data" });
    }
  });

  // Contractor Application endpoint
  app.post("/api/contractor-applications", async (req, res) => {
    try {
      const validatedData = insertContractorApplicationSchema.parse(req.body);
      const application = await storage.createContractorApplication(validatedData);
      res.status(201).json({ success: true, data: application });
    } catch (error) {
      console.error("Contractor application error:", error);
      res.status(400).json({ success: false, error: "Invalid application data" });
    }
  });

  // Business Inquiry endpoint
  app.post("/api/business-inquiries", async (req, res) => {
    try {
      const validatedData = insertBusinessInquirySchema.parse(req.body);
      const inquiry = await storage.createBusinessInquiry(validatedData);
      res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
      console.error("Business inquiry error:", error);
      res.status(400).json({ success: false, error: "Invalid inquiry data" });
    }
  });

  // ============ ADMIN API ROUTES ============

  // Dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // Get all rider applications
  app.get("/api/admin/rider-applications", async (req, res) => {
    try {
      const applications = await storage.getRiderApplications();
      res.json(applications);
    } catch (error) {
      console.error("Get riders error:", error);
      res.status(500).json({ error: "Failed to get applications" });
    }
  });

  // Get single rider application
  app.get("/api/admin/rider-applications/:id", async (req, res) => {
    try {
      const application = await storage.getRiderApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Get rider error:", error);
      res.status(500).json({ error: "Failed to get application" });
    }
  });

  // Update rider application
  app.patch("/api/admin/rider-applications/:id", async (req, res) => {
    try {
      const validatedData = updateRiderApplicationSchema.parse(req.body);
      const application = await storage.updateRiderApplication(req.params.id, validatedData);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Update rider error:", error);
      res.status(400).json({ error: "Failed to update application" });
    }
  });

  // Get all contractor applications
  app.get("/api/admin/contractor-applications", async (req, res) => {
    try {
      const applications = await storage.getContractorApplications();
      res.json(applications);
    } catch (error) {
      console.error("Get contractors error:", error);
      res.status(500).json({ error: "Failed to get applications" });
    }
  });

  // Get single contractor application
  app.get("/api/admin/contractor-applications/:id", async (req, res) => {
    try {
      const application = await storage.getContractorApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Get contractor error:", error);
      res.status(500).json({ error: "Failed to get application" });
    }
  });

  // Update contractor application
  app.patch("/api/admin/contractor-applications/:id", async (req, res) => {
    try {
      const validatedData = updateContractorApplicationSchema.parse(req.body);
      const application = await storage.updateContractorApplication(req.params.id, validatedData);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Update contractor error:", error);
      res.status(400).json({ error: "Failed to update application" });
    }
  });

  // Get all business inquiries
  app.get("/api/admin/business-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getBusinessInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Get inquiries error:", error);
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Get single business inquiry
  app.get("/api/admin/business-inquiries/:id", async (req, res) => {
    try {
      const inquiry = await storage.getBusinessInquiry(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      console.error("Get inquiry error:", error);
      res.status(500).json({ error: "Failed to get inquiry" });
    }
  });

  // Update business inquiry
  app.patch("/api/admin/business-inquiries/:id", async (req, res) => {
    try {
      const validatedData = updateBusinessInquirySchema.parse(req.body);
      const inquiry = await storage.updateBusinessInquiry(req.params.id, validatedData);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      console.error("Update inquiry error:", error);
      res.status(400).json({ error: "Failed to update inquiry" });
    }
  });

  return httpServer;
}

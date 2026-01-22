import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRiderApplicationSchema, 
  insertContractorApplicationSchema, 
  insertBusinessInquirySchema 
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

  return httpServer;
}

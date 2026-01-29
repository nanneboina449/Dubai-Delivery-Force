import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { 
  insertRiderApplicationSchema, 
  insertContractorApplicationSchema, 
  insertBusinessInquirySchema,
  updateRiderApplicationSchema,
  updateContractorApplicationSchema,
  updateBusinessInquirySchema,
  insertDriverSchema,
  insertActiveContractorSchema,
  insertFleetVehicleSchema,
  insertBusinessClientSchema,
  insertDriverAssignmentSchema
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

  // ============ ADMIN AUTH ROUTES ============

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.getAdminUserByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ success: true, user: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Create admin user (protected - requires existing admin or first user)
  app.post("/api/admin/users", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const existingUser = await storage.getAdminUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await storage.createAdminUser({ username, password: hashedPassword });

      res.status(201).json({ success: true, user: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  // Check if any admin exists (for initial setup)
  app.get("/api/admin/setup-check", async (req, res) => {
    try {
      const admins = await storage.getAdminUsers();
      res.json({ needsSetup: admins.length === 0 });
    } catch (error) {
      console.error("Setup check error:", error);
      res.status(500).json({ error: "Failed to check setup status" });
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
      // Normalize status to lowercase if provided
      const normalizedBody = {
        ...req.body,
        status: req.body.status?.toLowerCase()
      };
      const validatedData = updateRiderApplicationSchema.parse(normalizedBody);
      
      // Get current application to check if status is being changed to approved
      const currentApp = await storage.getRiderApplication(req.params.id);
      if (!currentApp) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const application = await storage.updateRiderApplication(req.params.id, validatedData);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      // Auto-create driver when completed
      if (validatedData.status === "completed" && currentApp.status !== "completed") {
        try {
          await storage.createDriver({
            applicationId: application.id,
            fullName: application.fullName,
            email: application.email,
            phone: application.phone,
            emirate: application.currentLocation,
            nationality: application.nationality,
            vehicleType: application.vehicleType || "motorcycle",
            licenseNumber: application.hasUaeDrivingLicense === "yes" ? (application.licenseType || "") : "",
            licenseType: application.licenseType,
            visaStatus: application.visaStatus,
            joiningDate: new Date().toISOString().split('T')[0],
            status: "active",
            notes: `Auto-created from completed rider application ID: ${application.id}`
          });
        } catch (e) {
          console.log("Driver already exists or creation failed:", e);
        }
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
      // Normalize status to lowercase if provided
      const normalizedBody = {
        ...req.body,
        status: req.body.status?.toLowerCase()
      };
      const validatedData = updateContractorApplicationSchema.parse(normalizedBody);
      
      // Get current application to check if status is being changed to approved
      const currentApp = await storage.getContractorApplication(req.params.id);
      if (!currentApp) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const application = await storage.updateContractorApplication(req.params.id, validatedData);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      // Auto-create active contractor when completed
      if (validatedData.status === "completed" && currentApp.status !== "completed") {
        try {
          await storage.createActiveContractor({
            applicationId: application.id,
            companyName: application.companyName,
            contactPerson: application.contactPerson,
            email: application.email,
            phone: application.phone,
            tradeLicense: application.tradeLicense,
            emirate: application.emirate,
            contractStartDate: new Date().toISOString().split('T')[0],
            insuranceCoverage: application.insuranceCoverage,
            status: "active",
            notes: `Auto-created from completed contractor application ID: ${application.id}. Fleet: ${(application.fleetMotorcycles || 0) + (application.fleetCars || 0) + (application.fleetVans || 0) + (application.fleetTrucks || 0)} vehicles, ${application.totalDrivers} drivers.`
          });
        } catch (e) {
          console.log("Active contractor already exists or creation failed:", e);
        }
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
      // Normalize status to lowercase if provided
      const normalizedBody = {
        ...req.body,
        status: req.body.status?.toLowerCase()
      };
      const validatedData = updateBusinessInquirySchema.parse(normalizedBody);
      
      // Get current inquiry to check if status is being changed to completed
      const currentInquiry = await storage.getBusinessInquiry(req.params.id);
      if (!currentInquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      
      const inquiry = await storage.updateBusinessInquiry(req.params.id, validatedData);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      
      // Auto-create business client when completed
      if (validatedData.status === "completed" && currentInquiry.status !== "completed") {
        try {
          await storage.createBusinessClient({
            inquiryId: inquiry.id,
            companyName: inquiry.companyName,
            contactPerson: inquiry.contactPerson,
            email: inquiry.email,
            phone: inquiry.phone,
            industry: inquiry.industry,
            emirate: inquiry.emirate,
            contractStartDate: inquiry.startDate,
            deliveryVolume: inquiry.deliveryVolume,
            driversRequired: inquiry.ridersNeeded,
            status: "active",
            notes: `Auto-created from completed business inquiry ID: ${inquiry.id}. Contract duration: ${inquiry.contractDuration || 'N/A'}`
          });
        } catch (e) {
          console.log("Business client already exists or creation failed:", e);
        }
      }
      
      res.json(inquiry);
    } catch (error: any) {
      console.error("Update inquiry error:", error?.message || error);
      res.status(400).json({ error: error?.message || "Failed to update inquiry" });
    }
  });

  // ============ FLEET MANAGEMENT ROUTES ============

  // Drivers CRUD
  app.get("/api/admin/drivers", async (req, res) => {
    try {
      const drivers = await storage.getDrivers();
      res.json(drivers);
    } catch (error) {
      console.error("Get drivers error:", error);
      res.status(500).json({ error: "Failed to get drivers" });
    }
  });

  app.get("/api/admin/drivers/:id", async (req, res) => {
    try {
      const driver = await storage.getDriver(req.params.id);
      if (!driver) return res.status(404).json({ error: "Driver not found" });
      res.json(driver);
    } catch (error) {
      console.error("Get driver error:", error);
      res.status(500).json({ error: "Failed to get driver" });
    }
  });

  app.post("/api/admin/drivers", async (req, res) => {
    try {
      const validatedData = insertDriverSchema.parse(req.body);
      const driver = await storage.createDriver(validatedData);
      res.status(201).json(driver);
    } catch (error) {
      console.error("Create driver error:", error);
      res.status(400).json({ error: "Failed to create driver" });
    }
  });

  app.patch("/api/admin/drivers/:id", async (req, res) => {
    try {
      const driver = await storage.updateDriver(req.params.id, req.body);
      if (!driver) return res.status(404).json({ error: "Driver not found" });
      res.json(driver);
    } catch (error) {
      console.error("Update driver error:", error);
      res.status(400).json({ error: "Failed to update driver" });
    }
  });

  app.delete("/api/admin/drivers/:id", async (req, res) => {
    try {
      await storage.deleteDriver(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete driver error:", error);
      res.status(500).json({ error: "Failed to delete driver" });
    }
  });

  // Active Contractors CRUD
  app.get("/api/admin/active-contractors", async (req, res) => {
    try {
      const contractors = await storage.getActiveContractors();
      res.json(contractors);
    } catch (error) {
      console.error("Get active contractors error:", error);
      res.status(500).json({ error: "Failed to get contractors" });
    }
  });

  app.get("/api/admin/active-contractors/:id", async (req, res) => {
    try {
      const contractor = await storage.getActiveContractor(req.params.id);
      if (!contractor) return res.status(404).json({ error: "Contractor not found" });
      res.json(contractor);
    } catch (error) {
      console.error("Get active contractor error:", error);
      res.status(500).json({ error: "Failed to get contractor" });
    }
  });

  app.post("/api/admin/active-contractors", async (req, res) => {
    try {
      const validatedData = insertActiveContractorSchema.parse(req.body);
      const contractor = await storage.createActiveContractor(validatedData);
      res.status(201).json(contractor);
    } catch (error) {
      console.error("Create active contractor error:", error);
      res.status(400).json({ error: "Failed to create contractor" });
    }
  });

  app.patch("/api/admin/active-contractors/:id", async (req, res) => {
    try {
      const contractor = await storage.updateActiveContractor(req.params.id, req.body);
      if (!contractor) return res.status(404).json({ error: "Contractor not found" });
      res.json(contractor);
    } catch (error) {
      console.error("Update active contractor error:", error);
      res.status(400).json({ error: "Failed to update contractor" });
    }
  });

  app.delete("/api/admin/active-contractors/:id", async (req, res) => {
    try {
      await storage.deleteActiveContractor(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete active contractor error:", error);
      res.status(500).json({ error: "Failed to delete contractor" });
    }
  });

  // Fleet Vehicles CRUD
  app.get("/api/admin/fleet-vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getFleetVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Get fleet vehicles error:", error);
      res.status(500).json({ error: "Failed to get vehicles" });
    }
  });

  app.get("/api/admin/fleet-vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getFleetVehicle(req.params.id);
      if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
      res.json(vehicle);
    } catch (error) {
      console.error("Get fleet vehicle error:", error);
      res.status(500).json({ error: "Failed to get vehicle" });
    }
  });

  app.post("/api/admin/fleet-vehicles", async (req, res) => {
    try {
      const validatedData = insertFleetVehicleSchema.parse(req.body);
      const vehicle = await storage.createFleetVehicle(validatedData);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Create fleet vehicle error:", error);
      res.status(400).json({ error: "Failed to create vehicle" });
    }
  });

  app.patch("/api/admin/fleet-vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.updateFleetVehicle(req.params.id, req.body);
      if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
      res.json(vehicle);
    } catch (error) {
      console.error("Update fleet vehicle error:", error);
      res.status(400).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/admin/fleet-vehicles/:id", async (req, res) => {
    try {
      await storage.deleteFleetVehicle(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete fleet vehicle error:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Business Clients CRUD
  app.get("/api/admin/business-clients", async (req, res) => {
    try {
      const clients = await storage.getBusinessClients();
      res.json(clients);
    } catch (error) {
      console.error("Get business clients error:", error);
      res.status(500).json({ error: "Failed to get clients" });
    }
  });

  app.get("/api/admin/business-clients/:id", async (req, res) => {
    try {
      const client = await storage.getBusinessClient(req.params.id);
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    } catch (error) {
      console.error("Get business client error:", error);
      res.status(500).json({ error: "Failed to get client" });
    }
  });

  app.post("/api/admin/business-clients", async (req, res) => {
    try {
      const validatedData = insertBusinessClientSchema.parse(req.body);
      const client = await storage.createBusinessClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      console.error("Create business client error:", error);
      res.status(400).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/admin/business-clients/:id", async (req, res) => {
    try {
      const client = await storage.updateBusinessClient(req.params.id, req.body);
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    } catch (error) {
      console.error("Update business client error:", error);
      res.status(400).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/admin/business-clients/:id", async (req, res) => {
    try {
      await storage.deleteBusinessClient(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete business client error:", error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Driver Assignments CRUD
  app.get("/api/admin/driver-assignments", async (req, res) => {
    try {
      const assignments = await storage.getDriverAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Get driver assignments error:", error);
      res.status(500).json({ error: "Failed to get assignments" });
    }
  });

  app.get("/api/admin/driver-assignments/:id", async (req, res) => {
    try {
      const assignment = await storage.getDriverAssignment(req.params.id);
      if (!assignment) return res.status(404).json({ error: "Assignment not found" });
      res.json(assignment);
    } catch (error) {
      console.error("Get driver assignment error:", error);
      res.status(500).json({ error: "Failed to get assignment" });
    }
  });

  app.post("/api/admin/driver-assignments", async (req, res) => {
    try {
      const validatedData = insertDriverAssignmentSchema.parse(req.body);
      const assignment = await storage.createDriverAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Create driver assignment error:", error);
      res.status(400).json({ error: "Failed to create assignment" });
    }
  });

  app.patch("/api/admin/driver-assignments/:id", async (req, res) => {
    try {
      const assignment = await storage.updateDriverAssignment(req.params.id, req.body);
      if (!assignment) return res.status(404).json({ error: "Assignment not found" });
      res.json(assignment);
    } catch (error) {
      console.error("Update driver assignment error:", error);
      res.status(400).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/admin/driver-assignments/:id", async (req, res) => {
    try {
      await storage.deleteDriverAssignment(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete driver assignment error:", error);
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  return httpServer;
}

import { 
  type User, 
  type InsertUser,
  type RiderApplication,
  type InsertRiderApplication,
  type ContractorApplication,
  type InsertContractorApplication,
  type BusinessInquiry,
  type InsertBusinessInquiry,
  type AdminUser,
  type InsertAdminUser,
  type Driver,
  type InsertDriver,
  type ActiveContractor,
  type InsertActiveContractor,
  type FleetVehicle,
  type InsertFleetVehicle,
  type BusinessClient,
  type InsertBusinessClient,
  type DriverAssignment,
  type InsertDriverAssignment,
  users,
  riderApplications,
  contractorApplications,
  businessInquiries,
  adminUsers,
  drivers,
  activeContractors,
  fleetVehicles,
  businessClients,
  driverAssignments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createRiderApplication(application: InsertRiderApplication): Promise<RiderApplication>;
  getRiderApplications(): Promise<RiderApplication[]>;
  getRiderApplication(id: string): Promise<RiderApplication | undefined>;
  updateRiderApplication(id: string, updates: { status?: string; adminNotes?: string }): Promise<RiderApplication | undefined>;
  
  createContractorApplication(application: InsertContractorApplication): Promise<ContractorApplication>;
  getContractorApplications(): Promise<ContractorApplication[]>;
  getContractorApplication(id: string): Promise<ContractorApplication | undefined>;
  updateContractorApplication(id: string, updates: { status?: string; adminNotes?: string }): Promise<ContractorApplication | undefined>;
  
  createBusinessInquiry(inquiry: InsertBusinessInquiry): Promise<BusinessInquiry>;
  getBusinessInquiries(): Promise<BusinessInquiry[]>;
  getBusinessInquiry(id: string): Promise<BusinessInquiry | undefined>;
  updateBusinessInquiry(id: string, updates: { status?: string; adminNotes?: string }): Promise<BusinessInquiry | undefined>;
  
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getAdminUsers(): Promise<AdminUser[]>;
  
  getDashboardStats(): Promise<{ riders: number; contractors: number; inquiries: number; pending: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createRiderApplication(application: InsertRiderApplication): Promise<RiderApplication> {
    const [result] = await db.insert(riderApplications).values(application).returning();
    return result;
  }

  async getRiderApplications(): Promise<RiderApplication[]> {
    return await db.select().from(riderApplications).orderBy(desc(riderApplications.createdAt));
  }

  async getRiderApplication(id: string): Promise<RiderApplication | undefined> {
    const [result] = await db.select().from(riderApplications).where(eq(riderApplications.id, id));
    return result;
  }

  async updateRiderApplication(id: string, updates: { status?: string; adminNotes?: string }): Promise<RiderApplication | undefined> {
    const [result] = await db.update(riderApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(riderApplications.id, id))
      .returning();
    return result;
  }

  async createContractorApplication(application: InsertContractorApplication): Promise<ContractorApplication> {
    const [result] = await db.insert(contractorApplications).values(application).returning();
    return result;
  }

  async getContractorApplications(): Promise<ContractorApplication[]> {
    return await db.select().from(contractorApplications).orderBy(desc(contractorApplications.createdAt));
  }

  async getContractorApplication(id: string): Promise<ContractorApplication | undefined> {
    const [result] = await db.select().from(contractorApplications).where(eq(contractorApplications.id, id));
    return result;
  }

  async updateContractorApplication(id: string, updates: { status?: string; adminNotes?: string }): Promise<ContractorApplication | undefined> {
    const [result] = await db.update(contractorApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contractorApplications.id, id))
      .returning();
    return result;
  }

  async createBusinessInquiry(inquiry: InsertBusinessInquiry): Promise<BusinessInquiry> {
    const [result] = await db.insert(businessInquiries).values(inquiry).returning();
    return result;
  }

  async getBusinessInquiries(): Promise<BusinessInquiry[]> {
    return await db.select().from(businessInquiries).orderBy(desc(businessInquiries.createdAt));
  }

  async getBusinessInquiry(id: string): Promise<BusinessInquiry | undefined> {
    const [result] = await db.select().from(businessInquiries).where(eq(businessInquiries.id, id));
    return result;
  }

  async updateBusinessInquiry(id: string, updates: { status?: string; adminNotes?: string }): Promise<BusinessInquiry | undefined> {
    const [result] = await db.update(businessInquiries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessInquiries.id, id))
      .returning();
    return result;
  }

  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [result] = await db.insert(adminUsers).values(user).returning();
    return result;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers);
  }

  async getDashboardStats(): Promise<{ riders: number; contractors: number; inquiries: number; pending: number; activeDrivers: number; activeContractors: number; fleetVehicles: number; businessClients: number }> {
    const [riderCount] = await db.select({ count: sql<number>`count(*)` }).from(riderApplications);
    const [contractorCount] = await db.select({ count: sql<number>`count(*)` }).from(contractorApplications);
    const [inquiryCount] = await db.select({ count: sql<number>`count(*)` }).from(businessInquiries);
    const [pendingRiders] = await db.select({ count: sql<number>`count(*)` }).from(riderApplications).where(eq(riderApplications.status, "pending"));
    const [pendingContractors] = await db.select({ count: sql<number>`count(*)` }).from(contractorApplications).where(eq(contractorApplications.status, "pending"));
    const [pendingInquiries] = await db.select({ count: sql<number>`count(*)` }).from(businessInquiries).where(eq(businessInquiries.status, "pending"));
    const [driverCount] = await db.select({ count: sql<number>`count(*)` }).from(drivers);
    const [activeContractorCount] = await db.select({ count: sql<number>`count(*)` }).from(activeContractors);
    const [vehicleCount] = await db.select({ count: sql<number>`count(*)` }).from(fleetVehicles);
    const [clientCount] = await db.select({ count: sql<number>`count(*)` }).from(businessClients);
    
    return {
      riders: Number(riderCount.count),
      contractors: Number(contractorCount.count),
      inquiries: Number(inquiryCount.count),
      pending: Number(pendingRiders.count) + Number(pendingContractors.count) + Number(pendingInquiries.count),
      activeDrivers: Number(driverCount.count),
      activeContractors: Number(activeContractorCount.count),
      fleetVehicles: Number(vehicleCount.count),
      businessClients: Number(clientCount.count)
    };
  }

  // ============ DRIVERS ============
  async getDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers).orderBy(desc(drivers.createdAt));
  }

  async getDriver(id: string): Promise<Driver | undefined> {
    const [result] = await db.select().from(drivers).where(eq(drivers.id, id));
    return result;
  }

  async createDriver(driver: InsertDriver): Promise<Driver> {
    const [result] = await db.insert(drivers).values(driver).returning();
    return result;
  }

  async updateDriver(id: string, updates: Partial<InsertDriver>): Promise<Driver | undefined> {
    const [result] = await db.update(drivers).set({ ...updates, updatedAt: new Date() }).where(eq(drivers.id, id)).returning();
    return result;
  }

  async deleteDriver(id: string): Promise<boolean> {
    const result = await db.delete(drivers).where(eq(drivers.id, id));
    return true;
  }

  // ============ ACTIVE CONTRACTORS ============
  async getActiveContractors(): Promise<ActiveContractor[]> {
    return await db.select().from(activeContractors).orderBy(desc(activeContractors.createdAt));
  }

  async getActiveContractor(id: string): Promise<ActiveContractor | undefined> {
    const [result] = await db.select().from(activeContractors).where(eq(activeContractors.id, id));
    return result;
  }

  async createActiveContractor(contractor: InsertActiveContractor): Promise<ActiveContractor> {
    const [result] = await db.insert(activeContractors).values(contractor).returning();
    return result;
  }

  async updateActiveContractor(id: string, updates: Partial<InsertActiveContractor>): Promise<ActiveContractor | undefined> {
    const [result] = await db.update(activeContractors).set({ ...updates, updatedAt: new Date() }).where(eq(activeContractors.id, id)).returning();
    return result;
  }

  async deleteActiveContractor(id: string): Promise<boolean> {
    const result = await db.delete(activeContractors).where(eq(activeContractors.id, id));
    return true;
  }

  // ============ FLEET VEHICLES ============
  async getFleetVehicles(): Promise<FleetVehicle[]> {
    return await db.select().from(fleetVehicles).orderBy(desc(fleetVehicles.createdAt));
  }

  async getFleetVehicle(id: string): Promise<FleetVehicle | undefined> {
    const [result] = await db.select().from(fleetVehicles).where(eq(fleetVehicles.id, id));
    return result;
  }

  async createFleetVehicle(vehicle: InsertFleetVehicle): Promise<FleetVehicle> {
    const [result] = await db.insert(fleetVehicles).values(vehicle).returning();
    return result;
  }

  async updateFleetVehicle(id: string, updates: Partial<InsertFleetVehicle>): Promise<FleetVehicle | undefined> {
    const [result] = await db.update(fleetVehicles).set({ ...updates, updatedAt: new Date() }).where(eq(fleetVehicles.id, id)).returning();
    return result;
  }

  async deleteFleetVehicle(id: string): Promise<boolean> {
    const result = await db.delete(fleetVehicles).where(eq(fleetVehicles.id, id));
    return true;
  }

  // ============ BUSINESS CLIENTS ============
  async getBusinessClients(): Promise<BusinessClient[]> {
    return await db.select().from(businessClients).orderBy(desc(businessClients.createdAt));
  }

  async getBusinessClient(id: string): Promise<BusinessClient | undefined> {
    const [result] = await db.select().from(businessClients).where(eq(businessClients.id, id));
    return result;
  }

  async createBusinessClient(client: InsertBusinessClient): Promise<BusinessClient> {
    const [result] = await db.insert(businessClients).values(client).returning();
    return result;
  }

  async updateBusinessClient(id: string, updates: Partial<InsertBusinessClient>): Promise<BusinessClient | undefined> {
    const [result] = await db.update(businessClients).set({ ...updates, updatedAt: new Date() }).where(eq(businessClients.id, id)).returning();
    return result;
  }

  async deleteBusinessClient(id: string): Promise<boolean> {
    const result = await db.delete(businessClients).where(eq(businessClients.id, id));
    return true;
  }

  // ============ DRIVER ASSIGNMENTS ============
  async getDriverAssignments(): Promise<DriverAssignment[]> {
    return await db.select().from(driverAssignments).orderBy(desc(driverAssignments.createdAt));
  }

  async getDriverAssignment(id: string): Promise<DriverAssignment | undefined> {
    const [result] = await db.select().from(driverAssignments).where(eq(driverAssignments.id, id));
    return result;
  }

  async createDriverAssignment(assignment: InsertDriverAssignment): Promise<DriverAssignment> {
    const [result] = await db.insert(driverAssignments).values(assignment).returning();
    return result;
  }

  async updateDriverAssignment(id: string, updates: Partial<InsertDriverAssignment>): Promise<DriverAssignment | undefined> {
    const [result] = await db.update(driverAssignments).set({ ...updates, updatedAt: new Date() }).where(eq(driverAssignments.id, id)).returning();
    return result;
  }

  async deleteDriverAssignment(id: string): Promise<boolean> {
    const result = await db.delete(driverAssignments).where(eq(driverAssignments.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();

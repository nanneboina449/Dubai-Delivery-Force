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
  users,
  riderApplications,
  contractorApplications,
  businessInquiries,
  adminUsers
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

  async getDashboardStats(): Promise<{ riders: number; contractors: number; inquiries: number; pending: number }> {
    const [riderCount] = await db.select({ count: sql<number>`count(*)` }).from(riderApplications);
    const [contractorCount] = await db.select({ count: sql<number>`count(*)` }).from(contractorApplications);
    const [inquiryCount] = await db.select({ count: sql<number>`count(*)` }).from(businessInquiries);
    const [pendingRiders] = await db.select({ count: sql<number>`count(*)` }).from(riderApplications).where(eq(riderApplications.status, "pending"));
    const [pendingContractors] = await db.select({ count: sql<number>`count(*)` }).from(contractorApplications).where(eq(contractorApplications.status, "pending"));
    const [pendingInquiries] = await db.select({ count: sql<number>`count(*)` }).from(businessInquiries).where(eq(businessInquiries.status, "pending"));
    
    return {
      riders: Number(riderCount.count),
      contractors: Number(contractorCount.count),
      inquiries: Number(inquiryCount.count),
      pending: Number(pendingRiders.count) + Number(pendingContractors.count) + Number(pendingInquiries.count)
    };
  }
}

export const storage = new DatabaseStorage();

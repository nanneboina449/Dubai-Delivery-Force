import { 
  type User, 
  type InsertUser,
  type RiderApplication,
  type InsertRiderApplication,
  type ContractorApplication,
  type InsertContractorApplication,
  type BusinessInquiry,
  type InsertBusinessInquiry,
  users,
  riderApplications,
  contractorApplications,
  businessInquiries
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createRiderApplication(application: InsertRiderApplication): Promise<RiderApplication>;
  getRiderApplications(): Promise<RiderApplication[]>;
  
  createContractorApplication(application: InsertContractorApplication): Promise<ContractorApplication>;
  getContractorApplications(): Promise<ContractorApplication[]>;
  
  createBusinessInquiry(inquiry: InsertBusinessInquiry): Promise<BusinessInquiry>;
  getBusinessInquiries(): Promise<BusinessInquiry[]>;
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
    return await db.select().from(riderApplications);
  }

  async createContractorApplication(application: InsertContractorApplication): Promise<ContractorApplication> {
    const [result] = await db.insert(contractorApplications).values(application).returning();
    return result;
  }

  async getContractorApplications(): Promise<ContractorApplication[]> {
    return await db.select().from(contractorApplications);
  }

  async createBusinessInquiry(inquiry: InsertBusinessInquiry): Promise<BusinessInquiry> {
    const [result] = await db.insert(businessInquiries).values(inquiry).returning();
    return result;
  }

  async getBusinessInquiries(): Promise<BusinessInquiry[]> {
    return await db.select().from(businessInquiries);
  }
}

export const storage = new DatabaseStorage();

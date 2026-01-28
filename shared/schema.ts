import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applicationStatuses = ["pending", "reviewing", "approved", "rejected", "onboarding", "completed"] as const;
export type ApplicationStatus = typeof applicationStatuses[number];

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Rider Applications
export const riderApplications = pgTable("rider_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  nationality: text("nationality").notNull(),
  currentLocation: text("current_location").notNull(),
  visaStatus: text("visa_status").notNull(),
  hasUaeDrivingLicense: text("has_uae_driving_license").notNull(),
  licenseType: text("license_type"),
  yearsOfExperience: integer("years_of_experience").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  ownsVehicle: text("owns_vehicle").notNull(),
  availableToStart: text("available_to_start").notNull(),
  preferredWorkArea: text("preferred_work_area").notNull(),
  englishProficiency: text("english_proficiency").notNull(),
  additionalNotes: text("additional_notes"),
  status: text("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRiderApplicationSchema = createInsertSchema(riderApplications).omit({
  id: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const updateRiderApplicationSchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  adminNotes: z.string().optional(),
});

export type InsertRiderApplication = z.infer<typeof insertRiderApplicationSchema>;
export type RiderApplication = typeof riderApplications.$inferSelect;

// Contractor Applications
export const contractorApplications = pgTable("contractor_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  tradeLicense: text("trade_license").notNull(),
  emirate: text("emirate").notNull(),
  fleetMotorcycles: integer("fleet_motorcycles").default(0),
  fleetCars: integer("fleet_cars").default(0),
  fleetVans: integer("fleet_vans").default(0),
  fleetTrucks: integer("fleet_trucks").default(0),
  totalDrivers: integer("total_drivers").notNull(),
  yearsInBusiness: integer("years_in_business").notNull(),
  currentClients: text("current_clients"),
  insuranceCoverage: text("insurance_coverage").notNull(),
  additionalServices: text("additional_services"),
  additionalNotes: text("additional_notes"),
  status: text("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContractorApplicationSchema = createInsertSchema(contractorApplications).omit({
  id: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const updateContractorApplicationSchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  adminNotes: z.string().optional(),
});

export type InsertContractorApplication = z.infer<typeof insertContractorApplicationSchema>;
export type ContractorApplication = typeof contractorApplications.$inferSelect;

// Business Inquiries
export const businessInquiries = pgTable("business_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  industry: text("industry").notNull(),
  companySize: text("company_size").notNull(),
  emirate: text("emirate").notNull(),
  deliveryVolume: text("delivery_volume").notNull(),
  vehicleTypesNeeded: text("vehicle_types_needed").notNull(),
  ridersNeeded: integer("riders_needed").notNull(),
  startDate: text("start_date").notNull(),
  contractDuration: text("contract_duration").notNull(),
  specialRequirements: text("special_requirements"),
  additionalNotes: text("additional_notes"),
  status: text("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessInquirySchema = createInsertSchema(businessInquiries).omit({
  id: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBusinessInquirySchema = z.object({
  status: z.enum(applicationStatuses).optional(),
  adminNotes: z.string().optional(),
});

export type InsertBusinessInquiry = z.infer<typeof insertBusinessInquirySchema>;
export type BusinessInquiry = typeof businessInquiries.$inferSelect;

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

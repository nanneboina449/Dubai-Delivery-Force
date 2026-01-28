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

// ============ FLEET MANAGEMENT ENTITIES ============

// Active Drivers (onboarded riders)
export const driverStatuses = ["active", "inactive", "suspended", "terminated"] as const;
export type DriverStatus = typeof driverStatuses[number];

export const drivers = pgTable("drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  nationality: text("nationality").notNull(),
  emirate: text("emirate").notNull(),
  visaStatus: text("visa_status").notNull(),
  licenseNumber: text("license_number"),
  licenseType: text("license_type"),
  licenseExpiry: text("license_expiry"),
  vehicleType: text("vehicle_type").notNull(),
  employeeId: text("employee_id"),
  joiningDate: text("joining_date"),
  contractorId: varchar("contractor_id"),
  status: text("status").default("active").notNull(),
  notes: text("notes"),
  // Salary & Compensation
  basicSalary: integer("basic_salary"),
  housingAllowance: integer("housing_allowance"),
  transportAllowance: integer("transport_allowance"),
  otherAllowance: integer("other_allowance"),
  paymentMethod: text("payment_method"), // bank_transfer, cash, wps
  // Visa & Immigration Details
  visaNumber: text("visa_number"),
  visaExpiry: text("visa_expiry"),
  visaFileNumber: text("visa_file_number"),
  laborCardNumber: text("labor_card_number"),
  laborCardExpiry: text("labor_card_expiry"),
  // Identity Documents
  passportNumber: text("passport_number"),
  passportExpiry: text("passport_expiry"),
  emiratesId: text("emirates_id"),
  emiratesIdExpiry: text("emirates_id_expiry"),
  // Address
  fullAddress: text("full_address"),
  city: text("city"),
  postalCode: text("postal_code"),
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  // Bank Details
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankIban: text("bank_iban"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

// Active Contractors
export const activeContractors = pgTable("active_contractors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id"),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  tradeLicense: text("trade_license").notNull(),
  tradeLicenseExpiry: text("trade_license_expiry"),
  emirate: text("emirate").notNull(),
  contractStartDate: text("contract_start_date"),
  contractEndDate: text("contract_end_date"),
  insuranceCoverage: text("insurance_coverage"),
  insuranceExpiry: text("insurance_expiry"),
  status: text("status").default("active").notNull(),
  notes: text("notes"),
  // Office Address
  officeAddress: text("office_address"),
  officeCity: text("office_city"),
  officePostalCode: text("office_postal_code"),
  // Additional Contact
  secondaryContactName: text("secondary_contact_name"),
  secondaryContactPhone: text("secondary_contact_phone"),
  secondaryContactEmail: text("secondary_contact_email"),
  // Bank Details for Payments
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankIban: text("bank_iban"),
  bankSwiftCode: text("bank_swift_code"),
  // Contract Terms
  commissionRate: integer("commission_rate"), // percentage
  paymentTerms: text("payment_terms"), // net_30, net_15, weekly
  fleetSize: integer("fleet_size"),
  driverCount: integer("driver_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertActiveContractorSchema = createInsertSchema(activeContractors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertActiveContractor = z.infer<typeof insertActiveContractorSchema>;
export type ActiveContractor = typeof activeContractors.$inferSelect;

// Fleet Vehicles
export const vehicleTypes = ["motorcycle", "car", "van", "truck", "bicycle"] as const;
export const vehicleOwnership = ["company", "contractor", "driver"] as const;
export const vehicleStatuses = ["available", "assigned", "maintenance", "retired"] as const;

export const fleetVehicles = pgTable("fleet_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleType: text("vehicle_type").notNull(),
  make: text("make"),
  model: text("model"),
  year: integer("year"),
  plateNumber: text("plate_number").notNull(),
  registrationExpiry: text("registration_expiry"),
  insuranceExpiry: text("insurance_expiry"),
  ownership: text("ownership").default("company").notNull(),
  contractorId: varchar("contractor_id"),
  driverId: varchar("driver_id"),
  assignedDriverId: varchar("assigned_driver_id"),
  status: text("status").default("available").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFleetVehicleSchema = createInsertSchema(fleetVehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFleetVehicle = z.infer<typeof insertFleetVehicleSchema>;
export type FleetVehicle = typeof fleetVehicles.$inferSelect;

// Business Clients (approved businesses)
export const businessClients = pgTable("business_clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inquiryId: varchar("inquiry_id"),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  industry: text("industry").notNull(),
  emirate: text("emirate").notNull(),
  address: text("address"),
  contractStartDate: text("contract_start_date"),
  contractEndDate: text("contract_end_date"),
  deliveryVolume: text("delivery_volume"),
  status: text("status").default("active").notNull(),
  notes: text("notes"),
  // Company Details
  tradeLicense: text("trade_license"),
  tradeLicenseExpiry: text("trade_license_expiry"),
  vatNumber: text("vat_number"),
  // Billing Details
  billingContactName: text("billing_contact_name"),
  billingContactEmail: text("billing_contact_email"),
  billingContactPhone: text("billing_contact_phone"),
  billingAddress: text("billing_address"),
  // Payment Terms
  paymentTerms: text("payment_terms"), // net_30, net_15, prepaid
  creditLimit: integer("credit_limit"),
  // Operations Contact
  operationsContactName: text("operations_contact_name"),
  operationsContactEmail: text("operations_contact_email"),
  operationsContactPhone: text("operations_contact_phone"),
  // Service Terms
  serviceType: text("service_type"), // dedicated, on_demand, hybrid
  driversRequired: integer("drivers_required"),
  operatingHours: text("operating_hours"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessClientSchema = createInsertSchema(businessClients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBusinessClient = z.infer<typeof insertBusinessClientSchema>;
export type BusinessClient = typeof businessClients.$inferSelect;

// Driver-Business Assignments
export const driverAssignments = pgTable("driver_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull(),
  businessClientId: varchar("business_client_id").notNull(),
  vehicleId: varchar("vehicle_id"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  shiftType: text("shift_type"),
  status: text("status").default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDriverAssignmentSchema = createInsertSchema(driverAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDriverAssignment = z.infer<typeof insertDriverAssignmentSchema>;
export type DriverAssignment = typeof driverAssignments.$inferSelect;

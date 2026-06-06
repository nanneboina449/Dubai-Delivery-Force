import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const mailTo = process.env.MAIL_TO || user;

function getTransport() {
  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured (missing SMTP_HOST, SMTP_USER or SMTP_PASS).');
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

interface ApplicationEmail {
  subject: string;
  body: string;
  replyToName: string;
  replyToEmail: string;
}

export async function sendApplicationEmail(mail: ApplicationEmail): Promise<void> {
  const transport = getTransport();
  await transport.sendMail({
    from: `"UrbanFleet Website" <${user}>`,
    to: mailTo,
    replyTo: mail.replyToEmail ? `"${mail.replyToName}" <${mail.replyToEmail}>` : undefined,
    subject: mail.subject,
    text: mail.body,
  });
}

export function formatRiderApplication(d: Record<string, unknown>): string {
  return `
RIDER APPLICATION DETAILS
========================
Full Name: ${d.fullName}
Email: ${d.email}
Phone: ${d.phone}
Nationality: ${d.nationality}
Current Location: ${d.currentLocation}
Visa Status: ${d.visaStatus}

DRIVING & EXPERIENCE
-------------------
UAE Driving License: ${d.hasUaeDrivingLicense}
License Type: ${d.licenseType || 'N/A'}
Years of Experience: ${d.yearsOfExperience}
Preferred Vehicle: ${d.vehicleType}
Owns Vehicle: ${d.ownsVehicle}
English Proficiency: ${d.englishProficiency}

AVAILABILITY
------------
Available to Start: ${d.availableToStart}
Preferred Work Area: ${d.preferredWorkArea}

Additional Notes: ${d.additionalNotes || 'None'}
  `.trim();
}

export function formatContractorApplication(d: Record<string, unknown>): string {
  return `
CONTRACTOR APPLICATION DETAILS
==============================
Company Name: ${d.companyName}
Contact Person: ${d.contactPerson}
Email: ${d.email}
Phone: ${d.phone}
Trade License: ${d.tradeLicense}
Emirate: ${d.emirate}
Years in Business: ${d.yearsInBusiness}
Total Drivers: ${d.totalDrivers}

FLEET DETAILS
-------------
Bicycles: ${d.fleetBicycles}
Motorcycles: ${d.fleetMotorcycles}
Cars: ${d.fleetCars}
Vans: ${d.fleetVans}
Trucks: ${d.fleetTrucks}

INSURANCE & OPERATIONS
----------------------
Insurance Coverage: ${d.insuranceCoverage}
Current Clients: ${d.currentClients || 'N/A'}
Additional Services: ${d.additionalServices || 'N/A'}

Additional Notes: ${d.additionalNotes || 'None'}
  `.trim();
}

export function formatBusinessInquiry(d: Record<string, unknown>): string {
  return `
BUSINESS INQUIRY DETAILS
========================
Company Name: ${d.companyName}
Contact Person: ${d.contactPerson}
Email: ${d.email}
Phone: ${d.phone}
Industry: ${d.industry}
Company Size: ${d.companySize}
Emirate: ${d.emirate}

DELIVERY REQUIREMENTS
--------------------
Daily Volume: ${d.deliveryVolume}
Vehicle Types Needed: ${d.vehicleTypesNeeded}
Riders Needed: ${d.ridersNeeded}
Start Date: ${d.startDate}
Contract Duration: ${d.contractDuration}

Special Requirements: ${d.specialRequirements || 'None'}
Additional Notes: ${d.additionalNotes || 'None'}
  `.trim();
}

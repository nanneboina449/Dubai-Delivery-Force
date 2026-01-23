import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_ee9x1tw';
const EMAILJS_TEMPLATE_ID = 'template_6wdb2sv';
const EMAILJS_PUBLIC_KEY = 'o0pB4SDymxzdZV06g';

emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  form_type: string;
  form_data: string;
  from_name: string;
  from_email: string;
  phone?: string;
}

export async function sendFormEmail(data: EmailData): Promise<boolean> {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        form_type: data.form_type,
        form_data: data.form_data,
        from_name: data.from_name,
        from_email: data.from_email,
        phone: data.phone || 'Not provided',
        to_email: 'info@urbanfleetdelivery.ae',
      }
    );
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export function formatRiderApplication(data: Record<string, unknown>): string {
  return `
RIDER APPLICATION DETAILS
========================
Full Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Nationality: ${data.nationality}
Current Location: ${data.currentLocation}
Visa Status: ${data.visaStatus}

DRIVING & EXPERIENCE
-------------------
UAE Driving License: ${data.hasUaeDrivingLicense}
License Type: ${data.licenseType || 'N/A'}
Years of Experience: ${data.yearsOfExperience}
Preferred Vehicle: ${data.vehicleType}
Owns Vehicle: ${data.ownsVehicle}
English Proficiency: ${data.englishProficiency}

AVAILABILITY
------------
Available to Start: ${data.availableToStart}
Preferred Work Area: ${data.preferredWorkArea}

Additional Notes: ${data.additionalNotes || 'None'}
  `.trim();
}

export function formatContractorApplication(data: Record<string, unknown>): string {
  return `
CONTRACTOR APPLICATION DETAILS
==============================
Company Name: ${data.companyName}
Contact Person: ${data.contactPerson}
Email: ${data.email}
Phone: ${data.phone}
Trade License: ${data.tradeLicense}
Emirate: ${data.emirate}
Years in Business: ${data.yearsInBusiness}
Total Drivers: ${data.totalDrivers}

FLEET DETAILS
-------------
Bicycles: ${data.fleetBicycles}
Motorcycles: ${data.fleetMotorcycles}
Cars: ${data.fleetCars}
Vans: ${data.fleetVans}
Trucks: ${data.fleetTrucks}

INSURANCE & OPERATIONS
----------------------
Insurance Coverage: ${data.insuranceCoverage}
Current Clients: ${data.currentClients || 'N/A'}
Additional Services: ${data.additionalServices || 'N/A'}

Additional Notes: ${data.additionalNotes || 'None'}
  `.trim();
}

export function formatBusinessInquiry(data: Record<string, unknown>): string {
  return `
BUSINESS INQUIRY DETAILS
========================
Company Name: ${data.companyName}
Contact Person: ${data.contactPerson}
Email: ${data.email}
Phone: ${data.phone}
Industry: ${data.industry}
Company Size: ${data.companySize}
Emirate: ${data.emirate}

DELIVERY REQUIREMENTS
--------------------
Daily Volume: ${data.deliveryVolume}
Vehicle Types Needed: ${data.vehicleTypesNeeded}
Riders Needed: ${data.ridersNeeded}
Start Date: ${data.startDate}
Contract Duration: ${data.contractDuration}

Special Requirements: ${data.specialRequirements || 'None'}
Additional Notes: ${data.additionalNotes || 'None'}
  `.trim();
}

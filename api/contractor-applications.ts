import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function sendNotification(subject: string, body: string, replyToName: string, replyToEmail: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error('SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS).');
  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  await transport.sendMail({
    from: `"UrbanFleet Website" <${user}>`,
    to: process.env.MAIL_TO || user,
    replyTo: replyToEmail ? `"${replyToName}" <${replyToEmail}>` : undefined,
    subject,
    text: body,
  });
}

function formatContractorApplication(d: Record<string, unknown>): string {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      tradeLicense,
      emirate,
      fleetMotorcycles,
      fleetCars,
      fleetVans,
      fleetTrucks,
      fleetBicycles,
      totalDrivers,
      yearsInBusiness,
      currentClients,
      insuranceCoverage,
      additionalServices,
      additionalNotes
    } = req.body;

    const { data, error } = await supabase
      .from('contractor_applications')
      .insert({
        company_name: companyName,
        contact_person: contactPerson,
        email,
        phone,
        trade_license: tradeLicense,
        emirate,
        fleet_motorcycles: fleetMotorcycles || 0,
        fleet_cars: fleetCars || 0,
        fleet_vans: fleetVans || 0,
        fleet_trucks: fleetTrucks || 0,
        fleet_bicycles: fleetBicycles || 0,
        total_drivers: totalDrivers,
        years_in_business: yearsInBusiness,
        current_clients: currentClients,
        insurance_coverage: insuranceCoverage,
        additional_services: additionalServices,
        additional_notes: additionalNotes
      })
      .select()
      .single();

    if (error) throw error;

    try {
      await sendNotification(
        `New Contractor Partnership Application — ${companyName}`,
        formatContractorApplication(req.body),
        contactPerson,
        email,
      );
    } catch (mailError) {
      console.error('Contractor application email failed (saved to DB):', mailError);
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Contractor application error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ success: false, error: 'Invalid application data', details: message });
  }
}

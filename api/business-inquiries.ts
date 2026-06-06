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

function formatBusinessInquiry(d: Record<string, unknown>): string {
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
      industry,
      companySize,
      emirate,
      deliveryVolume,
      vehicleTypesNeeded,
      ridersNeeded,
      startDate,
      contractDuration,
      specialRequirements,
      additionalNotes
    } = req.body;

    const { data, error } = await supabase
      .from('business_inquiries')
      .insert({
        company_name: companyName,
        contact_person: contactPerson,
        email,
        phone,
        industry,
        company_size: companySize,
        emirate,
        delivery_volume: deliveryVolume,
        vehicle_types_needed: vehicleTypesNeeded,
        riders_needed: ridersNeeded,
        start_date: startDate,
        contract_duration: contractDuration,
        special_requirements: specialRequirements,
        additional_notes: additionalNotes
      })
      .select()
      .single();

    if (error) throw error;

    try {
      await sendNotification(
        `New Business Inquiry — ${companyName}`,
        formatBusinessInquiry(req.body),
        contactPerson,
        email,
      );
    } catch (mailError) {
      console.error('Business inquiry email failed (saved to DB):', mailError);
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Business inquiry error:', error);
    return res.status(400).json({ success: false, error: 'Invalid inquiry data' });
  }
}

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

function formatRiderApplication(d: Record<string, unknown>): string {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const {
    fullName,
    email,
    phone,
    nationality,
    currentLocation,
    visaStatus,
    hasUaeDrivingLicense,
    licenseType,
    yearsOfExperience,
    vehicleType,
    ownsVehicle,
    availableToStart,
    preferredWorkArea,
    englishProficiency,
    additionalNotes
  } = body;

  // Email is the primary notification — send it independently of the database.
  let emailSent = false;
  try {
    await sendNotification(
      `New Rider Application — ${fullName}`,
      formatRiderApplication(body),
      fullName,
      email,
    );
    emailSent = true;
  } catch (mailError) {
    console.error('Rider application email failed:', mailError);
  }

  // Best-effort save to the database (e.g. paused Supabase must not lose the lead).
  let saved = false;
  let data = null;
  try {
    const result = await supabase
      .from('rider_applications')
      .insert({
        full_name: fullName,
        email,
        phone,
        nationality,
        current_location: currentLocation,
        visa_status: visaStatus,
        has_uae_driving_license: hasUaeDrivingLicense,
        license_type: licenseType,
        years_of_experience: yearsOfExperience,
        vehicle_type: vehicleType,
        owns_vehicle: ownsVehicle,
        available_to_start: availableToStart,
        preferred_work_area: preferredWorkArea,
        english_proficiency: englishProficiency,
        additional_notes: additionalNotes
      })
      .select()
      .single();
    if (result.error) throw result.error;
    data = result.data;
    saved = true;
  } catch (dbError) {
    console.error('Rider application DB save failed:', dbError);
  }

  if (!emailSent && !saved) {
    return res.status(502).json({ success: false, error: 'Submission could not be processed. Please try again.' });
  }

  return res.status(201).json({ success: true, emailSent, saved, data });
}

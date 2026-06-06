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

  try {
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
    } = req.body;

    const { data, error } = await supabase
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

    if (error) throw error;

    try {
      await sendNotification(
        `New Rider Application — ${fullName}`,
        formatRiderApplication(req.body),
        fullName,
        email,
      );
    } catch (mailError) {
      console.error('Rider application email failed (saved to DB):', mailError);
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Rider application error:', error);
    return res.status(400).json({ success: false, error: 'Invalid application data' });
  }
}

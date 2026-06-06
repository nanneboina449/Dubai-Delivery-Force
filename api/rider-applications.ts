import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function sendEmail(opts: { to: string; subject: string; text: string; html: string; replyTo?: string }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error('SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS).');
  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  await transport.sendMail({
    from: `"UrbanFleet Delivery" <${user}>`,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}

function esc(v: unknown): string {
  return String(v ?? 'N/A')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function shell(heading: string, intro: string, content: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#eef1f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e7ef;">
<tr><td style="background:#0c122a;padding:24px 32px;">
<span style="font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:.5px;">Urban<span style="color:#f56a07;">Fleet</span></span>
<div style="color:#9aa6bd;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Delivery Services</div>
</td></tr>
<tr><td style="padding:32px;color:#0c122a;">
<h1 style="margin:0 0 8px;font-size:20px;color:#0c122a;">${heading}</h1>
<p style="margin:0;font-size:14px;line-height:1.6;color:#51607a;">${intro}</p>
${content}
</td></tr>
<tr><td style="background:#f7f9fc;padding:20px 32px;border-top:1px solid #e2e7ef;">
<p style="margin:0;font-size:12px;color:#8893a6;line-height:1.6;">UrbanFleet Delivery Services &middot; Coastal Building, Office 301, Al Qusais Metro Station, Exit 2, Dubai, UAE<br/>info@urbanfleetdelivery.ae</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function sectionTitle(t: string): string {
  return `<h2 style="margin:24px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#f56a07;">${t}</h2>`;
}

function detailRows(rows: Array<[string, unknown]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#0c122a;border-collapse:collapse;">${rows
    .map(([k, v]) => `<tr><td style="padding:8px 0;color:#51607a;width:45%;vertical-align:top;border-bottom:1px solid #eef1f6;">${esc(k)}</td><td style="padding:8px 0;font-weight:600;vertical-align:top;border-bottom:1px solid #eef1f6;">${esc(v)}</td></tr>`)
    .join('')}</table>`;
}

function riderApplicationHtml(d: Record<string, unknown>): string {
  return shell(
    'New Rider Application',
    `A new rider application was submitted by <strong>${esc(d.fullName)}</strong>.`,
    sectionTitle('Applicant') + detailRows([
      ['Full Name', d.fullName],
      ['Email', d.email],
      ['Phone', d.phone],
      ['Nationality', d.nationality],
      ['Current Location', d.currentLocation],
      ['Visa Status', d.visaStatus],
    ]) +
    sectionTitle('Driving & Experience') + detailRows([
      ['UAE Driving License', d.hasUaeDrivingLicense],
      ['License Type', d.licenseType || 'N/A'],
      ['Years of Experience', d.yearsOfExperience],
      ['Preferred Vehicle', d.vehicleType],
      ['Owns Vehicle', d.ownsVehicle],
      ['English Proficiency', d.englishProficiency],
    ]) +
    sectionTitle('Availability') + detailRows([
      ['Available to Start', d.availableToStart],
      ['Preferred Work Area', d.preferredWorkArea],
      ['Additional Notes', d.additionalNotes || 'None'],
    ]),
  );
}

function customerAckHtml(name: string, message: string): string {
  return shell(
    `Thank you, ${esc(name)}!`,
    message,
    `<p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#51607a;">If you have any questions in the meantime, simply reply to this email or reach us at <a href="mailto:info@urbanfleetdelivery.ae" style="color:#f56a07;text-decoration:none;">info@urbanfleetdelivery.ae</a>.</p><p style="margin:24px 0 0;font-size:14px;color:#0c122a;">Warm regards,<br/><strong>The UrbanFleet Team</strong></p>`,
  );
}

function customerAckText(name: string, message: string): string {
  return `Hi ${name},\n\n${message.replace(/<[^>]+>/g, '')}\n\nIf you have any questions, reply to this email or contact us at info@urbanfleetdelivery.ae.\n\nWarm regards,\nThe UrbanFleet Team`;
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
    await sendEmail({
      to: process.env.MAIL_TO || process.env.SMTP_USER || '',
      subject: `New Rider Application — ${fullName}`,
      text: formatRiderApplication(body),
      html: riderApplicationHtml(body),
      replyTo: email ? `"${fullName}" <${email}>` : undefined,
    });
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

  // Best-effort customer acknowledgement — never blocks the response.
  if (email) {
    const ackMessage = 'We have received your application to join UrbanFleet as a rider. Our team will review it and get back to you within 3–5 business days.';
    try {
      await sendEmail({
        to: email,
        subject: 'We received your application — UrbanFleet Delivery',
        text: customerAckText(fullName, ackMessage),
        html: customerAckHtml(fullName, ackMessage),
      });
    } catch (ackError) {
      console.error('Rider application customer ack failed:', ackError);
    }
  }

  return res.status(201).json({ success: true, emailSent, saved, data });
}

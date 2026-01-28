import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

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

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Business inquiry error:', error);
    return res.status(400).json({ success: false, error: 'Invalid inquiry data' });
  }
}

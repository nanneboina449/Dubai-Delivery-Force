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

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Rider application error:', error);
    return res.status(400).json({ success: false, error: 'Invalid application data' });
  }
}

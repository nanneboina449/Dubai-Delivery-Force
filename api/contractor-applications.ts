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

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Contractor application error:', error);
    return res.status(400).json({ success: false, error: 'Invalid application data' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { count: riderCount } = await supabase
      .from('rider_applications')
      .select('*', { count: 'exact', head: true });

    const { count: contractorCount } = await supabase
      .from('contractor_applications')
      .select('*', { count: 'exact', head: true });

    const { count: inquiryCount } = await supabase
      .from('business_inquiries')
      .select('*', { count: 'exact', head: true });

    const { count: pendingRiders } = await supabase
      .from('rider_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: pendingContractors } = await supabase
      .from('contractor_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: pendingInquiries } = await supabase
      .from('business_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    return res.status(200).json({
      riders: riderCount || 0,
      contractors: contractorCount || 0,
      inquiries: inquiryCount || 0,
      pending: (pendingRiders || 0) + (pendingContractors || 0) + (pendingInquiries || 0)
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to get stats' });
  }
}

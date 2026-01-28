import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const { data, error } = await supabase
          .from('rider_applications')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Application not found' });
        return res.status(200).json(data);
      } else {
        const { data, error } = await supabase
          .from('rider_applications')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }
    } catch (error) {
      console.error('Get riders error:', error);
      return res.status(500).json({ error: 'Failed to get applications' });
    }
  }

  if (req.method === 'PATCH' && id) {
    try {
      const { status, adminNotes } = req.body;
      const { data, error } = await supabase
        .from('rider_applications')
        .update({ status, admin_notes: adminNotes, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Application not found' });
      return res.status(200).json(data);
    } catch (error) {
      console.error('Update rider error:', error);
      return res.status(400).json({ error: 'Failed to update application' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

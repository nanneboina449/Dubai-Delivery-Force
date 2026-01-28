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
      const { data, error } = await supabase
        .from('business_inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Inquiry not found' });

      return res.status(200).json(data);
    } catch (error) {
      console.error('Get inquiry error:', error);
      return res.status(500).json({ error: 'Failed to get inquiry' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, adminNotes } = req.body;
      
      const { data, error } = await supabase
        .from('business_inquiries')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Inquiry not found' });

      return res.status(200).json(data);
    } catch (error) {
      console.error('Update inquiry error:', error);
      return res.status(400).json({ error: 'Failed to update inquiry' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

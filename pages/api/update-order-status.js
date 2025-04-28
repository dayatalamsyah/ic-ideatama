import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function sendEmail({ to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gagal kirim email: ${errorData.message || 'Unknown error'}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, newStatus } = req.body;

  try {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (updateError) {
      console.error('DB Error:', updateError);
      return res.status(500).json({ error: 'Gagal update status.' });
    }

    const { data: orderData } = await supabase
      .from('orders')
      .select('email, name, service')
      .eq('id', id)
      .single();

    if (!orderData) {
      return res.status(404).json({ error: 'Order tidak ditemukan.' });
    }

    await sendEmail({
      to: orderData.email,
      subject: 'Update Status Order Anda di IC-IDEATAMA',
      html: `
        <h2>Halo ${orderData.name},</h2>
        <p>Status order Anda untuk layanan <strong>${orderData.service}</strong> telah berubah menjadi: <strong>${newStatus}</strong>.</p>
        <p>Terima kasih atas kepercayaan Anda!</p>
      `
    });

    return res.status(200).json({ message: 'Status berhasil diupdate dan email dikirim.' });

  } catch (error) {
    console.error('Error update status:', error);
    return res.status(500).json({ error: error.message || 'Gagal update status.' });
  }
}

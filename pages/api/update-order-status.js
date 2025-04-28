import { createClient } from '@supabase/supabase-js';

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY;

async function sendEmail(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Email API error');
    }

    return response;
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, newStatus } = req.body;

  if (!id || !newStatus) {
    return res.status(400).json({ error: 'ID dan Status harus diisi.' });
  }

  try {
    // Update status
    const { data, error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !data) {
      console.error('DB Error:', updateError);
      return res.status(500).json({ error: 'Gagal update status.' });
    }

    const { email, name, service } = data;

    // Kirim Email ke Customer
    await sendEmail({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: [email],
      subject: 'Update Status Order Anda',
      html: `
        <h2>Halo ${name},</h2>
        <p>Status order Anda untuk layanan <strong>${service}</strong> saat ini adalah:</p>
        <h3>${newStatus}</h3>
        <p>Terima kasih sudah menggunakan layanan kami!</p>
      `
    });

    return res.status(200).json({ message: 'Status berhasil diupdate dan email dikirim.' });

  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({ error: 'Gagal memproses update status.' });
  }
}

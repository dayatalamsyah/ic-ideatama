import { createClient } from '@supabase/supabase-js';

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { id, newStatus } = req.body;

  if (!id || !newStatus) {
    return res.status(400).json({ error: 'ID dan status baru wajib diisi.' });
  }

  try {
    // Update Status Order di Supabase
    const { data, error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !data) {
      console.error('Gagal update status:', updateError);
      return res.status(500).json({ error: 'Gagal update status order.' });
    }

    // Setelah Update, Kirim Email Notifikasi ke Customer
    const customerEmail = data.email;
    const customerName = data.name;
    const layanan = data.service;

    const message = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Halo ${customerName},</h2>
        <p>Status order layanan <strong>${layanan}</strong> Anda saat ini adalah:</p>
        <h3 style="color: #f97316;">${newStatus}</h3>
        <p>Terima kasih telah menggunakan layanan PT. IC-IDEATAMA.</p>
        <br/>
        <p>Salam hangat,</p>
        <p><strong>PT. IC-IDEATAMA</strong></p>
      </div>
    `;

    // Send Email pakai Fetch
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'IC-IDEATAMA <onboarding@resend.dev>',
        to: [customerEmail],
        subject: 'Update Status Order Anda',
        html: message
      })
    });

    return res.status(200).json({ message: 'Status berhasil diupdate dan email sudah dikirim.' });

  } catch (error) {
    console.error('Error update order status:', error);
    return res.status(500).json({ error: 'Gagal update order status.' });
  }
}

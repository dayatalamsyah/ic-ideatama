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

  const { name, whatsapp, email, address, service, message } = req.body;

  if (!name || !whatsapp || !email || !address || !service) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }

  try {
    // Simpan ke Database
    const { error: dbError } = await supabase
      .from('orders')
      .insert([{ name, whatsapp, email, address, service, message, status: "Baru" }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Gagal menyimpan order.' });
    }

    // Send Email ke Admin
    await sendEmail({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: ['hello@ic-ideatama.com'],
      subject: 'Order Baru Masuk dari Website',
      html: `
        <h2>Order Baru 🚀</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Alamat:</strong> ${address}</p>
        <p><strong>Layanan:</strong> ${service}</p>
        <p><strong>Pesan:</strong> ${message || '-'}</p>
      `
    });

    // Send Auto Reply ke Customer
    await sendEmail({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: [email],
      subject: 'Terima Kasih Telah Menghubungi IC-IDEATAMA',
      html: `
        <h2>Halo ${name},</h2>
        <p>Terima kasih telah menghubungi PT. IC-IDEATAMA.</p>
        <p>Kami akan segera menghubungi Anda untuk layanan:</p>
        <p><strong>${service}</strong></p>
      `
    });

    return res.status(200).json({ message: 'Order berhasil diproses.' });

  } catch (error) {
    console.error('Submit Order Error:', error);
    return res.status(500).json({ error: 'Gagal memproses order.' });
  }
}

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

  const { name, whatsapp, email, address, service, message } = req.body;

  if (!name || !whatsapp || !email || !address || !service) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }

  try {
    // Simpan ke Supabase
    const { error: dbError } = await supabase
      .from('orders')
      .insert([{
        name,
        whatsapp,
        email,
        address,
        service,
        message,
        status: 'Baru'
      }]);

    if (dbError) {
      console.error('Gagal menyimpan ke database:', dbError);
      return res.status(500).json({ error: 'Gagal menyimpan order.' });
    }

    // Prepare payload email
    const adminPayload = {
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: ['hello@ic-ideatama.com'],
      subject: 'Order Baru Masuk dari Website',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Order Baru 🚀</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Alamat:</strong> ${address}</p>
          <p><strong>Layanan:</strong> ${service}</p>
          <p><strong>Pesan:</strong> ${message || '-'}</p>
          <br/>
          <p>Segera follow up customer ini ya!</p>
        </div>
      `
    };

    const customerPayload = {
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: [email],
      subject: 'Terima Kasih Telah Menghubungi IC-IDEATAMA',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Halo ${name},</h2>
          <p>Terima kasih telah menghubungi <strong>PT. IC-IDEATAMA</strong>.</p>
          <p>Kami akan segera menghubungi Anda untuk layanan:</p>
          <ul>
            <li><strong>Layanan:</strong> ${service}</li>
            <li><strong>Alamat:</strong> ${address}</li>
            <li><strong>Pesan Tambahan:</strong> ${message || '-'}</li>
          </ul>
          <br/>
          <p>Salam hangat,</p>
          <p><strong>PT. IC-IDEATAMA</strong></p>
        </div>
      `
    };

    // Send email to Admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminPayload)
    });

    // Send auto-reply email to Customer
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerPayload)
    });

    return res.status(200).json({ message: 'Order berhasil diproses dan email sudah dikirim.' });

  } catch (error) {
    console.error('Error proses order:', error);
    return res.status(500).json({ error: 'Gagal memproses order.' });
  }
}

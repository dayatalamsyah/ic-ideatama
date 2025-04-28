import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, whatsapp, email, address, service, message } = req.body;

  try {
    // Simpan ke database
    const { error: dbError } = await supabase
      .from('orders')
      .insert([{ name, whatsapp, email, address, service, message, status: "Baru" }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Gagal menyimpan data.' });
    }

    // Kirim email ke admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IC-IDEATAMA <onboarding@resend.dev>',
        to: ['hello@ic-ideatama.com'],
        subject: 'Order Baru Masuk dari Website',
        html: `
          <div style="font-family: sans-serif;">
            <h2>Order Baru 🚀</h2>
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>WhatsApp:</strong> ${whatsapp}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Alamat:</strong> ${address}</p>
            <p><strong>Layanan:</strong> ${service}</p>
            <p><strong>Pesan:</strong> ${message || '-'}</p>
          </div>
        `
      })
    });

    // Auto-reply ke customer
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IC-IDEATAMA <onboarding@resend.dev>',
        to: [email],
        subject: 'Terima Kasih Telah Menghubungi IC-IDEATAMA',
        html: `
          <div style="font-family: sans-serif;">
            <h2>Halo ${name},</h2>
            <p>Terima kasih telah menghubungi PT. IC-IDEATAMA.</p>
            <p>Kami akan segera menghubungi Anda untuk layanan: <strong>${service}</strong>.</p>
            <p>Salam hangat,</p>
            <p><strong>PT. IC-IDEATAMA</strong></p>
          </div>
        `
      })
    });

    return res.status(200).json({ message: 'Order berhasil diproses.' });

  } catch (error) {
    console.error('Error submit order:', error);
    return res.status(500).json({ error: 'Gagal memproses order.' });
  }
}

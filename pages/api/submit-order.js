import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function sendEmail({ subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: ['dayatalamsyah@gmail.com'], // sementara ke emailmu
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

  const { name, whatsapp, email, address, service, message } = req.body;

  try {
    const { error: dbError } = await supabase
      .from('orders')
      .insert([{ name, whatsapp, email, address, service, message, status: "Baru" }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Gagal menyimpan data.' });
    }

    // Kirim email notifikasi admin
    await sendEmail({
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

    // Kirim auto-reply ke customer (sementara ke kamu juga)
    await sendEmail({
      subject: 'Terima Kasih Telah Menghubungi IC-IDEATAMA',
      html: `
        <h2>Halo ${name},</h2>
        <p>Terima kasih telah menghubungi PT. IC-IDEATAMA.</p>
        <p>Data Anda sudah kami terima dan akan segera diproses.</p>
      `
    });

    return res.status(200).json({ message: 'Order berhasil diproses dan email dikirim.' });

  } catch (error) {
    console.error('Error submit order:', error);
    return res.status(500).json({ error: error.message || 'Gagal memproses order.' });
  }
}

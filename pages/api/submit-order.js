import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, whatsapp, email, address, service, message } = req.body;

  try {
    // Simpan ke database
    const { error: dbError } = await supabase
      .from('orders')
      .insert([{ name, whatsapp, email, address, service, message }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Gagal menyimpan data' });
    }

    // Kirim email notifikasi ke Admin
    const emailResult = await resend.emails.send({
      from: 'IC-IDEATAMA <onboarding@resend.dev>', // Kirim pakai resend.dev dulu
      to: 'hello@ic-ideatama.com', // Ganti ke email admin Bro Dayat
      subject: 'Order Baru Masuk dari Website',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Order Baru Masuk 🚀</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Alamat:</strong> ${address}</p>
          <p><strong>Layanan:</strong> ${service}</p>
          <p><strong>Pesan:</strong> ${message || '-'}</p>
          <br/>
          <p>Segera hubungi customer ini untuk follow up! 👍</p>
        </div>
      `,
    });

    console.log('Email sent result:', emailResult);

    return res.status(200).json({ message: 'Order berhasil disimpan dan email dikirim.' });

  } catch (error) {
    console.error('Submit Order Error:', error);
    return res.status(500).json({ error: 'Gagal memproses order' });
  }
}

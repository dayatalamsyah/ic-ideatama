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
      .insert([{ name, whatsapp, email, address, service, message, status: "Baru" }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Gagal menyimpan data' });
    }

    // Kirim Email ke Admin
    await resend.emails.send({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: 'hello@ic-ideatama.com', // Ganti ke email Admin Bro Dayat
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

    // Kirim Auto Reply ke Customer
    await resend.emails.send({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: email, // Ke email Customer
      subject: 'Terima Kasih Telah Menghubungi IC-IDEATAMA',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Halo ${name},</h2>
          <p>Terima kasih telah menghubungi <strong>PT. IC-IDEATAMA</strong>.</p>
          <p>Tim kami akan segera menghubungi Anda untuk menindaklanjuti permintaan layanan berikut:</p>
          <ul>
            <li><strong>Layanan:</strong> ${service}</li>
            <li><strong>Alamat:</strong> ${address}</li>
            <li><strong>Pesan Tambahan:</strong> ${message || '-'}</li>
          </ul>
          <p>Jika ada pertanyaan mendesak, silakan hubungi kami melalui WhatsApp: <strong>${whatsapp}</strong></p>
          <br/>
          <p>Salam hangat,</p>
          <p><strong>PT. IC-IDEATAMA</strong></p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Order berhasil diproses dan email dikirim.' });

  } catch (error) {
    console.error('Submit Order Error:', error);
    return res.status(500).json({ error: 'Gagal memproses order' });
  }
}

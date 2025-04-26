import { Resend } from "resend";
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, whatsapp, email, address, service, message } = req.body;

  try {
    // 1. Kirim Email Order
    await resend.sendEmail({
      from: "PT IC-IDEATAMA <onboarding@resend.dev>", // Ganti nanti ke noreply@ kalau domain verified
      to: ["dayatalamsyah@gmail.com"],
      subject: `Order Baru dari ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Order Baru Masuk 🚀</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Alamat:</strong> ${address}</p>
          <p><strong>Layanan:</strong> ${service}</p>
          <p><strong>Pesan Tambahan:</strong> ${message}</p>
        </div>
      `
    });

    // 2. Save ke Database Supabase
    const { data, error } = await supabase.from('orders').insert([
      { name, whatsapp, email, address, service, message }
    ]);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return res.status(200).json({ success: true, message: "Order berhasil dikirim ke email dan database!" });
  } catch (error) {
    console.error("Error Submit Order:", error);
    return res.status(500).json({ error: "Gagal memproses order.", details: error.message });
  }
}

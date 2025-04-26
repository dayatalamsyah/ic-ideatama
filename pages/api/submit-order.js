import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, whatsapp, email, address, service, message } = req.body;

  try {
    const data = await resend.sendEmail({
      from: "PT IC-IDEATAMA <onboarding@resend.dev>",
      to: ["dayatalamsyah@gmail.com"],
      subject: `Order Baru dari ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
    <div style="background-color:#F97316; padding:20px; text-align:center;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Windows_Settings_app_icon.png" alt="Logo IC-IDEATAMA" style="max-width:150px; margin-bottom:10px;" />
      <h1 style="color:white; font-size:24px;">PT. IC-IDEATAMA</h1>
      <p style="color:white; margin-top:5px;">Order Baru Masuk 🚀</p>
    </div>

    <div style="padding:20px; background-color:#ffffff;">
      <h2 style="color:#333; font-size:20px; margin-bottom:15px;">Detail Order</h2>
      <p><strong>Nama:</strong> ${name}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Alamat:</strong> ${address}</p>
      <p><strong>Layanan:</strong> ${service}</p>
      <p><strong>Pesan Tambahan:</strong> ${message}</p>
    </div>

    <div style="background-color:#F3F4F6; padding:10px; text-align:center; font-size:12px; color:#888;">
      © 2025 PT. IC-IDEATAMA. All rights reserved.
    </div>
  </div>
      `
    });

    return res.status(200).json({ success: true, message: "Order berhasil dikirim ke email!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal mengirim email.", details: error.message });
  }
}

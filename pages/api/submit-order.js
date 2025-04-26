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

    return res.status(200).json({ success: true, message: "Order berhasil dikirim ke email!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal mengirim email.", details: error.message });
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, whatsapp, email, address, service, message } = req.body;
    console.log('Order Baru:', { name, whatsapp, email, address, service, message });

    // Simulasi berhasil disubmit (next bisa dikembangkan save ke database)
    return res.status(200).json({ success: true, message: "Order berhasil diterima!" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

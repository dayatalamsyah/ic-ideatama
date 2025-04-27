import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Init Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Init Resend
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { id, newStatus } = req.body;

  if (!id || !newStatus) {
    return res.status(400).json({ error: 'ID order dan status baru harus diisi' });
  }

  // Update status di Supabase
  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error update order:', updateError);
    return res.status(500).json({ error: 'Gagal mengupdate status order' });
  }

  try {
    // Kirim Email Notifikasi ke Customer
    await resend.emails.send({
      from: 'IC-IDEATAMA <onboarding@resend.dev>',
      to: updatedOrder.email,
      subject: 'Status Order Anda Telah Diperbarui',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Halo ${updatedOrder.name},</h2>
          <p>Order Anda kini berstatus: <strong>${newStatus}</strong>.</p>
          <p>Terima kasih telah mempercayakan layanan kami.</p>
          <br/>
          <p>Salam hangat,</p>
          <p><strong>PT. IC-IDEATAMA</strong></p>
        </div>
      `
    });

    return res.status(200).json({ message: 'Status order berhasil diupdate dan email dikirim!' });
  } catch (emailError) {
    console.error('Gagal mengirim email:', emailError);
    return res.status(500).json({ error: 'Status order berhasil, tapi gagal kirim email' });
  }
}

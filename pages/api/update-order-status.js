import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, newStatus } = req.body;

  if (!id || !newStatus) {
    return res.status(400).json({ error: 'ID dan Status baru wajib diisi.' });
  }

  try {
    const { error: dbError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Gagal update status order.' });
    }

    // Fetch order untuk ambil email customer
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('email, name, service')
      .eq('id', id)
      .single();

    if (fetchError || !orderData) {
      return res.status(404).json({ error: 'Order tidak ditemukan.' });
    }

    // Kirim email update status ke customer
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IC-IDEATAMA <onboarding@resend.dev>',
        to: [orderData.email],
        subject: 'Status Order Anda di IC-IDEATAMA',
        html: `
          <div style="font-family: sans-serif;">
            <h2>Halo ${orderData.name},</h2>
            <p>Status order Anda untuk layanan <strong>${orderData.service}</strong> telah berubah menjadi: <strong>${newStatus}</strong>.</p>
            <p>Terima kasih telah mempercayakan kebutuhan AC Anda kepada kami.</p>
            <p>PT. IC-IDEATAMA</p>
          </div>
        `
      })
    });

    return res.status(200).json({ message: 'Status berhasil diupdate dan email terkirim.' });

  } catch (error) {
    console.error('Error update status:', error);
    return res.status(500).json({ error: 'Gagal memproses update status.' });
  }
}

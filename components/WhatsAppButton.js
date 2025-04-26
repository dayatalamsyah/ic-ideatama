export default function WhatsAppButton({ text = 'Konsultasi via WhatsApp' }) {
  return (
    <a
      href="https://wa.me/6281211999417"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-white text-orange-600 px-6 py-3 font-semibold rounded-full shadow hover:bg-gray-100"
    >
      {text}
    </a>
  );
}

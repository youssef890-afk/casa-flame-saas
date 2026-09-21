import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { DEMO_RESTAURANT } from '../services/demoData';

export function WhatsAppButton() {
  const waNumber = DEMO_RESTAURANT.whatsapp.replace('+', '');
  const link = 'https://wa.me/' + waNumber;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
    </a>
  );
}

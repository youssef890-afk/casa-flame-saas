import { Link } from 'react-router-dom';
import { Coins, Clock, Share2, Trophy, ArrowLeft } from 'lucide-react';
import { useCoins } from '../../contexts/CoinsContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GamesPage() {
  const { coins } = useCoins();
  const { t, locale } = useLanguage();

  const GAMES = [
    { id: 'memory', title: locale === 'ar' ? 'ذاكرة الطعام' : locale === 'fr' ? 'Memoire Food' : 'Food Memory', desc: locale === 'ar' ? '8 أزواج' : 'Match 8 pairs', emoji: '🧠', reward: 30 },
    { id: 'reflex', title: locale === 'ar' ? 'نقرة سريعة' : 'Quick Tap', desc: locale === 'ar' ? 'قبل نفاد الوقت' : 'Before time runs out', emoji: '⚡', reward: 20 },
    { id: 'color', title: locale === 'ar' ? 'مطابقة الألوان' : 'Color Match', desc: locale === 'ar' ? 'اختر اللون' : 'Pick the color', emoji: '🎨', reward: 15 },
    { id: 'math', title: locale === 'ar' ? 'رياضيات' : 'Math Quick', desc: locale === 'ar' ? 'حل بسرعة' : 'Solve fast', emoji: '🔢', reward: 20 },
    { id: 'emoji', title: locale === 'ar' ? 'خمن الإيموجي' : 'Emoji Guess', desc: locale === 'ar' ? 'خمن الطعام' : 'Guess food', emoji: '🍔', reward: 25 },
    { id: 'sequence', title: locale === 'ar' ? 'اتبع الترتيب' : 'Follow Order', desc: locale === 'ar' ? 'كرر التسلسل' : 'Repeat', emoji: '🔮', reward: 30 },
    { id: 'word', title: locale === 'ar' ? 'كلمة' : 'Food Word', desc: locale === 'ar' ? 'رتب الحروف' : 'Unscramble', emoji: '📝', reward: 20 },
    { id: 'tap', title: locale === 'ar' ? 'انقر بسرعة' : 'Tap Fast', desc: locale === 'ar' ? 'انقر بسرعة' : 'Tap as many', emoji: '👆', reward: 20 },
    { id: 'lucky', title: locale === 'ar' ? 'بطاقة الحظ' : 'Lucky Card', desc: locale === 'ar' ? 'اختر بطاقة' : 'Pick a card', emoji: '🎴', reward: 40 },
    { id: 'wheel', title: locale === 'ar' ? 'عجلة الحظ' : 'Spin Wheel', desc: locale === 'ar' ? 'أدر العجلة' : 'Spin', emoji: '🎡', reward: 35 },
  ];

  const waShare = 'https://wa.me/?text=' + encodeURIComponent(
    'Play these fun games at Casa Flame! ' + (typeof window !== 'undefined' ? window.location.origin : '')
  );

  return (
    <div className="container-app py-8">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
      </Link>

      <div className="text-center mb-6">
        <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">{t('games.playEarn')}</p>
        <h1 className="heading-lg mb-2">{t('games.title')}</h1>
        <p className="text-white/50 text-sm">{t('games.subtitle')}</p>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        <div className="px-5 py-3 rounded-2xl bg-charcoal-900/60 border border-gold-500/30 flex items-center gap-2">
          <Coins className="w-5 h-5 text-gold-400" />
          <span className="font-bold text-lg">{coins}</span>
        </div>
        <Link to="/rewards" className="px-5 py-3 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center gap-2 shadow-glow">
          <Trophy className="w-4 h-4" />
          {t('games.rewards')}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((g) => (
          <Link
            key={g.id}
            to={'/games/' + g.id}
            className="rounded-3xl bg-charcoal-900/60 border border-white/5 hover:border-ember-500/30 p-4 transition"
          >
            <div className="text-4xl mb-3">{g.emoji}</div>
            <p className="font-bold text-sm mb-1">{g.title}</p>
            <p className="text-xs text-white/50 mb-3">{g.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gold-400 flex items-center gap-1">
                <Coins className="w-3 h-3" />+{g.reward}
              </span>
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Clock className="w-3 h-3" />15s
              </span>
            </div>
          </Link>
        ))}
      </div>

      <a
        href={waShare}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold flex items-center justify-center gap-2 transition"
      >
        <Share2 className="w-5 h-5" />
        {locale === 'ar' ? 'شارك مع أصدقائك' : locale === 'fr' ? 'Partager avec amis' : 'Share with friends'}
      </a>
    </div>
  );
}

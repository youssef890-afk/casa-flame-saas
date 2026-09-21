import { useRef, useState, useEffect } from 'react';
import { Download, Upload, Share2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import {
  downloadBackup,
  restoreBackup,
  shareBackupOnWhatsApp,
  getLastBackupDate,
  markBackupDone,
} from '../../lib/backup';

export default function BackupPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    setLastBackup(getLastBackupDate());
  }, []);

  const onDownload = () => {
    downloadBackup();
    markBackupDone();
    setLastBackup(getLastBackupDate());
    setMessage({ type: 'ok', text: 'Backup downloaded' });
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const res = restoreBackup(text);
      if (res.success) {
        setMessage({ type: 'ok', text: 'Restored! Reloading...' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage({ type: 'err', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Backup & Restore</h1>
        <p className="text-white/50 text-sm mt-1">Keep your data safe</p>
      </div>

      {message && (
        <div className={'rounded-2xl p-4 flex items-center gap-3 ' + (message.type === 'ok' ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-crimson-500/15 border border-crimson-500/25')}>
          {message.type === 'ok' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-crimson-400" />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {lastBackup && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-white/40" />
          <span className="text-sm text-white/60">
            Last backup: {new Date(lastBackup).toLocaleString()}
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={onDownload} className="rounded-3xl bg-charcoal-900/60 border border-white/5 hover:border-ember-500/30 p-6 text-left transition">
          <div className="w-12 h-12 rounded-2xl bg-flame-gradient flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold mb-1">Download Backup</p>
          <p className="text-xs text-white/50">Save a file with all your data</p>
        </button>

        <button onClick={() => fileRef.current?.click()} className="rounded-3xl bg-charcoal-900/60 border border-white/5 hover:border-emerald-500/30 p-6 text-left transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="font-bold mb-1">Restore</p>
          <p className="text-xs text-white/50">Load data from a backup file</p>
        </button>
      </div>

      <button onClick={shareBackupOnWhatsApp} className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold flex items-center justify-center gap-2 transition">
        <Share2 className="w-5 h-5" />
        Share via WhatsApp
      </button>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
        <h3 className="font-bold mb-3">What gets backed up</h3>
        <ul className="space-y-2 text-sm text-white/60">
          <li>- Products (menu items, prices, images)</li>
          <li>- Coins & rewards</li>
          <li>- Admin login credentials</li>
          <li>- Language preference</li>
        </ul>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}

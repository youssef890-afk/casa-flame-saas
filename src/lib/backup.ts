export const BACKUP_VERSION = 'v1';

export interface BackupData {
  version: string;
  exportedAt: string;
  restaurantName: string;
  keys: Record<string, string | null>;
}

const KEYS_TO_BACKUP = [
  'casa_products_v1',
  'casa_coins_v1',
  'casa_rewards_v1',
  'casa_admin_creds',
  'casa_admin_session',
  'locale',
];

export function createBackup(): BackupData {
  const keys: Record<string, string | null> = {};
  for (const k of KEYS_TO_BACKUP) {
    try {
      keys[k] = localStorage.getItem(k);
    } catch {
      keys[k] = null;
    }
  }
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    restaurantName: 'emynfc',
    keys,
  };
}

export function downloadBackup() {
  const data = createBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'casa-flame-backup-' + date + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreBackup(jsonText: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonText) as BackupData;
    if (!data.version || !data.keys) {
      return { success: false, message: 'Invalid backup file' };
    }
    for (const [k, v] of Object.entries(data.keys)) {
      try {
        if (v === null) localStorage.removeItem(k);
        else localStorage.setItem(k, v);
      } catch {}
    }
    return { success: true, message: 'Restored from ' + data.exportedAt };
  } catch {
    return { success: false, message: 'Could not read file' };
  }
}

export function shareBackupOnWhatsApp() {
  const data = createBackup();
  const text = 'Casa Flame Backup (' + data.exportedAt + ')\n\n' + JSON.stringify(data);
  const url = 'https://wa.me/?text=' + encodeURIComponent(text.slice(0, 2000));
  window.open(url, '_blank');
}

export function shouldAutoBackup(): boolean {
  try {
    const last = localStorage.getItem('casa_last_backup');
    if (!last) return true;
    const days = (Date.now() - parseInt(last, 10)) / (1000 * 60 * 60 * 24);
    return days >= 7;
  } catch {
    return true;
  }
}

export function markBackupDone() {
  try {
    localStorage.setItem('casa_last_backup', String(Date.now()));
  } catch {}
}

export function getLastBackupDate(): string | null {
  try {
    const last = localStorage.getItem('casa_last_backup');
    if (!last) return null;
    return new Date(parseInt(last, 10)).toISOString();
  } catch {
    return null;
  }
}

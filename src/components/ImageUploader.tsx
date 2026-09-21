import { useRef, useState } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (base64: string) => void;
}

export function ImageUploader({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 800;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > MAX) { h = (h * MAX) / w; w = MAX; }
          } else {
            if (h > MAX) { w = (w * MAX) / h; h = MAX; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('no context');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      alert('Could not load image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm mb-2">Product Image</label>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-2 rounded-xl bg-charcoal-950/80 backdrop-blur hover:bg-crimson-500/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={loading}
            className="h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-ember-500 hover:bg-ember-500/5 flex flex-col items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Camera className="w-6 h-6 text-white/60" />
            <span className="text-sm font-medium">Camera</span>
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-ember-500 hover:bg-ember-500/5 flex flex-col items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <ImageIcon className="w-6 h-6 text-white/60" />
            <span className="text-sm font-medium">Gallery</span>
          </button>
        </div>
      )}

      {loading && <p className="text-xs text-white/50 mt-2">Processing...</p>}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, Wallet } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { formatPrice, cn } from '../../lib/utils';

export default function CheckoutPage() {
  const [method, setMethod] = useState('delivery');
  const [payment, setPayment] = useState('card');
  const { subtotal, lines, clear } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const delivery = method === 'delivery' && subtotal > 0 ? 15 : 0;
  const total = subtotal + delivery;

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">Almost there</p>
        <h1 className="heading-lg">Checkout</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          success('Order placed!', 'Order #1043');
          clear();
          navigate('/');
        }}
        className="grid lg:grid-cols-[1fr_380px] gap-8"
      >
        <div className="space-y-6">
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Delivery method</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'delivery', label: 'Delivery', icon: Truck, desc: '30-45 min' },
                { id: 'pickup', label: 'Pickup', icon: MapPin, desc: '15 min' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    'p-4 rounded-2xl border text-left transition',
                    method === m.id ? 'border-ember-500 bg-ember-500/10' : 'border-white/10'
                  )}
                >
                  <m.icon className={cn('w-5 h-5 mb-2', method === m.id ? 'text-ember-400' : 'text-white/50')} />
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-xs text-white/50 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6 space-y-4">
            <h3 className="font-bold mb-2">Contact details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full name" className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60" />
              <input required type="tel" placeholder="Phone" className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60" />
            </div>
            {method === 'delivery' && (
              <input required placeholder="Delivery address" className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60" />
            )}
          </div>

          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Payment</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cash', label: 'Cash', icon: Wallet },
                { id: 'card', label: 'Card', icon: CreditCard },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayment(p.id)}
                  className={cn(
                    'p-4 rounded-2xl border flex flex-col items-center gap-2 transition',
                    payment === p.id ? 'border-ember-500 bg-ember-500/10' : 'border-white/10'
                  )}
                >
                  <p.icon className={cn('w-5 h-5', payment === p.id ? 'text-ember-400' : 'text-white/50')} />
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 h-fit">
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Your order</h3>
            <div className="space-y-3 mb-5">
              {lines.map(l => (
                <div key={l.product.id} className="flex justify-between text-sm">
                  <span className="text-white/70">{l.quantity} × {l.product.name}</span>
                  <span>{formatPrice(l.product.price * l.quantity)}</span>
                </div>
              ))}
              {lines.length === 0 && <p className="text-sm text-white/40">Cart empty</p>}
            </div>
            <div className="pt-5 border-t border-white/10 space-y-2 text-sm mb-4">
              <div className="flex justify-between text-white/60"><span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-white/60"><span>Delivery</span><span className="text-white">{formatPrice(delivery)}</span></div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline mb-6">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold gradient-text">{formatPrice(total)}</span>
            </div>
            <button
              type="submit"
              disabled={lines.length === 0}
              className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold disabled:opacity-40"
            >
              Place order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

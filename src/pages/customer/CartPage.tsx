import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../lib/utils';

export default function CartPage() {
  const { lines, subtotal, setQty, remove, clear } = useCart();
  const navigate = useNavigate();
  const delivery = subtotal > 0 ? 15 : 0;
  const total = subtotal + delivery;

  if (lines.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-white/40" />
        </div>
        <h1 className="heading-lg mb-3">Your cart is empty</h1>
        <p className="text-white/50 mb-8">Add dishes from our menu to get started.</p>
        <Link
          to="/menu"
          className="inline-flex h-12 px-6 rounded-2xl bg-flame-gradient text-white font-semibold items-center"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">Your order</p>
          <h1 className="heading-lg">Shopping cart</h1>
        </div>
        <button
          onClick={clear}
          className="inline-flex items-center gap-2 text-sm text-crimson-400 hover:text-crimson-300 px-3 py-2 rounded-xl hover:bg-crimson-500/10 transition"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-3">
          {lines.map(line => (
            <div key={line.product.id} className="flex gap-4 p-4 rounded-2xl bg-charcoal-900/60 border border-white/5">
              <img src={line.product.image} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{line.product.name}</h4>
                  <button
                    onClick={() => remove(line.product.id)}
                    className="p-1.5 text-white/40 hover:text-crimson-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-white/50 mt-0.5">{formatPrice(line.product.price)} each</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-charcoal-950/60 rounded-xl p-0.5">
                    <button
                      onClick={() => setQty(line.product.id, line.quantity - 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{line.quantity}</span>
                    <button
                      onClick={() => setQty(line.product.id, line.quantity + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold gradient-text">
                    {formatPrice(line.product.price * line.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 h-fit">
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Order summary</h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Delivery</span>
                <span className="text-white">{formatPrice(delivery)}</span>
              </div>
            </div>
            <div className="pt-5 border-t border-white/10 flex justify-between items-baseline mb-6">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold gradient-text">{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full h-12 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/menu" className="block text-center text-sm text-white/50 hover:text-white transition mt-4">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

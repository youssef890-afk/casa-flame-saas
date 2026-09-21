import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { success } = useToast();

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="heading-lg mb-4">Product not found</h1>
        <Link to="/menu" className="text-ember-400">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="rounded-3xl overflow-hidden aspect-square border border-white/10">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="heading-lg mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1 text-gold-400">
              <Star className="w-4 h-4 fill-gold-400" />
              {product.rating}
            </span>
          </div>

          <p className="text-white/70 leading-relaxed mb-8 text-lg">{product.description}</p>

          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs text-white/40 mb-1">Price</p>
              <p className="text-3xl font-bold gradient-text">{formatPrice(product.price)}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-1.5">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              add(product, qty);
              success('Added to cart', qty + ' × ' + product.name);
            }}
            className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to cart · {formatPrice(product.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

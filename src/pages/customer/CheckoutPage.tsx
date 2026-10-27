import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ExternalLink, LogIn, MapPin, Truck, UserPlus, Wallet } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { DEMO_RESTAURANT } from '../../services/demoData';
import { supabase } from '../../lib/supabase';
import { formatPrice, cn } from '../../lib/utils';

type OrderMethod = 'delivery' | 'pickup';

interface PersistedOrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

interface PersistedOrder {
  id: string;
  customer_name: string;
  phone: string;
  delivery_address: string | null;
  order_type: OrderMethod;
  payment_method: string;
  items: PersistedOrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
}

interface OrderConfirmation {
  id: string;
  whatsappUrl?: string;
}

function getGoogleMapsUrl(address: string): string {
  const value = address.trim();
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isGoogleMapsLink = url.protocol === 'https:'
      && (
        host === 'maps.app.goo.gl'
        || (host === 'goo.gl' && url.pathname.startsWith('/maps'))
        || ((host === 'google.com' || host.endsWith('.google.com')) && url.pathname.startsWith('/maps'))
      );
    if (isGoogleMapsLink) return url.toString();
  } catch {
    // A plain address is converted to a Google Maps search below.
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}

function buildWhatsAppMessage(order: PersistedOrder): string {
  const lines = [
    `New order ${order.id}`,
    `Created: ${new Date(order.created_at).toLocaleString()}`,
    `Type: ${order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}`,
    '',
    'Items:',
    ...order.items.map((item) =>
      `${item.quantity} x ${item.name} — ${formatPrice(item.unit_price * item.quantity)}`
    ),
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: ${formatPrice(order.delivery_fee)}`,
    `Total: ${formatPrice(order.total)}`,
    '',
    `Customer: ${order.customer_name}`,
    `Phone: ${order.phone}`,
  ];

  if (order.order_type === 'delivery' && order.delivery_address) {
    lines.push(
      `Delivery address: ${order.delivery_address}`,
      `Google Maps: ${getGoogleMapsUrl(order.delivery_address)}`
    );
  }

  lines.push(`Payment: ${order.payment_method === 'cash' ? 'Cash' : order.payment_method}`);
  return lines.join('\n');
}

function createWhatsAppUrl(message: string): string {
  const restaurantNumber = DEMO_RESTAURANT.whatsapp.replace(/\D/g, '');
  const recipient = restaurantNumber ? `/${restaurantNumber}` : '/';
  return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
}

export default function CheckoutPage() {
  const [method, setMethod] = useState<OrderMethod>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const submittingRef = useRef(false);
  const { subtotal, lines, clear } = useCart();
  const { user, ready, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone);
    setAddress(user.address);
  }, [user?.id]);

  const delivery = method === 'delivery' && subtotal > 0 ? 15 : 0;
  const total = subtotal + delivery;
  const mapsUrl = address.trim() ? getGoogleMapsUrl(address) : '';

  const placeOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    setFormError('');
    setNotificationError('');

    const customerName = name.trim();
    const customerPhone = phone.trim();
    const deliveryAddress = address.trim();

    if (!customerName) {
      setFormError('Add your full name to your account details before placing this order.');
      return;
    }
    if (!customerPhone) {
      setFormError('Add your phone number to your account details before placing this order.');
      return;
    }
    if (method === 'delivery' && !deliveryAddress) {
      setFormError('Add your delivery address or Google Maps location, or choose Pickup.');
      return;
    }
    if (!lines.length) {
      setFormError('Your cart is empty. Add an item before placing an order.');
      return;
    }
    if (!supabase) {
      setFormError('Orders cannot be saved because the order service is not configured. Please try again later.');
      return;
    }
    if (!user) {
      setFormError('Sign in to your account before placing an order.');
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;

    try {
      const profileResult = await updateProfile({
        name: customerName,
        phone: customerPhone,
        address: deliveryAddress,
      });
      if (!profileResult.ok) {
        throw new Error(profileResult.error || 'Could not save your profile details.');
      }

      const { data: orderId, error: orderError } = await supabase.rpc('create_customer_order', {
        p_customer_name: customerName,
        p_phone: customerPhone,
        p_delivery_address: method === 'delivery' ? deliveryAddress : null,
        p_order_type: method,
        p_payment_method: 'cash',
        p_items: lines.map(({ product, quantity }) => ({ id: product.id, quantity })),
      });

      if (orderError) throw orderError;
      if (typeof orderId !== 'string' || !orderId) {
        throw new Error('The order service did not return an order number.');
      }

      const { data: orderData, error: readError } = await supabase
        .from('orders')
        .select('id,customer_name,phone,delivery_address,order_type,payment_method,items,subtotal,delivery_fee,total,created_at')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      clear();
      if (readError) {
        whatsappWindow?.close();
        setConfirmation({ id: orderId });
        setNotificationError('Your order was saved, but we could not prepare its WhatsApp message. Please contact the restaurant and share this order number.');
        success('Order saved', `Order ${orderId}`);
        return;
      }

      const savedOrder = orderData as PersistedOrder;
      const whatsappUrl = createWhatsAppUrl(buildWhatsAppMessage(savedOrder));
      setConfirmation({ id: savedOrder.id, whatsappUrl });
      if (whatsappWindow) {
        whatsappWindow.location.replace(whatsappUrl);
      }
      success('Order saved', `Order ${savedOrder.id}`);
    } catch (orderError) {
      whatsappWindow?.close();
      const message = orderError instanceof Error
        ? orderError.message
        : 'Could not place your order. Please try again.';
      setFormError(message);
      toastError('Could not place order', message);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (!ready) {
    return <div className="container-app py-20 text-center text-white/60">Loading your account…</div>;
  }

  if (!user) {
    const checkoutPath = `${location.pathname}${location.search}`;

    return (
      <div className="container-app py-16 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-flame-gradient flex items-center justify-center mx-auto mb-6 shadow-glow">
          <LogIn className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Create an account to place your order</h1>
        <p className="text-white/60 mb-8 text-sm">
          You can browse the menu and add items to your cart without an account. To continue with your order,
          create an account if this is your first time, or sign in to your existing account.
        </p>
        <Link
          to="/signup"
          state={{ from: checkoutPath }}
          className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow mb-3"
        >
          <UserPlus className="w-5 h-5" />
          Create account
        </Link>
        <Link
          to="/login"
          state={{ from: checkoutPath }}
          className="block w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Sign in
        </Link>
        <Link to="/menu" className="block text-center text-sm text-white/40 mt-6">
          Continue browsing
        </Link>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="container-app py-16 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Your order is saved</h1>
        <p className="text-white/60 mb-2">Order number: <span className="text-white font-semibold">{confirmation.id}</span></p>
        {confirmation.whatsappUrl ? (
          <>
            <p className="text-white/60 mb-6 text-sm">
              WhatsApp is ready with your order details. Review the message and press Send to notify the restaurant.
            </p>
            <a
              href={confirmation.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 mb-3"
            >
              Open WhatsApp message <ExternalLink className="w-4 h-4" />
            </a>
          </>
        ) : (
          <p role="alert" className="text-amber-300 text-sm my-6">{notificationError}</p>
        )}
        <Link to="/menu" className="block text-center text-sm text-white/50 hover:text-white mt-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">Almost there</p>
        <h1 className="heading-lg">Checkout</h1>
      </div>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Delivery method</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'delivery' as const, label: 'Delivery', icon: Truck, desc: '30-45 min' },
                { id: 'pickup' as const, label: 'Pickup', icon: MapPin, desc: '15 min' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMethod(option.id)}
                  className={cn(
                    'p-4 rounded-2xl border text-left transition',
                    method === option.id ? 'border-ember-500 bg-ember-500/10' : 'border-white/10'
                  )}
                >
                  <option.icon className={cn('w-5 h-5 mb-2', method === option.id ? 'text-ember-400' : 'text-white/50')} />
                  <p className="font-semibold text-sm">{option.label}</p>
                  <p className="text-xs text-white/50 mt-0.5">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6 space-y-4">
            <h3 className="font-bold mb-2">Account details</h3>
            <div>
              <label htmlFor="checkout-name" className="block text-sm mb-2">Full name</label>
              <input
                id="checkout-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                maxLength={120}
                placeholder="Add your full name"
                className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60"
              />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-sm mb-2">Phone number</label>
              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
                maxLength={40}
                placeholder="Add your phone number"
                className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60"
              />
            </div>
            {method === 'delivery' && (
              <div>
                <label htmlFor="checkout-address" className="block text-sm mb-2">Delivery address or Google Maps location</label>
                <input
                  id="checkout-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  autoComplete="street-address"
                  required
                  placeholder="Enter your address or paste a Google Maps link"
                  className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60"
                />
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm text-ember-400 hover:text-ember-300 break-all"
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    Open delivery location in Google Maps
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Payment</h3>
            <div className="p-4 rounded-2xl border border-ember-500 bg-ember-500/10 flex items-center gap-3">
              <Wallet className="w-5 h-5 text-ember-400" />
              <span className="text-sm font-medium">Cash {method === 'delivery' ? 'on delivery' : 'on pickup'}</span>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 h-fit">
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
            <h3 className="font-bold mb-5">Your order</h3>
            <div className="space-y-3 mb-5">
              {lines.map((line) => (
                <div key={line.product.id} className="flex justify-between text-sm">
                  <span className="text-white/70">{line.quantity} × {line.product.name}</span>
                  <span>{formatPrice(line.product.price * line.quantity)}</span>
                </div>
              ))}
              {lines.length === 0 && <p className="text-sm text-white/40">Cart empty</p>}
            </div>
            <div className="pt-5 border-t border-white/10 space-y-2 text-sm mb-4">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Delivery</span><span className="text-white">{formatPrice(delivery)}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline mb-6">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold gradient-text">{formatPrice(total)}</span>
            </div>
            {formError && (
              <p role="alert" className="flex items-start gap-2 text-sm text-crimson-300 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={lines.length === 0 || submitting}
              className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold disabled:opacity-40"
            >
              {submitting ? 'Saving order…' : 'Place order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

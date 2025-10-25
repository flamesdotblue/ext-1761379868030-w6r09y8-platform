import { useEffect, useState } from 'react';
import { useStore } from '../store/store';

export default function CheckoutForm({ onSuccess }) {
  const user = useStore((s) => s.user);
  const cart = useStore((s) => s.cart);
  const subtotal = useStore((s) => s.subtotal());
  const clearCart = useStore((s) => s.clearCart);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    method: 'card',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setForm((f) => ({ ...f, name: user?.name || '', email: user?.email || '' }));
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!/^\d{4,10}$/.test(form.zip)) e.zip = 'Enter a valid ZIP/Postal code';
    if (!['card', 'paypal'].includes(form.method)) e.method = 'Select a payment method';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;
    setLoading(true);
    try {
      // In production: call backend to create Stripe/PayPal session.
      await new Promise((r) => setTimeout(r, 800));
      clearCart();
      setMessage('Payment successful! Your order is confirmed.');
      onSuccess?.();
    } catch (err) {
      setMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8" aria-labelledby="checkout-heading">
      <h2 id="checkout-heading" className="text-2xl font-semibold text-pink-900 mb-4">
        Checkout
      </h2>
      <div className="bg-white/80 rounded-xl border border-pink-100 p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-pink-900" htmlFor="name">Full name</label>
            <input
              id="name"
              autoComplete="name"
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-pink-900" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-pink-900" htmlFor="address">Address</label>
            <input
              id="address"
              autoComplete="street-address"
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'address-error' : undefined}
            />
            {errors.address && <p id="address-error" className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-900" htmlFor="city">City</label>
            <input
              id="city"
              autoComplete="address-level2"
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && <p id="city-error" className="text-xs text-red-600 mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-900" htmlFor="zip">ZIP/Postal</label>
            <input
              id="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              aria-invalid={!!errors.zip}
              aria-describedby={errors.zip ? 'zip-error' : undefined}
            />
            {errors.zip && <p id="zip-error" className="text-xs text-red-600 mt-1">{errors.zip}</p>}
          </div>
          <fieldset className="md:col-span-2">
            <legend className="text-sm font-medium text-pink-900">Payment method</legend>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={form.method === 'card'}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                />
                <span>Card (Stripe)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  value="paypal"
                  checked={form.method === 'paypal'}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                />
                <span>PayPal</span>
              </label>
            </div>
            {errors.method && <p className="text-xs text-red-600 mt-1">{errors.method}</p>}
          </fieldset>
          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <p className="text-pink-900">
              Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </p>
            <button
              type="submit"
              disabled={cart.length === 0 || loading}
              className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-[#E1BEE7] text-purple-900 hover:bg-[#d7ace8] disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
            >
              {loading ? 'Processing…' : 'Place order'}
            </button>
          </div>
          {message && (
            <div role="status" className="md:col-span-2 text-sm mt-2 text-green-700">
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

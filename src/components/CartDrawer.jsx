import { X, Trash, Plus, Minus, CreditCard } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const cart = useStore((s) => s.cart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQty = useStore((s) => s.updateQty);
  const subtotal = useStore((s) => s.subtotal());
  const drawerRef = useRef(null);
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    setAnnounce(cart.length === 0 ? 'Cart is empty' : `${cart.length} items in cart`);
  }, [cart]);

  return (
    <div
      id="cart-drawer"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition ${open ? 'bg-black/30' : 'bg-transparent'}`}
        aria-hidden
      />
      {/* Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-pink-900">Your Cart</h3>
          <button
            className="p-2 rounded-md hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#E1BEE7]"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-10rem)]" aria-live="polite">{announce}</div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-10rem)]">
          {cart.length === 0 && (
            <p className="text-sm text-pink-800/80">Your cart is empty. Add some cakes!</p>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border rounded-lg p-3 bg-white/80">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-pink-900 truncate">{item.name}</p>
                <p className="text-sm text-pink-800/80">${(item.price * item.qty).toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2" aria-label={`Change quantity for ${item.name}`}>
                  <button
                    className="p-2 rounded-md bg-[#F8BBD0] text-pink-900 hover:bg-[#f5a8c6]"
                    onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    inputMode="numeric"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value || '1', 10))}
                    className="w-12 text-center py-2 border rounded-md"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    className="p-2 rounded-md bg-[#F8BBD0] text-pink-900 hover:bg-[#f5a8c6]"
                    onClick={() => updateQty(item.id, Math.min(99, item.qty + 1))}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                className="p-2 rounded-md hover:bg-red-50 text-red-600"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-white/90">
          <div className="flex items-center justify-between text-pink-900 mb-3">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[#E1BEE7] text-purple-900 hover:bg-[#d7ace8] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
            aria-disabled={cart.length === 0}
          >
            <CreditCard className="w-5 h-5" />
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}

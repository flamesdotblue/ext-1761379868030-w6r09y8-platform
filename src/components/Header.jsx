import { ShoppingCart, User, LogOut, Cake } from 'lucide-react';
import { useStore } from '../store/store';

export default function Header({ onOpenAuth, onOpenCart }) {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const cartCount = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/75 border-b border-pink-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2" aria-label="Cake Shop home">
          <div className="p-2 rounded-full bg-[#F8BBD0] text-pink-900" aria-hidden>
            <Cake className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-wide text-pink-900">Sweet Slice</span>
        </a>
        <nav aria-label="Primary" className="hidden sm:flex items-center gap-6 text-sm">
          <a href="#cakes" className="text-pink-900 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1BEE7] rounded">Cakes</a>
          <a href="#about" className="text-pink-900 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1BEE7] rounded">About</a>
          <a href="#contact" className="text-pink-900 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1BEE7] rounded">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[#E1BEE7] text-purple-900 hover:bg-[#d7ace8] focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[#E1BEE7] text-purple-900 hover:bg-[#d7ace8] focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
              aria-haspopup="dialog"
              aria-controls="auth-modal"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[#BBDEFB] text-blue-900 hover:bg-[#a8d2fb] focus-visible:ring-2 focus-visible:ring-[#E1BEE7]"
            aria-haspopup="dialog"
            aria-controls="cart-drawer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span
              aria-label={`${cartCount} items in cart`}
              className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 rounded-full bg-[#F8BBD0] text-pink-900 text-xs flex items-center justify-center"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

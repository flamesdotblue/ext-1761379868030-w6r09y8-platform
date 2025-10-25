import { useEffect, useState } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import CheckoutForm from './components/CheckoutForm';
import { useStore } from './store/store';

export default function App() {
  const ui = useStore((s) => s.ui);
  const openCart = useStore((s) => s.openCart);
  const closeCart = useStore((s) => s.closeCart);
  const openAuth = useStore((s) => s.openAuth);
  const closeAuth = useStore((s) => s.closeAuth);
  const cart = useStore((s) => s.cart);

  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (checkingOut) openCart();
  }, [checkingOut, openCart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-[#F8BBD0]/20 to-[#BBDEFB]/20">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <Header onOpenAuth={openAuth} onOpenCart={openCart} />

      <main id="main" className="pb-16">
        <Hero />
        <ProductGrid />
        {checkingOut && (
          <CheckoutForm onSuccess={() => setCheckingOut(false)} />
        )}
        <Footer />
      </main>

      <AuthModal open={ui.authOpen} onClose={closeAuth} />
      <CartDrawer
        open={ui.cartOpen}
        onClose={closeCart}
        onCheckout={() => {
          closeCart();
          setCheckingOut(true);
        }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#F8BBD0] via-[#E1BEE7] to-[#BBDEFB]">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-pink-900 leading-tight">
              Celebrate with Sweet Slice
            </h1>
            <p className="mt-3 text-pink-900/80">
              Hand-crafted cakes baked fresh daily. Delightful flavors, playful designs, and a pastel-perfect vibe.
            </p>
            <a
              href="#cakes"
              className="mt-6 inline-block px-5 py-3 rounded-md bg-white/90 text-pink-900 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
            >
              Shop cakes
            </a>
          </div>
          <div className="relative h-64 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1622576890453-8e50b6f7d5b0?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBc3NvcnRlZCUyMHBhc3RlbCUyMGNha2VzJTIwb258ZW58MHwwfHx8MTc2MTM4MDAxMXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80"
              alt="Assorted pastel cakes on display"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const user = useStore((s) => s.user);
  return (
    <footer id="contact" className="mt-16 border-t border-pink-100 bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-8 grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-pink-900 font-semibold">Sweet Slice</p>
          <p className="text-sm text-pink-800/80 mt-2">Baked with love. Accessible by design.</p>
        </div>
        <div className="sm:text-right text-pink-800/80 text-sm">
          <p>
            {user ? (
              <span>
                Signed in as <span className="font-medium text-pink-900">{user.email}</span> ({user.role})
              </span>
            ) : (
              <span>Guest browsing</span>
            )}
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Sweet Slice</p>
        </div>
      </div>
    </footer>
  );
}

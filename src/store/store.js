import { create } from 'zustand';

// Mock product data with optimized images
const initialProducts = [
  {
    id: 'choco-delight',
    name: 'Chocolate Delight',
    description: 'Rich dark chocolate cake with ganache frosting.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1554298377-9e4df6fd965c?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDaG9jb2xhdGUlMjBEZWxpZ2h0fGVufDB8MHx8fDE3NjEzNzgzMjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476b?q=60&w=400&auto=format&fit=crop',
  },
  {
    id: 'strawberry-dream',
    name: 'Strawberry Dream',
    description: 'Vanilla sponge with fresh strawberries and cream.',
    price: 24.5,
    image: 'https://images.unsplash.com/photo-1623406827446-bca8c08b85fd?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTdHJhd2JlcnJ5JTIwRHJlYW18ZW58MHwwfHx8MTc2MTM4MDExM3ww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1542826438-1c3d968a2683?q=60&w=400&auto=format&fit=crop',
  },
  {
    id: 'purple-velvet',
    name: 'Purple Velvet',
    description: 'Velvety sponge with lavender buttercream.',
    price: 32.0,
    image: 'https://images.unsplash.com/photo-1570667613884-ad23a42b57e8?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxQdXJwbGUlMjBWZWx2ZXR8ZW58MHwwfHx8MTc2MTM4MDQ2OXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1618886614638-cfe7a4bdf3f3?q=60&w=400&auto=format&fit=crop',
  },
  {
    id: 'blueberry-bliss',
    name: 'Blueberry Bliss',
    description: 'Lemon cake topped with blueberry compote.',
    price: 27.75,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=60&w=400&auto=format&fit=crop',
  },
];

const makeToken = (email, role) =>
  btoa(JSON.stringify({ sub: email, role, iat: Date.now() / 1000 }));

export const useStore = create((set, get) => ({
  products: [],
  user: null, // { name, email, role: 'admin' | 'customer', token }
  cart: [], // { id, name, price, image, qty }
  ui: { cartOpen: false, authOpen: false },

  // Products
  fetchProducts: async () => {
    // Simulate API latency
    await new Promise((r) => setTimeout(r, 200));
    set({ products: initialProducts });
  },

  // Auth (mocked). In production, call backend and store JWT.
  login: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 250));
    // Simple validation; replace with backend verification
    const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!strong.test(password)) {
      const err = new Error('Invalid credentials');
      err.code = 'INVALID_CREDS';
      throw err;
    }
    const role = email.toLowerCase().startsWith('admin') ? 'admin' : 'customer';
    const name = email.split('@')[0];
    const token = makeToken(email, role);
    const user = { name, email, role, token };
    set({ user });
    return user;
  },
  logout: () => set({ user: null }),

  // Cart
  addToCart: (product, qty = 1) => {
    const existing = get().cart.find((c) => c.id === product.id);
    let next;
    if (existing) {
      next = get().cart.map((c) =>
        c.id === product.id ? { ...c, qty: Math.min(c.qty + qty, 99) } : c
      );
    } else {
      next = [...get().cart, { id: product.id, name: product.name, price: product.price, image: product.image, qty }];
    }
    set({ cart: next });
  },
  removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.id !== id) }),
  updateQty: (id, qty) => {
    const n = Math.max(1, Math.min(99, Number(qty) || 1));
    set({ cart: get().cart.map((c) => (c.id === id ? { ...c, qty: n } : c)) });
  },
  clearCart: () => set({ cart: [] }),
  subtotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),

  // UI
  openCart: () => set({ ui: { ...get().ui, cartOpen: true } }),
  closeCart: () => set({ ui: { ...get().ui, cartOpen: false } }),
  openAuth: () => set({ ui: { ...get().ui, authOpen: true } }),
  closeAuth: () => set({ ui: { ...get().ui, authOpen: false } }),
}));

import { Plus, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../store/store';

export default function ProductGrid() {
  const products = useStore((s) => s.products);
  const fetchProducts = useStore((s) => s.fetchProducts);
  const addToCart = useStore((s) => s.addToCart);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setQty = (id, v) => setQuantities((q) => ({ ...q, [id]: Math.max(1, Math.min(99, v)) }));

  return (
    <section id="cakes" className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-2xl font-semibold text-pink-900 mb-4">Our Cakes</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Product list"
      >
        {products.map((p) => (
          <article
            key={p.id}
            className="group rounded-xl border border-pink-100 bg-white/80 backdrop-blur hover:shadow-md focus-within:shadow-md transition-shadow overflow-hidden"
            role="listitem"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={p.thumb}
                srcSet={`${p.thumb}&dpr=1 400w, ${p.image}&dpr=2 800w`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-pink-900">{p.name}</h3>
              <p className="text-sm text-pink-800/80 mt-1">{p.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-pink-900 font-semibold">${p.price.toFixed(2)}</span>
                <div className="flex items-center gap-2" aria-label={`Select quantity for ${p.name}`}>
                  <button
                    className="p-2 rounded-md bg-[#F8BBD0] text-pink-900 hover:bg-[#f5a8c6] focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
                    onClick={() => setQty(p.id, Math.max(1, (quantities[p.id] || 1) - 1))}
                    aria-label={`Decrease quantity of ${p.name}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    max={99}
                    aria-live="polite"
                    value={quantities[p.id] || 1}
                    onChange={(e) => setQty(p.id, parseInt(e.target.value || '1', 10))}
                    className="w-12 text-center py-2 border rounded-md"
                    aria-label={`Quantity for ${p.name}`}
                  />
                  <button
                    className="p-2 rounded-md bg-[#F8BBD0] text-pink-900 hover:bg-[#f5a8c6] focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
                    onClick={() => setQty(p.id, Math.min(99, (quantities[p.id] || 1) + 1))}
                    aria-label={`Increase quantity of ${p.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => addToCart(p, quantities[p.id] || 1)}
                className="mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md bg-[#BBDEFB] text-blue-900 hover:bg-[#a8d2fb] focus-visible:ring-2 focus-visible:ring-[#E1BEE7]"
                aria-label={`Add ${p.name} to cart`}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';

export default function AuthModal({ open, onClose }) {
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    } else {
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Basic client-side validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
    if (!emailOk) return setError('Enter a valid email.');
    if (!passOk) return setError('Password must be 8+ chars with upper, lower, and number.');
    setLoading(true);
    try {
      await login({ email, password });
      onClose();
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal"
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div onClick={onClose} className={`absolute inset-0 ${open ? 'bg-black/30' : 'bg-transparent'}`} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className={`absolute left-1/2 top-1/2 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-pink-900">Sign in</h3>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={onClose} aria-label="Close sign in">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pink-900">
              Email
            </label>
            <input
              ref={firstFieldRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-pink-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
            />
          </div>
          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#E1BEE7] text-purple-900 hover:bg-[#d7ace8] disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#BBDEFB]"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs text-pink-800/80">
            Tip: Use admin@example.com with a strong password (e.g., Password123!) to see admin role in header state.
          </p>
        </form>
      </div>
    </div>
  );
}

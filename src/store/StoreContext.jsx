import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

// Simple store using Context + Reducer to manage cart and user data
const StoreContext = createContext();

const initialState = {
  user: null, // { id, name, role: 'customer' | 'admin' }
  cartOpen: false,
  authOpen: false,
  checkoutOpen: false,
  cart: [], // { id, name, price, image, qty }
  products: [
    {
      id: 'cake-1',
      name: 'Strawberry Bliss',
      description: 'Fluffy vanilla sponge layered with fresh strawberries and cream.',
      price: 24.99,
      image:
        'https://images.unsplash.com/photo-1583593168035-73e5711293f9?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTdHJhd2JlcnJ5JTIwQmxpc3N8ZW58MHwwfHx8MTc2MTM4MDE5OHww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      tags: ['bestseller', 'fruity'],
    },
    {
      id: 'cake-2',
      name: 'Lavender Velvet',
      description: 'Soft lavender-infused cake with silky buttercream frosting.',
      price: 29.5,
      image:
        'https://images.unsplash.com/photo-1566651053092-0cb0ee1e6b5c?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxMYXZlbmRlciUyMFZlbHZldHxlbnwwfDB8fHwxNzYxMzgwMTk4fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      tags: ['signature'],
    },
    {
      id: 'cake-3',
      name: 'Blueberry Dream',
      description: 'Zesty lemon sponge with blueberry compote and mascarpone.',
      price: 27.25,
      image:
        'https://images.unsplash.com/photo-1566400628146-ae8f27849e90?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxCbHVlYmVycnklMjBEcmVhbXxlbnwwfDB8fHwxNzYxMzgwMTk4fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      tags: ['gluten-friendly'],
    },
    {
      id: 'cake-4',
      name: 'Chocolate Cloud',
      description: 'Moist chocolate cake with dark ganache and cocoa nib crunch.',
      price: 31.0,
      image:
        'https://images.unsplash.com/photo-1740168026235-70c2ced2b811?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDaG9jb2xhdGUlMjBDbG91ZHxlbnwwfDB8fHwxNzYxMzgwMTk3fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      tags: ['chocolate'],
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_CART':
      return { ...state, cartOpen: true };
    case 'CLOSE_CART':
      return { ...state, cartOpen: false };
    case 'OPEN_AUTH':
      return { ...state, authOpen: true };
    case 'CLOSE_AUTH':
      return { ...state, authOpen: false };
    case 'LOGIN':
      return { ...state, user: action.payload, authOpen: false };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_TO_CART': {
      const exists = state.cart.find((i) => i.id === action.payload.id);
      let newCart;
      if (exists) {
        newCart = state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, qty: Math.min(i.qty + (action.payload.qty || 1), 99) } : i
        );
      } else {
        newCart = [...state.cart, { ...action.payload, qty: Math.min(action.payload.qty || 1, 99) }];
      }
      return { ...state, cart: newCart };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QTY': {
      const { id, qty } = action.payload;
      return {
        ...state,
        cart: state.cart.map((i) => (i.id === id ? { ...i, qty: Math.min(Math.max(qty, 1), 99) } : i)),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const persisted = localStorage.getItem('cake_store_state');
      return persisted ? { ...init, ...JSON.parse(persisted) } : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'cake_store_state',
      JSON.stringify({ user: state.user, cart: state.cart })
    );
  }, [state.user, state.cart]);

  const subtotal = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [state.cart]
  );

  const value = useMemo(
    () => ({ state, dispatch, subtotal }),
    [state, subtotal]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

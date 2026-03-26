import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@workspace/api-client-react';

export interface CartItem {
  id: string; // unique id combining product id + variations
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; count: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, color, size) => {
        const uniqueId = `${product.id}-${color || 'default'}-${size || 'default'}`;
        set((state) => {
          const existingItem = state.items.find((item) => item.id === uniqueId);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === uniqueId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { id: uniqueId, product, quantity, color, size }],
          };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => ({
            subtotal: acc.subtotal + (item.product.discountPrice || item.product.price) * item.quantity,
            count: acc.count + item.quantity,
          }),
          { subtotal: 0, count: 0 }
        );
      },
    }),
    {
      name: 'plaisirxpress-cart',
    }
  )
);

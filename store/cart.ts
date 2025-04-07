import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set: any) => ({
      cart: {
        cartItems: [],
      },

      addToCart: (item: any) => {
        set((state: any) => ({
          cart: {
            cartItems: [...state.cart.cartItems, item],
          },
        }));
      },
      updateCart: (newCartItems: any) => {
        set((state: any) => ({
          cart: {
            cartItems: newCartItems,
          },
        }));
      },
      emptyCart: () => {
        set(() => ({
          cart: {
            cartItems: [],
          },
        }));
      },
    }),
    {
      name: "cart", // name of the item in the storage (must be unique)
      skipHydration: true,
    }
  )
);

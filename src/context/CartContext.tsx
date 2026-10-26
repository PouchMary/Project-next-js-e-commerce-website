
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartItem {
  id: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (id: number, quantity: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "my-store-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Step 1: Load the saved cart when the app starts.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart: unknown = JSON.parse(savedCart);

        if (
          Array.isArray(parsedCart) &&
          parsedCart.every(
            (item) =>
              typeof item.id === "number" &&
              typeof item.quantity === "number" &&
              item.quantity > 0,
          )
        ) {
          setCart(parsedCart as CartItem[]);
        }
      }
    } catch (error) {
      console.error("Could not load cart:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Step 2: Save cart changes after loading is complete.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save cart:", error);
    }
  }, [cart, isLoaded]);

  // Step 3: Add a product to the cart.
  const addToCart = (id: number, quantity: number) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === id,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentCart, { id, quantity }];
    });
  };

  // Step 4: Update the quantity.
  const updateQuantity = (id: number, quantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  // Step 5: Remove a product.
  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

// Quantity controls for a product in the cart.
export default function ProductCart({
  id,
  quantity,
}: {
  id: number;
  quantity: number;
}) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className=" items-center gap-3 px-12 py-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
      <button
        onClick={() => updateQuantity(id, quantity - 1)}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        -
      </button>

      <span>{quantity}</span>

      <button
        onClick={() => updateQuantity(id, quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>

      <button onClick={() => removeFromCart(id)}>
        Remove
      </button>
    </div>
  );
}

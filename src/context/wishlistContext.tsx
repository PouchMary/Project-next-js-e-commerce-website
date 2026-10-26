"use client";

import { product } from "@/type/product";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface WishlistContextType {
  favoriteIds: number[];
  toggleWishlist: (product: number) => void;
  isFavorite: (product: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isloaded, setIsLoaded] = useState(false);

  // load save favorites when the app starts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("my-store-wishlist");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every((id) => typeof id === "number" && Number.isInteger(id))
        ) {
          setFavoriteIds(parsed);
        }
      }
    } catch {
      console.error("Cound not load wishlist");
    }

    setIsLoaded(true);
  }, []);

  // Save favorite whenever they change.
  useEffect(() => {
    if (isloaded) {
      localStorage.setItem("My-store-wishlist", JSON.stringify(favoriteIds));
    }
  }, [favoriteIds, isloaded]);

  function toggleWishlist(productId: number) {
    setFavoriteIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function isFavorite(productId: number) {
    return favoriteIds.includes(productId);
  }

  return (
    <WishlistContext.Provider
      value={{ favoriteIds, toggleWishlist, isFavorite }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishList() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be use inside WishlistProvider");
  }
  return context;
}

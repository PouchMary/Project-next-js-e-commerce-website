"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 ">
        <Link
          href="/"
          className="whitespace-nowrap text-xl font-bold text-blue-700 transition hover:text-blue-800 sm:text-2xl"
        >
          🛒MyStore
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-600 sm:gap-6 sm:text-base">
          <Link href="/" className="transition hover:text-blue-700">
            Home
          </Link>

          <Link href="/products" className="transition hover:text-blue-700">
            Products
          </Link>

          <Link href="/about" className="transition hover:text-blue-700">
            About
          </Link>

          <Link href="/cart" className="transition hover:text-blue-700">
            Cart ({cartCount})
          </Link>
        </div>
      </div>
    </nav>
  );
}

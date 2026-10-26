"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { product } from "@/type/product";

interface ProductActionsProps {
  product: product;
}
export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  // get Add to cart
  const { addToCart, removeFromCart } = useCart();
  // const {addToCart} = useCart();
  

  const handleAddToCart = () =>{
    addToCart(product.id, quantity);
  };
  return (
    <div className="mt-6">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="rounded-lg border px-4 py-2"
        >
          −
        </button>

        <span className="text-lg font-semibold">{quantity}</span>

        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="rounded-lg border px-4 py-2"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={() => {
          addToCart(product.id, quantity);
          console.log("BUTTON CLICKED:", product.id, quantity);
          alert("Add to Cart cliked");
          addToCart(product.id , quantity);
        }}
        className="mt-6 rounded-lg bg-black px-6 py-3  text-white"
      >
        Add to Cart
      </button>

      <button type="button" onClick={() => removeFromCart(product.id)} className="mxt-4 rounded-lg border px-6 py-3 text-white bg-black mt-4 ">
        Remove to cart
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/lib/api";
import { product } from "@/type/product";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { CartProvider } from "@/context/CartContext";

export default function CartPage() {
  // Get cart data and cart functions
  const { cart, updateQuantity, removeFromCart } = useCart();
  // Store full product information
  const [products, setProducts] = useState<product[]>([]);

  // use router in inside cart page
  const router = useRouter();

  // Load products whenever the cart changes
  useEffect(() => {
    async function loadProducts() {
      const productData = await Promise.all(
        cart.map((item) => getProductById(item.id.toString())),
      );

      setProducts(productData);
    }

    if (cart.length > 0) {
      loadProducts();
    } else {
      setProducts([]);
    }
  }, [cart]);

  const subtotal = products.reduce((total, product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    return total + product.price * (cartItem?.quantity ?? 0);
  }, 0);
  const shipping = cart.length > 0 ? 5 : 0;
  const total = shipping + subtotal;
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-2 text-xl font-bold text-gray-900 ">Order Summary</h2>

        <div className="flex justify-between py-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <div className="mt-2 flex justify-between border-t pt-3 text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Page title */}
      <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Shopping Cart</h1>
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 ">
       {cart.length === 0 ? (
        <p className="mt-6">Your Cart is empty</p>
      ) : (
        <div className="mt-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-auto justify-center ">
          {cart.map((item) => {
            const currentProduct = products.find(
              (product) => product.id === item.id,
            );

            // Product is still loading
            if (!currentProduct) {
              return (
                <div key={item.id} className="mb-4 rounded-lg bor">
                  <p>Loading product...</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 rounded-lg border px-4 py-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="mb-4 flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md sm:flex-row"
              >
                {/* Product image */}
                <img
                  src={currentProduct.images[0]}
                  alt={currentProduct.title}
                  className="h-32 w-full shrink-0 rounded-lg bg-gray-50 object-contain p-2 sm:h-40 sm:w-40"
                />
                {/* Product information */}
                <div className="flex-1">
                  {/* Product name */}
                  <h2 className="text-xl font-semibold">
                    {currentProduct.title}
                  </h2>
                  {/* Product price */}
                  <p className="mt-2">Price: ${currentProduct.price}</p>

                  {/* Quantity controls */}
                  <div className="mt-3 flex items-center gap-3">
                    <span>Quantity:</span>

                    {/* Minus */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1 font-semibold transition hover:bg-gray-100"
                    >
                      {" "}
                      −
                    </button>

                    {/* Current quantity */}
                    <span className="font-semibold">{item.quantity}</span>

                    {/* Plus */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1 font-semibold transition hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(item.id);
                    }}
                    className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>

                  {/* Total price */}
                  <p className="mt-2 font-bold">
                    Total: ${(currentProduct.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
     
    </main>
  );
}

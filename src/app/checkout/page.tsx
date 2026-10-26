
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/lib/api";
import type { product } from "@/type/product";
import { saveOrder } from "@/lib/orders";
import type { Order } from "@/type/order";

type ShippingInfo = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function CheckoutPage() {
  const { cart, removeFromCart } = useCart();

  const [products, setProducts] = useState<Record<number, product>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completedOrderTotal, setCompletedOrderTotal] = useState(0);
  const [orderId, setOrderId] = useState("");

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Fetch product information from DummyJSON
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (cart.length === 0) {
        setProducts({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const results = await Promise.all(
          cart.map(async (item) => {
            const result = (await getProductById(
              String(item.id)
            )) as product;

            return [item.id, result] as const;
          })
        );

        if (!cancelled) {
          setProducts(Object.fromEntries(results));
        }
      } catch {
        if (!cancelled) {
          setErrorMessage(
            "Could not load products. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [cart]);

  // Calculate subtotal and total
  const subtotal = cart.reduce((sum, item) => {
    const currentProduct = products[item.id];

    return sum + (
      currentProduct
        ? currentProduct.price * item.quantity
        : 0
    );
  }, 0);

  const shippingCost = cart.length > 0 ? 5 : 0;
  const total = subtotal + shippingCost;

  function validationShipping (){
    if(cart.length === 0){
      setErrorMessage("Your cart is empty");
      return false;
    }
    if(!shipping.fullName.trim()){
      setErrorMessage("Please Enter your full name");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email.trim())) {
        setErrorMessage("Please enter a valid email address.");
        return false;
      }
    
    if(!shipping.address.trim()){
      setErrorMessage("Please enter your address");
      return false;
    }
    if(!shipping.city.trim()){
      setErrorMessage("Please enter your city");
      return false;
    }
    if(!shipping.country.trim()){
      setErrorMessage("Please enter your country");
      return false;
    }
    if(!shipping.postalCode.trim()){
      setErrorMessage("Please enter your postalcode");
      return false
    }
    
    setErrorMessage("");
    return true;


   
  }
   const handleSummit = (event:React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();

      if(!validationShipping()){
        return;

      }
    }




  // Place the order
  function handlePlaceOrder() {
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (cart.some((item) => !products[item.id])) {
      setErrorMessage("Please wait until all products load.");
      return;
    }

    const id = `ORD-${Date.now()}`;

    const order: Order = {
      id,
      date: new Date().toISOString(),

      customer: {
        fullName: shipping.fullName,
        email: shipping.email,
        address: shipping.address,
        city: shipping.city,
        postalcode: shipping.postalCode,
        country: shipping.country,
      },

      items: cart.flatMap((item) => {
        const currentProduct = products[item.id];

        if (!currentProduct) return [];

        return [{
          product: currentProduct,
          quantity: item.quantity,
        }];
      }),

      subtotal,
      shipping: shippingCost,
      total,
    };

    try {
      saveOrder(order);

      setOrderId(id);
      setCompletedOrderTotal(total);
      setOrderPlaced(true);

      cart.forEach((item) => {
        removeFromCart(item.id);
      });
    } catch {
      setErrorMessage(
        "Unable to save your order. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg sm:p-8">

        <h1 className="mb-8 rounded-lg bg-gray-900 p-4 text-center text-3xl font-bold text-white">
          Checkout
        </h1>

        {errorMessage && (
          <p
            className="mb-4 rounded bg-red-100 p-3 text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* ORDER SUCCESS */}
        {orderPlaced ? (
          <section className="py-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-green-700">
              🎉 Order Successful!
            </h2>

            <p className="mb-2">
              Thank you, {shipping.fullName}!
            </p>

            <p className="mb-2">
              Order ID: <strong>{orderId}</strong>
            </p>

            <p className="mb-6 text-xl font-bold">
              Order total: ${completedOrderTotal.toFixed(2)}
            </p>

            <a
              href="/orders"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              View Order History
            </a>

            <div className="mt-4">
              <a
                href="/products"
                className="text-blue-600 underline"
              >
                Continue Shopping
              </a>
            </div>
          </section>
        ) : (
          <>
            {/* ORDER SUMMARY */}
            <section className="mb-10">
              <h2 className="mb-4 border-b pb-3 text-xl font-bold">
                1. Order Summary
              </h2>

              {loading && (
                <p className="py-4">Loading products from API...</p>
              )}

              {!loading && cart.length === 0 && (
                <div className="rounded-lg bg-gray-50 p-5 text-center">
                  <p className="mb-4">Your cart is empty.</p>
                  <a
                    href="/products"
                    className="text-blue-600 underline"
                  >
                    Browse Products
                  </a>
                </div>
              )}

              {!loading && cart.map((item) => {
                const currentProduct = products[item.id];

                if (!currentProduct) return null;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center"
                  >
                    <img
                      src={currentProduct.thumbnail}
                      alt={currentProduct.title}
                      className="h-28 w-28 rounded-lg border object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {currentProduct.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {currentProduct.description}
                      </p>

                      <p className="mt-2">
                        Unit price: ${currentProduct.price.toFixed(2)}
                      </p>

                      <p>Quantity: {item.quantity}</p>

                      <p className="mt-1 font-bold">
                        Subtotal: ${(
                          currentProduct.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="mt-5 space-y-3 text-right">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Shipping: ${shippingCost.toFixed(2)}</p>

                <p className="border-t pt-3 text-xl font-bold">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            </section>

            {/* Display the error message */}
            {errorMessage && (
              <p className="mb-4 rounded-r-lg bg-red-300 p-3 text-sm text-gray-700">{errorMessage}</p>
            )}

            {/* SHIPPING FORM */}
            {!submitted && (
              <section>
                <h2 className="mb-4 border-b pb-3 text-xl font-bold">
                  2. Shipping Details
                </h2>

                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    
                    if(!validationShipping()){
                      return;
                    }
                    setSubmitted(true);
                  }}
                >
                  <label className="block font-medium">
                    Full Name
                    <input
                      className="mt-2 block w-full rounded-lg border p-3"
                      required
                      autoComplete="name"
                      value={shipping.fullName}
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          fullName: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block font-medium">
                    Email
                    <input
                      className="mt-2 block w-full rounded-lg border p-3"
                      type="email"
                      required
                      autoComplete="email"
                      value={shipping.email}
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          email: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block font-medium">
                    Address
                    <input
                      className="mt-2 block w-full rounded-lg border p-3"
                      required
                      autoComplete="street-address"
                      value={shipping.address}
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          address: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block font-medium">
                    City
                    <input
                      className="mt-2 block w-full rounded-lg border p-3"
                      required
                      autoComplete="address-level2"
                      value={shipping.city}
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          city: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block font-medium">
                    Postal Code
                    <input
                      className="mt-2 block w-full rounded-lg border p-3"
                      required
                      autoComplete="postal-code"
                      value={shipping.postalCode}
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          postalCode: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block font-medium">
                    Country
                    <input
                      className="mt-2 block w-full rounded-lg border p-3"
                      required
                      autoComplete="country-name"
                      value={shipping.country}
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          country: event.target.value,
                        })
                      }
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      Boolean(errorMessage) ||
                      cart.length === 0 ||
                      cart.some((item) => !products[item.id])
                    }
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </form>
              </section>
            )}

            {/* PAYMENT */}
            {submitted && (
              <section className="mt-8 rounded-lg border p-5">
                <h2 className="mb-4 text-xl font-bold">
                  3. Payment
                </h2>

                <p className="mb-4">
                  Shipping details saved for this checkout.
                </p>

                <p className="mb-5 text-lg font-bold">
                  Amount due: ${total.toFixed(2)}
                </p>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={
                    loading ||
                    Boolean(errorMessage) ||
                    cart.length === 0 ||
                    cart.some((item) => !products[item.id])
                  }
                  className="w-full rounded-lg bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Place Order
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

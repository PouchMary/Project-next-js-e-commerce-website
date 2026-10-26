
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/lib/orders";
import type { Order } from "@/type/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-gray-50 px-4 py-10 sm:px-6">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Order History
        </h1>

        <p className="text-gray-600">
          View your previous orders and purchased products.
        </p>
      </div>

      {/* Empty Order History */}
      {orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            No orders yet
          </h2>

          <p className="mb-5 text-gray-600">
            You have no previous orders.
          </p>

          <Link
            href="/products"
            className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <section
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-7"
            >
              {/* Order Information */}
              <div className="flex flex-col justify-between gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-center">
                <h2 className="text-xl font-bold text-blue-700">
                  Order {order.id}
                </h2>

                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>

              {/* Customer Information */}
              <div className="my-5 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Customer
                </h3>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">
                      Name:{" "}
                    </span>
                    {order.customer.fullName}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Email:{" "}
                    </span>
                    {order.customer.email}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Address:{" "}
                    </span>
                    {order.customer.address},{" "}
                    {order.customer.city},{" "}
                    {order.customer.postalcode},{" "}
                    {order.customer.country}
                  </p>
                </div>
              </div>

              {/* Purchased Products */}
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Purchased Products
                </h3>

                <ul className="space-y-4">
                  {order.items.map((item) => (
                    <li
                      key={item.product.id}
                      className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 text-sm sm:text-base"
                    >
                      <span className="min-w-0 flex-1 font-medium text-gray-700">
                        {item.product.title} × {item.quantity}
                      </span>

                      <span className="shrink-0 font-semibold text-gray-900">
                        $
                        {(
                          item.product.price * item.quantity
                        ).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="mt-5 rounded-lg bg-gray-50 p-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between gap-4 border-t border-gray-200 pt-4">
                  <span className="text-lg font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-blue-700">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}


import type { Order } from "@/type/order";

const ORDERS_KEY = "my-store-orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedOrders = localStorage.getItem(ORDERS_KEY);

    return savedOrders ? (JSON.parse(savedOrders) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();

  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify([order, ...orders])
  );
}

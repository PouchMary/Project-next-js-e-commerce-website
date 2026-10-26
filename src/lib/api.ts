
import type { product } from "@/type/product";

const API_URL = "https://dummyjson.com";

type ProductsResponse = {
  products: product[];
  total: number;
  skip: number;
  limit: number;
};

export async function getProducts(): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      signal: AbortSignal.timeout(15000),
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<product> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      signal: AbortSignal.timeout(15000),
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product ${id}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`GET PRODUCT ${id} ERROR:`, error);
    throw error;
  }
}

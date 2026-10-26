import { getProducts } from "@/lib/api";
import { product } from "@/type/product";
import ProductList from "@/components/ProductList";

export const dynamic = "force-dynamic"; // នេះជា special export ដែល Next.js ស្គាល់ដោយស្វ័យប្រវត្តិ (route segment config)
export default async function ProductsPage() {
  const data = await getProducts();
  const products: product[] = data.products;

  return (
    <main className="min-h-screen px-4 py-10 bg-gray-50 sm:px-6 ">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 sm:text-4xl font-bold">
            Product
          </h1>
          <p className="mt-2 text-gray-600">
            Discover our product and find something you love
          </p>
        </div>

        {/* Product list */}
        <ProductList products={products} />
      </div>
    </main>
  );
}


import { getProductById } from "@/lib/api";
import { product } from "@/type/product";
import ProductActions from "@/components/ProductActions";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const product: product = await getProductById(id);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Product Details Card */}
        <div className="grid gap-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md md:grid-cols-2">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-50 p-4 sm:p-6">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-80 w-full object-contain sm:h-[500px]"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center p-5 sm:p-8">
            {/* Category */}
            <p className="mb-2 text-sm font-medium capitalize text-gray-500">
              {product.category}
            </p>

            {/* Product Title */}
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.title}
            </h1>

            {/* Product Price */}
            <p className="mt-3 text-2xl font-bold text-blue-700">
              ${product.price.toFixed(2)}
            </p>

            {/* Product Rating */}
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">⭐</span>
              <span className="font-semibold text-gray-800">
                {product.rating}
              </span>
              <span>Product Rating</span>
            </p>

            {/* Product Description */}
            <p className="mt-5 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Add to Cart Actions */}
            <div className="mt-6">
              <ProductActions product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

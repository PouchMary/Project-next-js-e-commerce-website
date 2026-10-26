"use client"

import { product } from "@/type/product";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: product;
}

export default function ProductCard({
  product,

}: ProductCardProps) {
  const {toggleWishlist, isFavorite} = useWishlist();
    return(
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Favorite Button */}
      <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={isFavorite(product.id) ? "Remove from favorite" : "Add to favorite"} className="absolute right-3 top-3 z-10 flex h-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110">

      <span className={isFavorite(product.id) ? "text-2xl text-red-200" : "text-2xl text-gray-400"}>
      {isFavorite(product.id) ? "♥" : "♡"}
      </span>
      </button>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4 ">

        {/* Category */}
        <p className="text-sm capitalize text-gray-500">{product.category}</p>

        {/* product Title */}
        <h2 className="mt-2 line-clamp-2 h-12 text-lg font-semibold text-gray-900">{product.title}</h2>

        {/* Price */}
        <p className="mt-2 text-xl font-bold text-blue-700">{product.price.toFixed(2)}</p>

        {/* Rating */}
        <p className="mt-3 text-sm text-gray-600">
          <span className="text-yellow-500">★</span>{" "} {product.rating}
        </p>

        {/* view product link */}
        <Link href={`/products/${product.id}`} className="mt-auto block w-full rounded-lg "></Link>
      </div>
      </div>
    )
  }




//   return (
//     <Link
//       href={`/products/${product.id}`}
//       className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
//     >
//       {/* Product Image */}
//       <div className="overflow-hidden bg-gray-50">
//         <img
//           src={product.images[0]}
//           alt={product.title}
//           className="h-56 w-full object-contain p-4 transition duration-300 group-hover:scale-105 sm:h-64"
//         />
//       </div>

//       {/* Product Information */}
//       <div className="flex flex-1 flex-col p-4">
//         {/* Category */}
//         <p className="text-sm capitalize text-gray-500">
//           {product.category}
//         </p>

//         {/* Product Title */}
//         <h2 className="mt-2 line-clamp-2 min-h-12 text-lg font-semibold text-gray-900">
//           {product.title}
//         </h2>

//         {/* Price */}
//         <p className="mt-3 text-xl font-bold text-blue-700">
//           ${product.price.toFixed(2)}
//         </p>

//         {/* Rating */}
//         <p className="mt-2 text-sm text-gray-600">
//           <span className="text-yellow-500">★</span>{" "}
//           {product.rating}
//         </p>

//         {/* View Product Link */}
//         <span className="mt-auto block w-full rounded-lg bg-gray-900 px-4 py-3 text-center font-medium text-white transition group-hover:bg-blue-700">
//           View Product
//         </span>
//       </div>
//     </Link>
//   );
// }

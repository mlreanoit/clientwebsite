// ISR(CACHE) - 30 MINUTES

import ProductCard from "@/components/shared/home/ProductCard";
import { getRelatedProductsBySubCategoryIds } from "@/lib/database/actions/product.actions";
import React from "react";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import IdInvalidError from "@/components/shared/IdInvalidError";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const subCategoryName = (await searchParams).name || "";
  return {
    title: `Buy ${subCategoryName} Products | VibeCart`,
    description: `Shop all ${subCategoryName} products.`,
  };
}

const SubCategoryProductsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const subCategoryName = (await searchParams).name || "";
  // checking if the ID is valid Object ID

  const id = (await params).id;
  if (!ObjectId.isValid(id)) {
    return <IdInvalidError />;
  }
  const products = await getRelatedProductsBySubCategoryIds([id]).catch((err) =>
    console.log(err)
  );
  console.log(products);
  // if ID is valid id, but if our app doesnt found any id, we will redirect users to home page:
  if (!products?.success) {
    return <IdInvalidError />;
  }

  const transformedSubCategoryProducts = products?.products.map(
    (product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category, // You might need to format this
      image: product.subProducts[0]?.images[0].url || "", // Adjust to match your image structure
      rating: product.rating,
      reviews: product.numReviews,
      price: product.subProducts[0]?.price || 0, // Adjust to match your pricing structure
      originalPrice: product.subProducts[0]?.originalPrice || 0, // Add logic for original price
      discount: product.subProducts[0]?.discount || 0,
      isBestseller: product.featured,
      isSale: product.subProducts[0]?.isSale || false, // Adjust if you have sale logic
      slug: product.slug,
      prices: product.subProducts[0]?.sizes
        .map((s: any) => {
          return s.price;
        })
        .sort((a: any, b: any) => {
          return a - b;
        }),
    })
  );
  return (
    <div>
      <ProductCard
        shop={true}
        products={transformedSubCategoryProducts}
        heading={`${(subCategoryName && subCategoryName) || "Products"}`}
      />
    </div>
  );
};

export default SubCategoryProductsPage;

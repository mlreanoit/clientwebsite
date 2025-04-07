// ISR(CACHE) - 30 MINUTES

import React from "react";
import { Star, Minus, Plus, Clock, Award, Droplet, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Marquee from "react-fast-marquee";
import ProductReviewComponent from "@/components/shared/product/ProductReviewComponent";
import ProductDetailsAccordian from "@/components/shared/product/ProductDetailsAccordian";
import {
  getRelatedProductsBySubCategoryIds,
  getSingleProduct,
} from "@/lib/database/actions/product.actions";
import { Metadata } from "next";
import QtyButtons from "@/components/shared/product/QtyButtons";
import Link from "next/link";
import AddtoCartButton from "@/components/shared/product/AddtoCart";
import ProductCard from "@/components/shared/home/ProductCard";
import { redirect } from "next/navigation";
import IdInvalidError from "@/components/shared/IdInvalidError";

// generate meta data coming from database
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const style = Number((await searchParams).style);
  const size = Number((await searchParams).size) || 0;
  const product = await getSingleProduct(slug, style, size);

  return {
    title: `Buy ${product.name} product | VibeCart`,
    description: product.description,
  };
}
const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const slug = (await params).slug;
  const style = Number((await searchParams).style);
  const size = Number((await searchParams).size) || 0;
  const sizeforButton = Number((await searchParams).size);
  const product = await getSingleProduct(slug, style, size);
  if (!product.success) {
    return <IdInvalidError />;
  }
  const images = product.subProducts[0].images.map((image: any) => image.url);
  const subCategoryProducts = product.subCategories.map((i: any) => i._id);
  const relatedProducts = await getRelatedProductsBySubCategoryIds(
    subCategoryProducts
  ).catch((err) => console.log(err));
  const transformedProducts = relatedProducts?.products.map((product: any) => ({
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
  }));

  return (
    <div>
      <Marquee className="bg-[#FFF579] flex justify-between gap-[50px] p-4 sm:hidden">
        <p className="para mx-4">✨ Free delivery on all PrePaid Orders</p>
        <p className="para mx-4">
          🎁 Buy Any 3 products and get 1 gift for free
        </p>
        <p className="para mx-4">
          1 Body wash cleanser + 5 SKINCARE PRODUCTS @ ₹1500
        </p>
      </Marquee>
      <div className="max-w-7xl ownContainer pb-6 px-6 pt-2">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-[20px] ">
          <div className="w-full lg:w-1/2 lg:sticky top-[1rem] self-start">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((imgSrc: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={imgSrc}
                        alt={`Product Image ${index + 1}`}
                        className="w-full sticky h-auto object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <h1 className="text-2xl lg:subHeading">{product.name}</h1>
            <p className="text-xs lg:text-sm text-gray-500">
              {product.category.name}
            </p>
            <p className="text-xs lg:text-sm text-gray-500">
              {product?.description}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-gray-500">
                ({product.numReviews} Reviews)
              </span>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-baseline gap-2 ">
                  <span className="text-2xl lg:text-3xl font-bold text-[#FA6338]">
                    ₹{product.price}
                  </span>
                  <span className="text-2xl lg:text-3xl font-bold text-green-500">
                    ₹{product.price}
                  </span>
                  <span>M.R.P:</span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.priceBefore.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-red-500 font-semibold">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 ">Inclusive of all taxes</p>
              </div>
              <QtyButtons product={product} size={size} style={style} />
            </div>
            {product.subProducts[0].sizes[size].qty <= 10 && (
              <div>
                <b className="text-red-500">Hurry Up!</b> Only{" "}
                <b className="text-red-500">
                  {product.subProducts[0].sizes[size].qty}
                </b>{" "}
                Left!
              </div>
            )}
            <div className="flex gap-[10px] ">
              {product.sizes.map((sizes: { size: string }, index: number) => (
                <Link
                  key={sizes.size}
                  href={`/product/${product.slug}?style=${style}&size=${index}`}
                >
                  <div
                    className={`${
                      index === sizeforButton && "bg-black text-white"
                    } h-[50px] w-[50px] rounded-full grid  items-center border border-black cursor-pointer justify-center hover:text-white hover:bg-black`}
                  >
                    {sizes.size}
                  </div>
                </Link>
              ))}
            </div>
            <AddtoCartButton product={product} size={size} />
            {product.longDescription.length > 0 && (
              <div className="border-t-gray-300 border-t-2 my-[20px]">
                <p className="mt-[10px]">
                  <b>Description</b>
                </p>{" "}
                <br />
                <div
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { icon: Clock, text: "LONG-LASTING" },
                { icon: Award, text: "CERTIFIED" },
                { icon: Droplet, text: "QUALITY CHECKED OILS" },
                { icon: MapPin, text: "MADE IN INDIA" },
              ].map(({ icon: Icon, text }, index) => (
                <div
                  className="flex flex-col items-center text-center bg-gray-100 px-1 py-8 justify-center"
                  key={index}
                >
                  <div className="rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-2">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ProductDetailsAccordian
          description={product.longDescription}
          keyBenefits={product.benefits}
          ingredients={product.ingredients}
          details={product.details}
        />
        <ProductReviewComponent
          product={product}
          rating={product.rating}
          numofReviews={product.numReviews}
          ratings={product.ratings}
        />
        <ProductCard
          heading="YOU MAY ALSO LIKE"
          products={transformedProducts}
          shop
        />
      </div>
    </div>
  );
};

export default ProductPage;

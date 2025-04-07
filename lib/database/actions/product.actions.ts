"use server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "../connect";
import Category from "../models/category.model";
import Product from "../models/product.model";
import SubCategory from "../models/subCategory.model";
import User from "../models/user.model";
import { redirect } from "next/navigation";
import { revalidateTag, unstable_cache } from "next/cache";

// get all top selling products
export const getTopSellingProducts = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      const products = await Product.find()
        .sort({ "subProduct.sold": -1 })
        .limit(4)
        .lean();
      if (!products) {
        return {
          products: [],
          message: "Products are not yet created!",
          success: false,
        };
      }
      return {
        products: JSON.parse(JSON.stringify(products)),
        success: true,
        message: "Products fetched successully.",
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["top_selling_products"],
  {
    revalidate: 1800,
  }
);

// get all new arrival products
export const getNewArrivalProducts = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
      if (!products) {
        return {
          message: "Products are not yet created!",
          success: false,
          products: [],
        };
      }
      return {
        message: "Fetched all new arrival products",
        success: true,
        products: JSON.parse(JSON.stringify(products)),
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["new_arrival_products"],
  {
    revalidate: 1800,
  }
);
// fetch products by query
export async function getProductsByQuery(query: string) {
  try {
    await connectToDatabase();
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(4)
      .lean();
    if (!products || products.length === 0) {
      return {
        products: [],
        success: false,
        message: "No products found with this search criteria.",
      };
    }
    return {
      products: JSON.parse(JSON.stringify(products)),
      success: true,
      message: "Successfully fetched all query related products.",
    };
  } catch (error) {
    handleError(error);
  }
}

// get single product
export const getSingleProduct = unstable_cache(
  async (slug: string, style: number, size: number) => {
    try {
      await connectToDatabase();
      let product: any = await Product.findOne({ slug })
        .populate({
          path: "category",
          model: Category,
        })
        .populate({ path: "subCategories", model: SubCategory })
        .populate({ path: "reviews.reviewBy", model: User })
        .lean();
      if (!product) {
        return {
          success: false,
        };
      }
      let subProduct = product?.subProducts[style];
      let prices = subProduct.sizes
        .map((s: any) => {
          return s.price;
        })
        .sort((a: any, b: any) => {
          return a - b;
        });
      // Count the number of reviews for each star rating
      const ratingCount: any = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      product.reviews.forEach((review: any) => {
        const rating = review.rating;
        if (ratingCount[rating] !== undefined) {
          ratingCount[rating]++;
        }
      });
      // Calculate the total number of reviews
      const totalReviews = product.reviews.length;

      // calculate rating breakdown percentages
      const ratingBreakdown = [1, 2, 3, 4, 5].map((stars) => {
        const count = ratingCount[stars];
        const percentage: any =
          totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : 0;
        return {
          stars,
          percentage: parseFloat(percentage),
          count,
        };
      });
      let newProduct = {
        success: true,
        ...product,
        style,
        images: subProduct.images,
        sizes: subProduct.sizes,
        discount: subProduct.discount,
        sku: subProduct.sku,
        colors: product.subProducts.map((p: any) => {
          return p.color;
        }),
        priceRange:
          prices.length > 1 &&
          `From ₹${prices[0]} to ₹${prices[prices.length - 1]}`,
        price:
          subProduct.discount > 0
            ? (
                subProduct.sizes[size].price -
                (subProduct.sizes[size].price * subProduct.discount) / 100
              ).toFixed(2)
            : subProduct.sizes[size].price,
        priceBefore: subProduct.sizes[size].price,
        quantity: subProduct.sizes[size].qty,
        ratingBreakdown,
        rating: product.rating,
        allSizes: product.subProducts
          .map((p: any) => {
            return p.sizes;
          })
          .flat()
          .sort((a: any, b: any) => {
            return a.size - b.size;
          })
          .filter(
            (element: any, index: any, array: any) =>
              array.findIndex((el2: any) => el2.size === element.size) === index
          ),
      };
      return JSON.parse(JSON.stringify(newProduct));
    } catch (error) {
      handleError(error);
      redirect("/");
    }
  },
  ["product"],
  {
    revalidate: 1800,
    tags: ["product"],
  }
);

// create a product review for individual product
export async function createProductReview(
  rating: number,
  review: string,
  clerkId: string,
  productId: string
) {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    const user = await User.findOne({ clerkId });

    if (product) {
      const exist = product.reviews.find(
        (x: any) => x.reviewBy.toString() == user._id
      );
      if (exist) {
        await Product.updateOne(
          {
            _id: productId,
            "reviews._id": exist._id,
          },
          {
            $set: {
              "reviews.$.review": review,
              "reviews.$.rating": rating,
              "reviews.$.reviewCreatedAt": Date.now(),
            },
          },
          {
            new: true,
          }
        );
        const updatedProduct = await Product.findById(productId);
        updatedProduct.numReviews = updatedProduct.reviews.length;
        updatedProduct.rating =
          updatedProduct.reviews.reduce((a: any, r: any) => r.rating + a, 0) /
          updatedProduct.reviews.length;
        await updatedProduct.save();
        await updatedProduct.populate("reviews.reviewBy");
        revalidateTag("product");
        return JSON.parse(
          JSON.stringify({ reviews: updatedProduct.reviews.reverse() })
        );
      } else {
        const full_review = {
          reviewBy: user._id,
          rating,
          review,
          reviewCreatedAt: Date.now(),
        };
        product.reviews.push(full_review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((a: any, r: any) => r.rating + a, 0) /
          product.reviews.length;
        await product.save();
        await product.populate("reviews.reviewBy");
        revalidateTag("product");

        return JSON.parse(
          JSON.stringify({ reviews: product.reviews.reverse() })
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//get product details by its ID:

export async function getProductDetailsById(
  productId: string,
  style: number,
  size: number | string
) {
  try {
    await connectToDatabase();
    const product: any = await Product.findById(productId).lean();

    let discount = product.subProducts[style].discount;
    let priceBefore = product.subProducts[style].sizes[size].price;

    // Correct discount calculation
    let price = discount
      ? priceBefore - (priceBefore * discount) / 100
      : priceBefore;

    let data = {
      _id: product._id.toString(),
      style: Number(style),
      name: product.name,
      description: product.description,
      slug: product.slug,
      sku: product.subProducts[style].sku,
      brand: product.brand,
      category: product.category,
      subCategories: product.subCategories,
      shipping: product.shipping,
      images: product.subProducts[style].images,
      color: product.subProducts[style].color,
      size: product.subProducts[style].sizes[size].size,
      price: price.toFixed(2), // Ensures the price is formatted with two decimals
      priceBefore: priceBefore.toFixed(2), // Ensures formatting
      vendor: product.vendor,
      vendorId: product.vendorId,
      discount,
      saved: Math.round(priceBefore - price),
      quantity: product.subProducts[style].sizes[size].qty,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}

// get related products by subCategory Ids.
export const getRelatedProductsBySubCategoryIds = unstable_cache(
  async (subCategoryIds: string[]) => {
    try {
      await connectToDatabase();
      const query = subCategoryIds.length
        ? {
            subCategories: { $in: subCategoryIds },
          }
        : {};
      let products = await Product.find({ ...query }).limit(12);
      if (!products) {
        return {
          success: false,
          products: [],
        };
      }
      return {
        success: true,
        products: JSON.parse(JSON.stringify(products)),
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["subCatgeory_products"],
  {
    revalidate: 1800,
  }
);
// get featured products
export const getAllFeaturedProducts = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      const featuredProducts = await Product.find({ featured: true }).populate({
        path: "category",
        model: Category,
      });
      return {
        featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
        success: true,
        message: "Successfully fetched all feautured products.",
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["featured_products"],
  {
    revalidate: 1800,
  }
);

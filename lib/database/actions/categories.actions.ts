"use server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "../connect";
import Category from "../models/category.model";
import { unstable_cache } from "next/cache";

export const getAllCategories = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
      return {
        success: true,
        message: "Successfully fetched all categories.",
        categories: JSON.parse(JSON.stringify(categories)),
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["all_categories"],
  {
    revalidate: 1800,
  }
);

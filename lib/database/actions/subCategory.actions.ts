"use server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "../connect";
import SubCategory from "../models/subCategory.model";
import Category from "../models/category.model";
import { unstable_cache } from "next/cache";

// get all sub categories by its parent(category) id
export const getAllSubCategoriesByParentId = unstable_cache(
  async (parentId: string) => {
    try {
      await connectToDatabase();
      const subCategoriesByParentId = await SubCategory.find({
        parent: parentId,
      }).lean();
      return {
        message:
          "Successfully fetched all sub categories related to it's parent ID",
        subCategories: JSON.parse(JSON.stringify(subCategoriesByParentId)),
        success: true,
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["parent_subCategories"],
  {
    revalidate: 1800,
  }
);
// get all sub categories by its parent name
export const getAllSubCategoriesByName = unstable_cache(
  async (name: string) => {
    try {
      await connectToDatabase();

      // Step 1: Find the parent category by name
      const parentCategory: any = await Category.findOne({ name }).lean();
      if (!parentCategory) {
        return {
          message: "Parent category not found.",
          subCategories: [],
          success: false,
        };
      }

      const parentId = parentCategory._id;

      // Step 2: Find subcategories by parent ID
      const subCategoriesByParentId = await SubCategory.find({
        parent: parentId,
      }).lean();

      return {
        message:
          "Successfully fetched all subcategories related to the parent category name",
        subCategories: JSON.parse(JSON.stringify(subCategoriesByParentId)),
        success: true,
      };
    } catch (error) {
      handleError(error);
      return {
        message: "An error occurred while fetching subcategories",
        subCategories: [],
        success: false,
      };
    }
  },
  ["subCategories"],
  {
    revalidate: 1800,
  }
);

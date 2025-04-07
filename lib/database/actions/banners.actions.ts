"use server";
import { unstable_cache } from "next/cache";

import { handleError } from "@/lib/utils";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

// fetch all website banners
export const fetchAllWebsiteBanners = unstable_cache(
  async () => {
    try {
      const result = await cloudinary.api.resources_by_tag("website_banners", {
        type: "upload",
        max_results: 100,
      });
      return result.resources.map((item, index) => item.url);
    } catch (error) {
      handleError(error);
    }
  },
  ["website_banners"],
  {
    revalidate: 600,
  }
);
// fetch all app banners
export const fetchAllAppBanners = unstable_cache(
  async () => {
    try {
      const result = await cloudinary.api.resources_by_tag("app_banners", {
        type: "upload",
        max_results: 100,
      });
      return result.resources;
    } catch (error) {
      handleError(error);
    }
  },
  ["app_banners"],
  {
    revalidate: 600,
  }
);

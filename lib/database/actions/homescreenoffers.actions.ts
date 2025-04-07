"use  server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "../connect";
import HomeScreenOffer from "../models/home.screen.offers";
import { unstable_cache } from "next/cache";

// Get all offers for home screen
export const getAllSpecialComboOffers = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      const offers = await HomeScreenOffer.find({
        offerType: "specialCombo",
      }).sort({ updatedAt: -1 });
      return {
        offers: JSON.parse(JSON.stringify(offers)),
        message: "Successfully fetched specialCombo offers.",
        success: true,
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["special_combos"],
  {
    revalidate: 600,
  }
);
// Get all offers for home screen
export const getAllCrazyDealOffers = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      const offers = await HomeScreenOffer.find({
        offerType: "crazyDeal",
      }).sort({ updatedAt: -1 });
      return {
        offers: JSON.parse(JSON.stringify(offers)),
        message: "Successfully fetched crazyDeal offers.",
        success: true,
      };
    } catch (error) {
      handleError(error);
    }
  },
  ["crazy_deals"],
  {
    revalidate: 600,
  }
);

const mongoose = require("mongoose");

const HomeScreenOffers = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  offerType: {
    type: String,
    enum: ["specialCombo", "crazyDeal"],
    required: true,
  },
});
const HomeScreenOffer =
  mongoose.models.HomeScreenOffer ||
  mongoose.model("HomeScreenOffer", HomeScreenOffers);
export default HomeScreenOffer;

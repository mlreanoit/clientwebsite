import React from "react";

type CrazyDealsDataType = {
  offers: any[];
  message: string;
  success: boolean;
};
const CrazyDeals = ({ dealsData }: { dealsData: CrazyDealsDataType }) => {
  return (
    <div className="container mx-auto px-4 mb-[20px]">
      <div className="heading my-[10px] ownContainer text-center uppercase sm:my-[40px]">
        Crazy Deals
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto gap-[20px] sm:justify-center scroll-smooth no-scrollbar">
          {dealsData.offers.map((deal) => (
            <div key={deal._id} className="flex-shrink-0 w-[80vw] sm:w-[347px]">
              <img
                src={deal.images[0].url}
                alt={deal.title}
                className="w-full h-auto object-cover"
              />
              <p className="text-center uppercase textGap font-[500]">
                {deal.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrazyDeals;

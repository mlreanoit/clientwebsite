"use client";

import ProductCard from "@/components/shared/home/ProductCard";
import FilterButton from "@/components/shared/shop/FilterButton";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ShopPage = () => {
  const [sortBy, setSortBy] = useState("Featured");
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="heading mb-8 text-center">Shop All Products</h1>
      <div className="flex justify-center items-center mb-6">
        <div className="flex">
          <FilterButton />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-black text-white px-4 py-2 pr-8 border-l border-white"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      {/* <ProductCard heading="" shop={true} />
      <ProductCard heading="" shop={true} /> */}
    </div>
  );
};

export default ShopPage;

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import {
  getProductsByQuery,
  getTopSellingProducts,
} from "@/lib/database/actions/product.actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import toast from "react-hot-toast";

const SearchModal = ({ setOpen }: { setOpen: any }) => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetchBestSellerProducts() {
      try {
        await getTopSellingProducts().then((res) => {
          if (res?.success) {
            setProducts(res?.products);
            console.log(res?.products);
          } else {
            setProducts(res?.products);
            toast.error(res?.message);
          }
        });
      } catch (error) {
        handleError(error);
      }
    }
    fetchBestSellerProducts();
  }, []);
  useEffect(() => {
    async function fetchDataByQuery() {
      try {
        setLoading(true);
        const res = await getProductsByQuery(query);
        if (res?.success) {
          setProducts(res?.products);
          setLoading(false);
        } else {
          setProducts(res?.products);
          // toast.error(res?.message);
          setLoading(false);
        }
      } catch (error) {
        handleError(error);
      }
    }

    if (query.length > 0) fetchDataByQuery();
  }, [query.length]);
  const trendingSearches = [
    "Perfume",
    "Bath & Body",
    "Gifting",
    "Crazy Deals",
    "Combos",
  ];

  return (
    <Dialog>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 md:mx-6 lg:mx-auto p-4 sm:p-6 bg-background rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <Button
                  onClick={() => setQuery(search)}
                  key={search}
                  variant={"outline"}
                  size={"sm"}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-sm font-semibold mb-2">
              {query.length > 0 ? "Search Results" : "Recommended for you"}
            </h3>
            {loading && (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin" size={50} />
              </div>
            )}
            <div className="flex space-x-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:space-x-0 sm:gap-2">
              {query.length > 0
                ? products.map((product: any, index: number) => (
                    <Link key={index} href={`/product/${product.slug}?style=0`}>
                      <div className="space-y-2 min-w-[110px] flex-shrink-0 sm:min-w-0">
                        <div className="aspect-square relative">
                          <img
                            src={product.subProducts[0]?.images[0]?.url}
                            alt={product.name}
                            className="absolute inset-0 w-[200px] h-full object-cover rounded-none"
                          />

                          {product.subProducts[0]?.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              {product.subProducts[0]?.discount}% OFF
                            </span>
                          )}
                        </div>
                        <div className="">
                          <h4 className="font-semibold text-sm">
                            {product.name}
                          </h4>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold">
                              ₹{product.subProducts[0]?.sizes[0]?.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹
                              {product.subProducts[0]?.sizes[0]?.price *
                                (1 + product.subProducts[0]?.discount / 100)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                : products.map((product: any, index) => (
                    <Link key={index} href={`/product/${product.slug}?style=0`}>
                      <div className="space-y-2 min-w-[110px] flex-shrink-0 sm:min-w-0">
                        <div className="aspect-square relative">
                          <img
                            src={product.subProducts[0]?.images[0]?.url}
                            alt={product.name}
                            className="absolute inset-0 w-[200px] h-full object-cover rounded-none"
                          />
                          {product.subProducts[0]?.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              {product.subProducts[0].discount}% OFF
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">
                            {product.name}
                          </h4>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold">
                              ₹
                              {product.subProducts[0]?.discount > 0
                                ? (
                                    product.subProducts[0].sizes[0].price -
                                    (product.subProducts[0].sizes[0].price *
                                      product.subProducts[0].discount) /
                                      100
                                  ).toFixed(2)
                                : product.subProducts[0].sizes[0].price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {product.subProducts[0]?.discount > 0 && (
                                <div>
                                  ₹{product.subProducts[0]?.sizes[0]?.price}
                                </div>
                              )}
                              {/* ₹{product.subProducts[0]?.sizes[0]?.price} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
            {query.length > 0 && products.length === 0 && (
              <div>No Results found for "{query}".</div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchModal;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TrackOrderPage = () => {
  const router = useRouter();

  const [orderId, setOrderId] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!orderId.trim() || orderId?.length < 24 || orderId.length > 24) {
      setError("Please enter an invalid order number");
      setLoading(false);
      return;
    }

    try {
      router.push(`/order/${orderId}`);
    } catch (err: any) {
      setError(
        "An error occurred while looking up your order. Please try again later:" +
          err
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-4 sm:p-6 ms:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl sm:text-2xl mb-4 sm:mb-6 text-center tracking-[0.6px]">
          Track Your Order
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order Number
            </label>
            <div className="relative">
              <Input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order number"
                className="pl-10 w-full"
                aria-describedby="orderIdHelp"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <p
              id="orderIdHelp"
              className="mt-1 text-xs sm:text-sm text-gray-500"
            >
              Enter the order number from your confirmation email
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}{" "}
            {loading ? "Searching..." : "Track Order"}
          </Button>
        </form>
        {error && (
          <div
            role="alert"
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;

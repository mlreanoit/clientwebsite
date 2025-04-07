// ISR(CACHE) - 30 MINUTES
import CheckoutPageComponent from "@/components/shared/checkout";
import { ClerkProvider } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Metadata } from "next";
import React, { Suspense } from "react";
export const metadata: Metadata = {
  title: "Secure Checkout | VibeCart",
  description: "Continue with Secure Checkout - Shop with Confidence.",
};

const CheckoutPage = () => {
  return (
    <div>
      <Suspense fallback={<Loader className="animate-spin" />}>
        <ClerkProvider dynamic={true}>
          <CheckoutPageComponent />
        </ClerkProvider>
      </Suspense>
    </div>
  );
};

export default CheckoutPage;

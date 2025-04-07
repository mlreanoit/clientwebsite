// ISR(CACHE) - DISABLED

import MyProfileComponent from "@/components/shared/profile";
import { ClerkProvider } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Metadata } from "next";
import React, { Suspense } from "react";
export const metadata: Metadata = {
  title: "Profile Page | VibeCart",
  description: "View Profile Page.",
};

const ProfilePage = () => {
  return (
    <div>
      <Suspense fallback={<Loader className="animate-spin" />}>
        <ClerkProvider dynamic={true}>
          <MyProfileComponent />
        </ClerkProvider>
      </Suspense>
    </div>
  );
};

export default ProfilePage;

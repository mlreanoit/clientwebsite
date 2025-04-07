import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/Footer";
import MobileBottomBar from "@/components/shared/MobileBottomBar";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import TopBarComponent from "@/components/shared/TopBar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VibeCart - Shop Scents that fits you!",
  description: "Online Shopping Site for to shop scents that fits you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic={false}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TopBarComponent />
          <Navbar />
          {children}
          <MobileBottomBar />
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

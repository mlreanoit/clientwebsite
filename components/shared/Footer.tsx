import { Facebook, Instagram, Youtube, AtSign, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">VIBECART</h2>
          <p className="text-sm">
            8569 Bond Rd, Elk Grove, California, 95624, United States.
          </p>
          <p className="text-sm">contact@vibecart.com</p>
          <p className="text-sm">+(916) 685-5555</p>
          <div className="flex space-x-4">
            <Facebook size={20} />
            <Instagram size={20} />
            <Youtube size={20} />
            <AtSign size={20} />
            <Twitter size={20} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Careers</li>
            <li>Affiliates</li>
            <li>Blog</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">SHOP</h3>
          <ul className="space-y-2 text-sm">
            <li>New Arrivals</li>
            <li>Accessories</li>
            <li>Men</li>
            <li>Women</li>
            <li>All Products</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">HELP</h3>
          <ul className="space-y-2 text-sm">
            <li>Customer Service</li>
            <li>My Account</li>
            <li>Find a Store</li>
            <li>Legal & Privacy</li>
            <li>Gift Card</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">SUBSCRIBE</h3>
          <p className="text-sm">
            Be the first to get the latest news about trends, promotions, new
            arrivals, discounts and more!
          </p>
          <div className="flex">
            <Input
              type="email"
              placeholder="Email Address"
              className="rounded-r-none"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-white text-black hover:bg-gray-200"
            >
              JOIN
            </Button>
          </div>
          <p className="text-sm font-semibold">Secure Payments</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2025 VIBECART</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <span>Language</span>
          <span className="font-semibold">United States | English</span>
          <span>Currency</span>
          <span className="font-semibold">USD</span>
        </div>
      </div>
    </footer>
  );
}

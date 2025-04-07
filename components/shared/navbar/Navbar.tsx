import { RiDiscountPercentFill } from "react-icons/ri";
import { LuStore } from "react-icons/lu";
import { GrLike } from "react-icons/gr";
import { GiPerfumeBottle } from "react-icons/gi";
import { FaBath } from "react-icons/fa";
import { PiHighlighterCircleBold } from "react-icons/pi";
import { MdFace4 } from "react-icons/md";
import Link from "next/link";
import CartDrawer from "./CartDrawer";
import MobileHamBurgerMenu from "./mobile/hamburgerMenu";
import NavbarInput from "./NavbarInput";
import AccountDropDown from "@/components/shared/navbar/AccountDropDown";

const Navbar = () => {
  const navItems = [
    { name: "CRAZY DEALS", icon: <RiDiscountPercentFill size={24} /> },
    { name: "SHOP ALL", icon: <LuStore size={24} /> },
    { name: "BESTSELLERS", icon: <GrLike size={24} /> },
    {
      name: "PERFUMES",
      icon: <GiPerfumeBottle size={24} />,
      hasSubmenu: true,
      submenu: [
        { name: "Men's Perfume" },
        { name: "Women's Perfume" },
        { name: "Unisex Perfume" },
        { name: "New Arrivals" },
      ],
    },
    {
      name: "BATH & BODY",
      icon: <FaBath size={24} />,
      hasSubmenu: true,
      submenu: [
        { name: "Shower Gel" },
        { name: "Body Lotion" },
        { name: "Hand Cream" },
        { name: "Body Scrub" },
      ],
    },
    { name: "MAKEUP", icon: <PiHighlighterCircleBold size={24} /> },
    {
      name: "SKINCARE",
      icon: <MdFace4 size={24} />,
      hasSubmenu: true,
      submenu: [
        { name: "Cleansers" },
        { name: "Moisturizers" },
        { name: "Serums" },
        { name: "Sunscreen" },
      ],
    },
  ];

  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 ">
          <div className="flex items-center lg:w-1/3">
            {/* mobile hamburger menu */}
            <MobileHamBurgerMenu navItems={navItems} />

            {/* TODO: for lg screen */}
            <NavbarInput responsive={false} />
          </div>

          <div className="flex-1 flex items-center justify-center lg:w-1/3">
            <Link href={"/"}>
              {" "}
              <h1 className="text-2xl font-bold">VIBECART</h1>
            </Link>
          </div>

          <div className="flex items-center justify-end lg:w-1/3">
            <div className="">
              {" "}
              <AccountDropDown />
            </div>
            <CartDrawer />
          </div>
        </div>
        {/* TODO: for sm screen */}
        <NavbarInput responsive={true} />
      </div>

      <div className="hidden lg:block border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-evenly py-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 group transition duration-300"
              >
                {item.name}

                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

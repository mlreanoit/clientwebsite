"use client";
import React, { useState } from "react";
import SearchModal from "./SearchModal";
import { Search } from "lucide-react";

const NavbarInput = ({ responsive }: { responsive: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);
  return responsive ? (
    <div className="lg:hidden">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 "
          size={20}
        />
        <input
          type="search"
          placeholder="Search for your favourite products"
          className="pl-10 pr-4 py-1 w-full border-b-2 border-black mb-2"
          onClick={() => setOpen(true)}
        />
      </div>
      {open && <SearchModal setOpen={setOpen} />}
    </div>
  ) : (
    <div className="hidden lg:block w-full max-w-xs">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="search"
          placeholder="Search..."
          onClick={() => setOpen(true)}
          className="pl-10 pr-4 py-2 w-full border-b-2 border-black"
        />
        {open && <SearchModal setOpen={setOpen} />}
      </div>
    </div>
  );
};

export default NavbarInput;

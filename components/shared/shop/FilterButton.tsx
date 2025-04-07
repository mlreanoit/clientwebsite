import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const categories = [
  { name: "Bath & Body", count: 45 },
  { name: "Candles", count: 1 },
  { name: "Cosmetics", count: 8 },
  { name: "Fragrance", count: 73 },
  { name: "Hair Care", count: 2 },
  { name: "Lip Care", count: 3 },
];

const productTypes = [
  { name: "Attar", count: 1 },
  { name: "Attar Set", count: 1 },
  { name: "Body Deo - 150ml", count: 4 },
  { name: "Body Lotion - 200ml", count: 7 },
  { name: "Body Mist - 150ml", count: 4 },
  { name: "Candle Gift set", count: 1 },
];

const availabilityOptions = [
  { name: "In stock", count: 148 },
  { name: "Out of stock", count: 9 },
];
const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2249]);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const FilterContent = () => (
    <div className="p-4 bg-white shadow-lg rounded-lg w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Price Filter */}
        <div>
          <h3 className="font-semibold mb-2">Price</h3>
          <Button
            variant="ghost"
            className="mb-2 p-0 h-auto text-sm font-normal hover:bg-transparent"
          >
            Reset
          </Button>
          <Slider
            defaultValue={[0, 2249]}
            max={2249}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <p className="text-sm">
            Price: ₹{priceRange[0]} - ₹{priceRange[1]}
          </p>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="font-semibold mb-2">Category</h3>
          <Button
            variant="ghost"
            className="mb-2 p-0 h-auto text-sm font-normal hover:bg-transparent"
          >
            Reset
          </Button>
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center space-x-2 mb-2"
            >
              <Checkbox id={`category-${category.name}`} />
              <label
                htmlFor={`category-${category.name}`}
                className="text-sm cursor-pointer"
              >
                {category.name} ({category.count})
              </label>
            </div>
          ))}
        </div>

        {/* Product Type Filter */}
        <div>
          <h3 className="font-semibold mb-2">Product type</h3>
          <Button
            variant="ghost"
            className="mb-2 p-0 h-auto text-sm font-normal hover:bg-transparent"
          >
            Reset
          </Button>
          {productTypes.map((type) => (
            <div key={type.name} className="flex items-center space-x-2 mb-2">
              <Checkbox id={`type-${type.name}`} />
              <label
                htmlFor={`type-${type.name}`}
                className="text-sm cursor-pointer"
              >
                {type.name} ({type.count})
              </label>
            </div>
          ))}
        </div>

        {/* Availability Filter */}
        <div>
          <h3 className="font-semibold mb-2">Availability</h3>
          <Button
            variant="ghost"
            className="mb-2 p-0 h-auto text-sm font-normal hover:bg-transparent"
          >
            Reset
          </Button>
          {availabilityOptions.map((option) => (
            <div key={option.name} className="flex items-center space-x-2 mb-2">
              <Checkbox id={`availability-${option.name}`} />
              <label
                htmlFor={`availability-${option.name}`}
                className="text-sm cursor-pointer"
              >
                {option.name} ({option.count})
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply & Clear buttons */}
      <div className="flex justify-between mt-6">
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => setIsOpen(false)}
        >
          APPLY
        </Button>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Clear
        </Button>
      </div>
    </div>
  );
  return (
    <div className="relative w-full">
      {isMobile ? (
        // Mobile: Use Sheet for the modal behavior
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-black text-white px-4 py-2 flex items-center">
              FILTER <span className="ml-2">+</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop: Use Dialog for modal-like behavior
        <>
          <Button
            className="bg-black text-white px-4 py-2 flex items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            FILTER{" "}
            {isOpen ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[80vw]">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <FilterContent />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default FilterButton;

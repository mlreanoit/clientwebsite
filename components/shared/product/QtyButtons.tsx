"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { quantityState } from "../jotai/store";
import { useAtom, useStore } from "jotai";

const QtyButtons = ({
  product,
  size,
  style,
}: {
  product: any;
  size: number;
  style: number;
}) => {
  const [qty, setQty] = useAtom(quantityState, {
    store: useStore(),
  });
  useEffect(() => {
    setQty(1);
  }, [style]);
  useEffect(() => {
    if (qty > product.quantity) {
      setQty(product.quantity);
    }
  }, [size]);

  return (
    <div>
      <div className="flex items-center gap-0">
        <Button
          onClick={() => qty > 1 && setQty((prev) => prev - 1)}
          variant={"outline"}
          className="bg-[#F2F2F2]"
          size={"icon"}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center border-y-2 py-[6px]">{qty}</span>
        <Button
          onClick={() => qty < product.quantity && setQty((prev) => prev + 1)}
          variant={"outline"}
          className="bg-[#F2F2F2]"
          size={"icon"}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="">
        {product.quantity < 1 && (
          <span className="text-red-500">Out of Stock</span>
        )}
      </div>
    </div>
  );
};

export default QtyButtons;

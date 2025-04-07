"use client";

import { useEffect, useState } from "react";

import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useAtom, useStore } from "jotai";

import { Button } from "@/components/ui/button";
import { cartMenuState } from "./store";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import {
  saveCartForUser,
  updateCartForUser,
} from "@/lib/database/actions/cart.actions";
import { FaArrowCircleRight } from "react-icons/fa";
import { handleError } from "@/lib/utils";
import CartSheetItems from "../cart/CartSheetItems";

const CartDrawer = () => {
  const router = useRouter();
  const { userId } = useAuth();
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, {
    store: useStore(),
  });
  const handleOnClickCartMenu = () => {
    setCartMenuOpen(true);
    console.log("cart", cartMenuOpen);
  };
  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  const cart = useCartStore((state: any) => state.cart.cartItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const update = async () => {
      try {
        await updateCartForUser(cart).then((res) => {
          if (res?.success) {
            updateCartForUser(res?.data);
          } else {
            console.log(res?.message);
          }
        });
      } catch (error) {
        handleError(error);
      }
    };
    if (cart.length > 0) {
      update();
    }
  }, [cart.length > 0]);
  const total = cart.reduce(
    (sum: any, item: any) => sum + parseFloat(item.price) * item.qty,
    0
  );
  const saveCartToDbHandler = async () => {
    if (userId && userId !== null) {
      setLoading(true);

      await saveCartForUser(cart, userId)
        .then((res) => {
          if (res?.success) {
            setLoading(false);
            router.replace("/checkout");
          }
        })
        .catch((err) => console.log(err));
    } else {
      router.push("/sign-in?next=checkout");
    }
  };
  return (
    <div className="relative">
      <Sheet open={cartMenuOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={() => handleOnClickCartMenu()}
            variant={"ghost"}
            size={"icon"}
            className="relative"
          >
            <ShoppingBag size={24} />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
              {cart.length}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle className="subHeading">CART</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex justify-center h-[80vh] items-center">
                <div className="">
                  <h1 className="text-2xl mb-[10px] text-center flex items-center justify-center  font-bold ">
                    {" "}
                    Your Cart is empty
                  </h1>
                  <Link href={"/shop"}>
                    <Button className="flex justify-center items-center w-full gap-[10px]">
                      Shop Now
                      <FaArrowCircleRight />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              cart.map((product: any) => (
                <CartSheetItems product={product} key={product._uid} />
              ))
            )}
          </div>
          <div className="absolute bottom-2 w-[90%] mt-6  bg-white">
            <p className="text-sm text-gray-500">
              Tax included. Shipping calculated at checkout.
            </p>
            <Button
              onClick={() => saveCartToDbHandler()}
              disabled={cart.length === 0}
              className="w-full mt-4 bg-black text-white hover:bg-gray-800 gap-[10px]"
            >
              {loading
                ? "Loading..."
                : `Continue to Secure Checkout - ₹${total}`}
              <FaArrowCircleRight />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;

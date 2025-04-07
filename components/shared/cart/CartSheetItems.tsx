import { useCartStore } from "@/store/cart";
import { Minus, Plus, X } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

const CartSheetItems = ({ product }: { product: any }) => {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  const { updateCart } = useCartStore();
  const cart = useCartStore((state: any) => state.cart.cartItems);

  const updateQty = (type: string) => {
    let newCart = cart.map((p: any) => {
      if (p._uid == product._uid) {
        return {
          ...p,
          qty: type == "plus" ? product.qty + 1 : product.qty - 1,
        };
      }
      return p;
    });
    updateCart(newCart);
    toast.success("Cart updated successfully");
  };
  const removeProduct = (id: string) => {
    let newCart = cart.filter((p: any) => {
      return p._uid != id;
    });
    updateCart(newCart);
    toast.success("Item deleted successfully");
  };

  return (
    <div>
      <div
        key={product._uid}
        className="flex items-start space-x-4 border-b-2 pb-3"
      >
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xs sm:text-sm tracking-wide ">
              {product.name}{" "}
              {product.size && (
                <span className="font-[600]">({product.size})</span>
              )}
            </h3>
            {product.discount > 0 && (
              <span className="text-green-500 text-xs sm:text-sm px-[1px] justify-end">
                -{product.discount}%
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Buy More Save More
          </p>{" "}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <button
                disabled={product.qty < 2}
                onClick={() => updateQty("minus")}
                className=""
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="mx-2">{product.qty}</span>
              <button
                disabled={product.qty == product.quantity}
                onClick={() => updateQty("plus")}
                className="px-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="font-semibold text-xs sm:text-base">
              ₹{product.price}
            </p>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() => removeProduct(product._uid)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSheetItems;

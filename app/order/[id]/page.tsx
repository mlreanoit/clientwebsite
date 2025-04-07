import OrderedProductDetailedView from "@/components/shared/order/OrderProductDeatiledView";
import { Button } from "@/components/ui/button";
import { getOrderDetailsById } from "@/lib/database/actions/order.actions";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ObjectId } from "mongodb";
import { Metadata } from "next";
import IdInvalidError from "@/components/shared/IdInvalidError";
export const metadata: Metadata = {
  title: "Order Page | VibeCart",
  description: "View All of your Order Details.",
};

const OrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  // checking if the ID is valid Object ID
  const id = (await params).id;
  if (!ObjectId.isValid(id)) {
    return <IdInvalidError />;
  }
  const orderData = await getOrderDetailsById(id).catch((err) => {
    toast.error(err);
  });
  if (!orderData?.success) {
    return <IdInvalidError />;
  }
  const date = new Date(orderData?.orderData.createdAt);
  const formattedDate = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto bg-white shadow-md">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Home</span>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold capitalize">
                THANK YOU, {orderData?.orderData.user.username}
              </h1>
              <p className="text-gray-600">
                Order ID: {orderData?.orderData._id}
              </p>
            </div>
            {/* Order Details Section */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 md:w-1/5 p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="font-semibold text-sm mb-1">
                    ORDER NUMBER:
                  </div>
                  <div>{orderData?.orderData._id}</div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
                  <div className="font-semibold text-sm mb-1">DATE:</div>
                  <div>{formattedDate}</div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 p-4 sm:border-r">
                  <div className="font-semibold text-sm mb-1">EMAIL:</div>
                  <div className="truncate">
                    {orderData?.orderData.user.email}
                  </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                  <div className="font-semibold text-sm mb-1">TOTAL:</div>
                  <div>₹{orderData?.orderData.total}</div>
                </div>
              </div>
              <div className="border-t p-4">
                <div className="font-semibold text-sm mb-1">
                  PAYMENT METHOD:
                </div>
                <div>
                  {orderData?.orderData?.paymentMethod === "cod"
                    ? "Cash on Delivery (COD)"
                    :"other method"
                    // : orderData?.orderData.paymentMethod == "stripe" &&
                    //   "Stripe"
                      }
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="w-[50px] h-[50px] text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      Your order is confirmed
                    </h2>
                    <p className="text-gray-600">
                      Order will be delivered to you in 2-3 days on following
                      address
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium capitalize">
                      {orderData?.orderData.user.username}
                    </span>
                    <span className="text-gray-600">
                      {orderData?.orderData.user.address.phoneNumber}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {orderData?.orderData.user.address.address1}
                    <br />
                    {orderData?.orderData.user.address.address2},
                    <br />
                    {orderData?.orderData.user.address.city},
                    <br />
                    ZipCode: {orderData?.orderData.user.address.zipCode},
                    <br />,{orderData?.orderData.user.address.state},
                    <br />
                    {orderData?.orderData.user.address.country},
                    <br />
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">
                      {orderData?.orderData.products.length > 1
                        ? `${orderData?.orderData.products.length} Items`
                        : `${orderData?.orderData.products.length} Item`}
                    </span>
                    <span className="font-medium">
                      ₹ {orderData?.orderData.total}
                    </span>
                  </div>
                  {orderData?.orderData.products.map(
                    (item: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="mr-4 w-[60px] h-[60px]"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.size} • Qty {item.qty}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="font-medium mr-2">
                                ₹{item.price} * {item.qty} = ₹
                                {item.price * item.qty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <OrderedProductDetailedView item={item} />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex-1">
                {orderData?.orderData.totalSaved +
                  (orderData?.orderData.totalBeforeDiscount -
                    orderData?.orderData.total) >
                  0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-green-700">
                        Yay! You have saved ₹
                        {orderData?.orderData.totalSaved +
                          (orderData?.orderData.totalBeforeDiscount -
                            orderData?.orderData.total)}{" "}
                        on this total order.
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total MRP</span>
                      <span>
                        ₹
                        {orderData?.orderData.totalBeforeDiscount +
                          orderData?.orderData.totalSaved}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span>- ₹{orderData?.orderData.totalSaved}</span>
                    </div>
                    {orderData?.orderData.totalBeforeDiscount -
                      orderData?.orderData.total >
                      0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Coupon Discount ({orderData?.orderData.couponApplied})
                        </span>
                        <span>
                          - ₹
                          {orderData?.orderData.totalBeforeDiscount -
                            orderData?.orderData.total}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between font-semibold pt-2 border-t border-t-black">
                      <span>Subtotal</span>
                      <span>₹{orderData?.orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link href={"/"}>
                  <Button className="w-full mt-3">CONTINUE SHOPPING</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

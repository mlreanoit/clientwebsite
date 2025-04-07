import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormStatus } from "react-dom";

const ApplyCouponForm = ({
  setCoupon,
  couponError,
}: {
  setCoupon: any;
  couponError: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
      <div>
        <Label htmlFor="coupon">Coupon Code</Label>
        <Input
          onChange={(e: any) => setCoupon(e.target.value)}
          id="coupon"
          placeholder="Enter coupon code"
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Loading..." : "Apply Coupon"}
      </Button>
      {couponError && <span className={" text-red-500"}>{couponError}</span>}
    </div>
  );
};

export default ApplyCouponForm;

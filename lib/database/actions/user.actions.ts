"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../connect";
import Cart from "../models/cart.model";
import Coupon from "../models/coupon.model";
import Order from "../models/order.model";
import User from "../models/user.model";
import { handleError } from "@/lib/utils";

// create user
export async function createUser(user: any) {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// get user by id
export async function getUserById(clerkId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return {
        message: "User not found with this ID!",
        success: false,
        user: null,
      };
    }
    return {
      message: "Successfully fetched User data.",
      success: true,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    handleError(error);
  }
}

// update user
export async function updateUser(clerkId: string, user: any) {
  try {
    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) {
      return {
        message: "User not found with this ID!",
        success: false,
        user: null,
      };
    }
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// delete user
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    const usertoDelete = await User.findOne({ clerkId });
    if (!usertoDelete) {
      return {
        message: "User not found with this ID!",
        success: false,
        user: null,
      };
    }
    const deletedUser = await User.findByIdAndDelete(usertoDelete._id);
    revalidatePath("/");
    return deletedUser
      ? {
          success: true,
          message: "Successfully deleted User",
          user: JSON.parse(JSON.stringify(deletedUser)),
        }
      : {
          success: false,
          message: "Something went wrong",
          user: null,
        };
  } catch (error) {
    handleError(error);
  }
}

// Address operations of user:
export async function changeActiveAddress(id: any, user_id: any) {
  try {
    await connectToDatabase();
    const user = await User.findById(user_id);
    let user_addresses = user.address;
    let addresses = [];

    for (let i = 0; i < user_addresses.length; i++) {
      let temp_address = {};
      if (user_addresses[i]._id == id) {
        temp_address = { ...user_addresses[i].toObject(), active: true };
        addresses.push(temp_address);
      } else {
        temp_address = { ...user_addresses[i].toObject(), active: false };
        addresses.push(temp_address);
      }
    }
    await user.updateOne(
      {
        address: addresses,
      },
      { new: true }
    );
    return JSON.parse(JSON.stringify({ addresses }));
  } catch (error) {
    handleError(error);
  }
}
export async function deleteAddress(id: any, user_id: any) {
  try {
    await connectToDatabase();
    const user = await User.findById(user_id);
    await user.updateOne(
      {
        $pull: {
          address: { _id: id },
        },
      },
      { new: true }
    );
    return JSON.parse(
      JSON.stringify({
        addresses: user.address.filter((a: any) => a._id != id),
      })
    );
  } catch (error) {
    handleError(error);
  }
}
export async function saveAddress(address: any, user_id: any) {
  try {
    // Find the user by user_id
    const user = await User.findById(user_id);

    if (!user) {
      return "User not found";
    }

    // Check if 'address' property exists and is an array, if not, create it
    if (!user.address || !Array.isArray(user.address)) {
      user.address = [];
    }

    // Use the push method to add the address to the 'address' array
    Object.assign(user.address, address);

    // Save the updated user
    await user.save();
    return JSON.parse(JSON.stringify({ addresses: user.address }));
  } catch (error) {
    handleError(error);
  }
}

// Coupon operations of user:
export async function applyCoupon(coupon: any, user_id: any) {
  try {
    await connectToDatabase();
    const user = await User.findById(user_id);
    const checkCoupon = await Coupon.findOne({ coupon });
    if (!user) {
      return { message: "User not found", success: false };
    }
    if (checkCoupon == null) {
      return { message: "Invalid Coupon", success: false };
    }
    const { cartTotal } = await Cart.findOne({ user: user_id });
    let totalAfterDiscount =
      cartTotal - (cartTotal * checkCoupon.discount) / 100;
    await Cart.findByIdAndUpdate(user._id, { totalAfterDiscount });
    return JSON.parse(
      JSON.stringify({
        totalAfterDiscount: totalAfterDiscount.toFixed(2),
        discount: checkCoupon.discount,
        message: "Successfully fetched Coupon",
        success: true,
      })
    );
  } catch (error) {}
}

// get all orders of user for their profile:
export async function getAllUserOrdersProfile(clerkId: string) {
  try {
    await connectToDatabase();
    let user = await User.findOne({ clerkId });

    let orders = [];
    orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();
    const filteredOrders = orders.map((order) => ({
      id: order._id,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      total: order.total,
    }));

    return JSON.parse(JSON.stringify(filteredOrders));
  } catch (error) {
    console.log(error);
  }
}

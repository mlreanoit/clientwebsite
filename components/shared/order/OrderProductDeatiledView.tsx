"use client";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import React, { useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const OrderedProductDetailedView = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);
  const steps = [
    {
      name: "Not Processed",
      icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
    },
    {
      name: "Processing",
      icon: <ClockIcon className="h-6 w-6 text-blue-400" />,
    },
    {
      name: "Dispatched",
      icon: <TruckIcon className="h-6 w-6 text-indigo-500" />,
    },
    {
      name: "Cancelled",
      icon: <XCircleIcon className="h-6 w-6 text-gray-400" />,
    },
    {
      name: "Completed",
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.name === item.status);
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <div className="relative">
            <span className="flex h-[11px] w-[11px] mr-2">
              <span
                className={`absolute inline-flex h-full w-[10px] animate-ping rounded-full ${
                  item.status === "Not Processed"
                    ? "bg-[#e3503e]"
                    : item.status === "Processing"
                    ? "bg-[#54b7d3]"
                    : item.status === "Dispatched"
                    ? "bg-[#1e91cf]"
                    : item.status === "Cancelled"
                    ? "bg-[#e3d4d4]"
                    : item.status === "Completed"
                    ? "bg-green-500"
                    : ""
                }  opacity-75`}
              ></span>
              <span
                className={`relative inline-flex h-[11px] w-[10px] rounded-full ${
                  item.status === "Not Processed"
                    ? "bg-[#e3503e]"
                    : item.status === "Processing"
                    ? "bg-[#54b7d3]"
                    : item.status === "Dispatched"
                    ? "bg-[#1e91cf]"
                    : item.status === "Cancelled"
                    ? "bg-[#e3d4d4]"
                    : item.status === "Completed"
                    ? "bg-green-500"
                    : ""
                }`}
              ></span>
            </span>
          </div>
          <div className="text-[10px] sm:text-[15px]">{item.status}</div>
        </div>
        {item.status === "Not Processed" && (
          <div className="flex justify-end self-end ">
            <Button className="text-[10px] sm:text-[15px]" variant={"ghost"}>
              Cancel this product
            </Button>
          </div>
        )}
        <Button onClick={() => setOpen(!open)} variant={"ghost"} className="">
          {open ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
        </Button>
      </div>

      {open && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="relative flex items-center">
              <div className="flex space-x-4">
                {steps.map((step, index) => (
                  <div key={step.name} className="flex items-center">
                    <div
                      className={`flex flex-col items-center ${
                        index <= currentStepIndex ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        {step.icon}
                        {index <= currentStepIndex && (
                          <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 animate-ping" />
                        )}
                      </div>
                      <span className="sm:mt-1 sm:text-sm sm:text-gray-600 hidden sm:block">
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 sm:w-8 w-5  ${
                          index < currentStepIndex
                            ? "bg-green-400"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderedProductDetailedView;

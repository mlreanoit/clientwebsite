"use client";
import { getAllTopBars } from "@/lib/database/actions/topbar.actions";
import { handleError } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const TopBarComponent = () => {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    async function fetchBanners() {
      try {
        await getAllTopBars()
          .then((res) => setMessages(res?.topbars))
          .catch((err) => {
            toast.error(err);
            console.log(err);
          });
      } catch (error) {
        handleError(error);
      }
    }
    fetchBanners();
  }, []);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <div className="bg-black text-white py-2 px-4 relative">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {messages.map((message: any, index: number) => (
            <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
              <div className="text-center text-sm sm:text-base">
                {message.title}
                {message.button.title && (
                  <Link href={message.button.link} className="ml-[10px]">
                    <button style={{ color: message.button.color }}>
                      {message.button.title}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
        onClick={scrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TopBarComponent;

"use client";

import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@mantine/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/utils";
import { createProductReview } from "@/lib/database/actions/product.actions";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const ProductReviewComponent = ({
  product,
  rating,
  numofReviews,
  ratings,
}: {
  product: any;
  rating: number;
  numofReviews: number;
  ratings: any;
}) => {
  const numOfReviews = product.numReviews;
  const { user } = useClerk();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [reviews, setReviews] = useState(product.reviews);
  const [sortBy, setSortBy] = useState("Most Recent");
  const form = useForm({
    initialValues: {
      rating: "",
      review: "",
    },
    validate: {
      rating: (value) => (value ? null : "Rating is required."),
      review: (value) =>
        value.trim().length > 0 ? null : "Review cannot be empty.",
    },
  });
  const reviewData = {
    averageRating: rating,
    totalReviews: numOfReviews,
    ratingBreakDown: product.ratingBreakdown,
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!user) return;
      await createProductReview(
        Number(form.values.rating),
        form.values.review,
        user?.id,
        product._id
      )
        .then((res) => {
          setReviews(res.reviews);
          form.setValues({ rating: "", review: "" });
          toast.success("Successfully added product review");
        })
        .catch((err) => alert(err))
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="ownContainer p-4 mt-[20px]">
      <h2 className="heading">Customer Reviews</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(reviewData.averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-xl font-semibold">
              {reviewData.averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Based on {reviewData.totalReviews} reviews
          </p>
          {reviewData.ratingBreakDown.map((rating: any) => (
            <div key={rating.stars} className="flex items-center mb-2">
              <div className="flex items-center w-24">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rating.stars
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 w-12">
                {rating.percentage}%
              </span>
              <span className="ml-2 text-sm text-gray-600 w-12">
                ({rating.count})
              </span>
            </div>
          ))}
          <Link href={`/review/${product.slug}`}>
            <button className="text-sm text-blue-600 mt-2">
              See all reviews
            </button>
          </Link>
        </div>
        <div className="md:w-2/3">
          <div className="flex justify-between mb-4">
            {user ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Leave a Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Your Review</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={form.onSubmit(handleSubmit)}>
                    {/* Rating Select */}
                    <div style={{ marginBottom: "1rem" }}>
                      <Select
                        onValueChange={(value) =>
                          form.setFieldValue("rating", value)
                        }
                        value={form.values.rating}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Rating</SelectLabel>
                            <SelectItem value="1">1 Star</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Review Textarea */}
                    <div style={{ marginBottom: "1rem" }}>
                      <Textarea
                        placeholder="Write your review here"
                        {...form.getInputProps("review")}
                      />
                    </div>

                    {/* Submit Button */}
                    <DialogFooter>
                      <Button type="submit">Submit Review</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button onClick={() => router.push("/sign-in")}>
                {" "}
                Login to add review
              </Button>
            )}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border rounded py-2 px-4 pr-8 leading-tight focus:outline focus:border-blue-500"
              >
                {" "}
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          {product.rating === 0 || product.numofReviews == 0 ? (
            <div className="flex justify-center">No Reviews yet.</div>
          ) : (
            reviews.slice(0, 3).map((i: any, index: number) => {
              console.log(i);
              return (
                <div className="border-t pt-4" key={index}>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold mr-3">
                      {i.reviewBy.username.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2 capitalize ">
                          {i.reviewBy.username}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Verified
                        </span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(i.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg mb-2">{i.review}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewComponent;

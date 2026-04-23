"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { analytics } from "@/lib/analytics";

interface ReviewRow {
  id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={`transition-colors ${
            i <= active
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          } ${!readonly ? "cursor-pointer" : ""}`}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(i)}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-6 text-right text-gray-600">{label}</span>
      <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-gray-400 text-xs">{count}</span>
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    label: String(star),
    count: reviews.filter((r) => r.rating === star).length,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (formRating === 0) {
      setFormError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: formRating,
          title: formTitle,
          comment: formComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        analytics.trackReview(productId, formRating, false, data.error ?? 'unknown');
        setFormError(data.error ?? "Failed to submit review.");
        return;
      }

      analytics.trackReview(productId, formRating, true);
      setSubmitted(true);
      setShowForm(false);
      setFormRating(0);
      setFormTitle("");
      setFormComment("");
      // Refresh review list
      await fetchReviews();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Customer Reviews
        </h2>

        {/* Summary */}
        {reviews.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-5xl font-bold text-gray-900">
                {avgRating.toFixed(1)}
              </span>
              <StarRating value={Math.round(avgRating)} readonly size={18} />
              <span className="text-sm text-gray-500 mt-1">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {distribution.map((d) => (
                <RatingBar
                  key={d.label}
                  label={d.label}
                  count={d.count}
                  total={reviews.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Write a review CTA */}
        {!showForm && (
          <div className="mb-8">
            {submitted && (
              <p className="text-green-600 text-sm mb-4 flex items-center gap-1.5">
                <CheckCircle size={16} />
                Your review has been submitted. Thank you!
              </p>
            )}
            {user ? (
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Write a Review
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                <a href="/login" className="text-gray-900 underline font-medium">
                  Log in
                </a>{" "}
                to leave a review.
              </p>
            )}
          </div>
        )}

        {/* Review form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 p-6 border border-gray-200 rounded-xl bg-gray-50"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Write Your Review
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Rating *
              </label>
              <StarRating value={formRating} onChange={setFormRating} size={28} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Review Title *
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                maxLength={120}
                placeholder="Summarise your experience"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Review *
              </label>
              <textarea
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                maxLength={1500}
                rows={4}
                placeholder="Tell others what you think about this product"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-0.5">
                {formComment.length}/1500
              </p>
            </div>

            {formError && (
              <p className="text-red-600 text-sm mb-4">{formError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Review list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={28} className="animate-spin text-gray-400" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm py-6">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {reviews.map((review) => (
              <li key={review.id} className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating value={review.rating} readonly size={15} />
                      {review.is_verified_purchase && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <CheckCircle size={12} />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {review.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {review.user_name} &middot;{" "}
                      {new Date(review.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

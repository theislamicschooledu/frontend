import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import {
  FiStar,
  FiEdit2,
  FiTrash2,
  FiSend,
  FiX,
  FiCheck,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";

const CourseReview = ({ courseId, userId }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    hoverRating: 0
  });

  // Fetch reviews and user's review
  useEffect(() => {
    if (courseId) {
      fetchReviews();
      fetchMyReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}/reviews?limit=3&sort=newest`);
      if (response.data?.success) {
        setReviews(response.data.data.reviews || []);
        setAverageRating(response.data.data.summary?.averageRating || 0);
        setRatingCount(response.data.data.summary?.ratingCount || 0);
        setRatingDistribution(response.data.data.summary?.ratingDistribution || {});
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/my-review`);
      if (response.data?.success) {
        setMyReview(response.data.data.review);
        if (response.data.data.review) {
          setFormData({
            rating: response.data.data.review.rating,
            comment: response.data.data.review.comment || "",
            hoverRating: response.data.data.review.rating
          });
        }
      }
    } catch (error) {
      console.error("Error fetching my review:", error);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating, hoverRating: rating }));
  };

  const handleRatingHover = (rating) => {
    setFormData(prev => ({ ...prev, hoverRating: rating }));
  };

  const handleRatingLeave = () => {
    setFormData(prev => ({ ...prev, hoverRating: prev.rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.rating) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      if (myReview) {
        // Update existing review
        const response = await api.put(
          `/courses/${courseId}/reviews/${myReview._id}`,
          { rating: formData.rating, comment: formData.comment }
        );
        if (response.data?.success) {
          toast.success("Review updated successfully");
          setMyReview(response.data.data.review);
          fetchReviews();
          setShowReviewModal(false);
        }
      } else {
        // Add new review
        const response = await api.post(
          `/courses/${courseId}/reviews`,
          { rating: formData.rating, comment: formData.comment }
        );
        if (response.data?.success) {
          toast.success("Review submitted successfully");
          setMyReview(response.data.data.review);
          fetchReviews();
          setShowReviewModal(false);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    
    setDeleting(true);
    try {
      const response = await api.delete(
        `/courses/${courseId}/reviews/${myReview._id}`
      );
      if (response.data?.success) {
        toast.success("Review deleted successfully");
        setMyReview(null);
        setFormData({ rating: 0, comment: "", hoverRating: 0 });
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const renderStars = (rating, size = "text-lg") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            } ${size} mx-0.5`}
          />
        ))}
      </div>
    );
  };

  const calculateRatingPercentage = (rating) => {
    if (ratingCount === 0) return 0;
    return Math.round((ratingDistribution[rating] || 0) / ratingCount * 100);
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="mt-8">
      {/* Review Summary Card */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl text-center font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Course Rating
            </h3>
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="text-center">
                <div className="text-5xl font-bold text-white">{averageRating.toFixed(1)}</div>
                <div className="flex items-center justify-center mt-1">
                  {renderStars(Math.round(averageRating), "text-xl")}
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <div className="w-10 text-right text-gray-300">{star}</div>
                    <FiStar className="text-yellow-400" />
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                        style={{ width: `${calculateRatingPercentage(star)}%` }}
                      />
                    </div>
                    <div className="w-10 text-left text-gray-400 text-sm">
                      {calculateRatingPercentage(star)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-64">
            <h4 className="text-lg font-semibold text-white mb-4">Share Your Experience</h4>
            <p className="text-gray-300 text-sm mb-4">
              Rate this course and help other students make their decision.
            </p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {myReview ? (
                <>
                  <FiEdit2 /> Edit Your Review
                </>
              ) : (
                <>
                  <FiStar /> Add Your Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Student Reviews</h3>
            {reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
              >
                {showAllReviews ? (
                  <>
                    Show Less <FiChevronUp />
                  </>
                ) : (
                  <>
                    Show All Reviews <FiChevronDown />
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {review.user?.name || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiCalendar className="text-xs" />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  {review.comment && (
                    <div className="mt-3">
                      <div className="flex items-start gap-2">
                        <FiMessageSquare className="text-gray-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-300 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {review.user?._id === userId && (
                    <div className="mt-4 pt-4 border-t border-gray-700/30 flex justify-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormData({
                              rating: review.rating,
                              comment: review.comment || "",
                              hoverRating: review.rating
                            });
                            setShowReviewModal(true);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={handleDeleteReview}
                          disabled={deleting}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          {deleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FiTrash2 /> Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {myReview ? "Edit Your Review" : "Rate This Course"}
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="text-xl text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-3">Your Rating</label>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        onMouseLeave={handleRatingLeave}
                        className="transition-transform hover:scale-125"
                      >
                        <FiStar
                          className={`text-4xl ${
                            star <= formData.hoverRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-gray-400 text-sm">
                    {formData.rating === 0
                      ? "Select a rating"
                      : `${formData.rating} star${formData.rating > 1 ? "s" : ""}`}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-3">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this course..."
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                    maxLength="1000"
                  />
                  <div className="text-right text-gray-400 text-sm mt-1">
                    {formData.comment.length}/1000
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.rating || submitting}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSend /> {myReview ? "Update Review" : "Submit Review"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && reviews.length === 0 && !myReview && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl text-center">
          <FiStar className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Be the first to share your experience with this course!
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <FiStar /> Be the First Reviewer
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseReview;
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import CourseCard from "./CourseCard";

const FeaturedCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/courses/featuredCourse");
      if (res.data.success) {
        setCourses(res.data.courses || []);
      } else {
        setError("Failed to load courses");
        toast.error("Failed to load featured courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load courses"
      );
      // Toast শুধু গুরুতর এরর এর জন্য দেখাতে পারেন, অথবা বাদ দিতে পারেন
      if (!error?.response?.status || error.response.status >= 500) {
        toast.error(
          error?.response?.data?.message ||
            "Network error. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Unable to load featured courses</p>
        <button
          onClick={fetchCourses}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ডাটা নেই এমন স্টেট
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured courses available at the moment</p>
        <p className="text-gray-400 text-sm mt-2">
          Check back later for new courses
        </p>
      </div>
    );
  }

  // সফলভাবে ডাটা লোড হয়েছে
  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 font-hind">
        {courses.map((course, index) => (
          <CourseCard course={course} key={course._id || course.id || index} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCourses;
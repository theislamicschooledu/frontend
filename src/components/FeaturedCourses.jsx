import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios";
import CourseCard from "./CourseCard";
import { useLanguage } from "../hooks/useLanguage";

const FeaturedCourses = () => {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/courses/featured");
      if (res.data.success) {
        setCourses(res.data.data || []);
      } else {
        setError(true);
        toast.error(t("home.courses.featuredLoadFailed"));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(true);
      if (!error?.response?.status || error.response.status >= 500) {
        toast.error(
          error?.response?.data?.message || t("home.courses.networkError"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{t("home.courses.unableToLoad")}</p>
        <button
          onClick={fetchCourses}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {t("common.tryAgain")}
        </button>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t("home.courses.noCourses")}</p>
        <p className="text-gray-400 text-sm mt-2">
          {t("home.courses.checkLater")}
        </p>
      </div>
    );
  }

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

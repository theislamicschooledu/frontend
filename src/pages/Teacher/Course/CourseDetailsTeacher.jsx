import { useCallback, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiBookOpen,
  FiUsers,
  FiStar,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiEye,
  FiPlus,
  FiVideo,
  FiFile,
  FiPlay,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiCheck,
  FiCalendar,
  FiInfo
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../utils/axios";
import ConfirmModal from "../../../components/ConfirmModal";

const CourseDetailsTeacher = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [expandedLectures, setExpandedLectures] = useState({});

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/courses/teacher/courses/${id}`); // API endpoint আপডেট

      if (data) {
        // ব্যাকএন্ড থেকে আসা ডেটা সেট করা
        setCourse(data.course || data.data || data);
      } else if (data.success) {
        // যদি API success true ফরম্যাটে ডেটা দেয়
        setCourse(data.course || data.data || data);
      }
    } catch (err) {
      toast.error("Failed to load course details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchLectures = useCallback(async () => {
    try {
      setLecturesLoading(true);
      const { data } = await api.get(`/courses/lectures/course/${id}`);

      if (data.success) {
        setLectures(data.lectures || data.data || []);

        // Initialize expanded state for all lectures
        const initialExpandedState = {};
        (data.lectures || data.data || []).forEach((lecture) => {
          initialExpandedState[lecture._id] = false;
        });
        setExpandedLectures(initialExpandedState);
      }
    } catch (error) {
      toast.error("Failed to load lectures");
      console.error(error);
    } finally {
      setLecturesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetails();
    fetchLectures();
  }, [fetchCourseDetails, fetchLectures]);

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      const { data } = await api.delete(`/courses/lectures/${lectureId}`);
      if (data.success) {
        toast.success("✅ Lecture deleted successfully!");
        setLectures((prev) =>
          prev.filter((lecture) => lecture._id !== lectureId)
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete lecture");
    }
  };

  const handleDeleteResource = async (lectureId, resourceId) => {
    try {
      const { data } = await api.delete(
        `/courses/lectures/${lectureId}/resources/${resourceId}`
      );
      if (data.success) {
        toast.success("✅ Resource deleted successfully!");
        setLectures((prev) =>
          prev.map((lecture) =>
            lecture._id === lectureId
              ? {
                  ...lecture,
                  resources: lecture.resources.filter(
                    (resource) => resource._id !== resourceId
                  ),
                }
              : lecture
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete resource");
    }
  };

  const getStatusBadge = (status, featured, isUpcoming = false) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium text-white inline-block mr-2 mb-1";

    const badges = [];

    // Featured badge
    if (featured) {
      badges.push(
        <span key="featured" className={`${baseClasses} bg-amber-500`}>
          Featured
        </span>
      );
    }

    // Upcoming badge (if true)
    if (isUpcoming) {
      badges.push(
        <span key="upcoming" className={`${baseClasses} bg-blue-500`}>
          Upcoming
        </span>
      );
    }

    // Status badge
    switch (status) {
      case "published":
        badges.push(
          <span key="published" className={`${baseClasses} bg-green-500`}>
            Published
          </span>
        );
        break;
      case "pending":
        badges.push(
          <span key="pending" className={`${baseClasses} bg-yellow-500`}>
            Pending
          </span>
        );
        break;
      case "rejected":
        badges.push(
          <span key="rejected" className={`${baseClasses} bg-red-500`}>
            Rejected
          </span>
        );
        break;
      default:
        badges.push(
          <span key="default" className={`${baseClasses} bg-gray-500`}>
            {status || "Unknown"}
          </span>
        );
    }

    return <div className="flex flex-wrap items-center">{badges}</div>;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Set";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Check if course is upcoming (ব্যাকএন্ডের isUpcoming field ব্যবহার করে)
  const isUpcomingCourse = course?.isUpcoming === true;

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FiBookOpen className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Course not found
          </h3>
          <p className="text-gray-500 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Link
            to="/teacher/courses"
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/teacher/courses"
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Courses
          </Link>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {/* Teacher সবসময় edit করতে পারবে যদি status published না হয় অথবা upcoming হয় */}
          {(course.status !== "published" || isUpcomingCourse) && (
            <Link
              to={`/teacher/courses/update/${course._id}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <FiEdit className="mr-2" />
              Edit Course
            </Link>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
        <p className="text-gray-600">Course details and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Thumbnail */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                  <FiBookOpen className="text-4xl text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                {getStatusBadge(course.status, course.featured, course.isUpcoming)}
              </div>
            </div>
          </div>

          {/* Upcoming Info Banner */}
          {isUpcomingCourse && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-3">
                <FiInfo className="text-blue-500 text-xl mt-1 shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 text-lg mb-2">
                    Upcoming Course
                  </h3>
                  <p className="text-blue-700 mb-3">
                    This course is marked as "Upcoming". Students will see an "Upcoming" badge and can express interest.
                  </p>
                  <Link
                    to={`/teacher/courses/update/${course._id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm"
                  >
                    Add Dates & Publish
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Course Description */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Description
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html: course.description,
              }}
            />
          </div>

          {/* Course Features */}
          {course.features && course.features.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiCheck className="text-green-600" />
                Course Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheck className="text-green-600 text-sm" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Lectures Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiVideo className="text-green-600" />
                Course Lectures
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {lectures.length} lectures
                </span>
              </h2>
              <Link
                to={`/teacher/courses/${course._id}/AddLecture`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <FiPlus size={16} />
                Add Lecture
              </Link>
            </div>

            {lecturesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading lectures...</p>
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-8">
                <FiVideo className="text-4xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Lectures Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding lectures to this course.
                </p>
                <Link
                  to={`/teacher/courses/${course._id}/AddLecture`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  <FiPlus size={16} />
                  Create First Lecture
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lectures.map((lecture, index) => (
                  <motion.div
                    key={lecture._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    {/* Lecture Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                      onClick={() => toggleLecture(lecture._id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {lecture.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <FiVideo size={14} />
                              <span>Video Lecture</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiFile size={14} />
                              <span>
                                {lecture.resources?.length || 0} resources
                              </span>
                            </div>
                            <span>
                              {new Date(lecture.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/teacher/courses/${course._id}/lectures/edit/${lecture._id}`}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiEdit3 size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLecture(lecture._id);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                        {expandedLectures[lecture._id] ? (
                          <FiChevronUp className="text-gray-500 ml-2" />
                        ) : (
                          <FiChevronDown className="text-gray-500 ml-2" />
                        )}
                      </div>
                    </div>

                    {/* Lecture Content - Collapsible */}
                    <AnimatePresence>
                      {expandedLectures[lecture._id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border-t border-gray-200">
                            {/* Video Section */}
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                <FiPlay className="text-green-600" />
                                Video Content
                              </h4>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FiVideo className="text-gray-500" />
                                  <span className="text-sm text-gray-700">
                                    Video URL
                                  </span>
                                </div>
                                <a
                                  href={lecture.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                >
                                  <FiPlay size={14} />
                                  Watch Video
                                </a>
                              </div>
                            </div>

                            {/* Resources Section */}
                            {lecture.resources &&
                              lecture.resources.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <FiFile className="text-blue-600" />
                                    Resources ({lecture.resources.length})
                                  </h4>
                                  <div className="space-y-2">
                                    {lecture.resources.map((resource) => (
                                      <div
                                        key={resource._id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                      >
                                        <div className="flex items-center gap-3">
                                          <FiFile className="text-gray-500" />
                                          <span className="text-sm text-gray-700">
                                            {resource.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={resource.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                          >
                                            <FiDownload size={14} />
                                            Download
                                          </a>
                                          <button
                                            onClick={() =>
                                              handleDeleteResource(
                                                lecture._id,
                                                resource._id
                                              )
                                            }
                                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                                          >
                                            <FiTrash2 size={14} />
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Teachers Section */}
          {course.teachers && course.teachers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChalkboardTeacher />
                Instructors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.teachers.map((teacher, index) => (
                  <motion.div
                    key={teacher._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {teacher.avatar ? (
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <FaChalkboardTeacher className="text-green-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {teacher.role || "Instructor"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Course Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUsers className="text-blue-600" />
                  </div>
                  <span className="text-gray-700">Students Enrolled</span>
                </div>
                <span className="font-bold text-gray-800">
                  {course.studentCount || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiList className="text-green-600" />
                  </div>
                  <span className="text-gray-700">Lectures</span>
                </div>
                <span className="font-bold text-gray-800">
                  {lectures.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FiStar className="text-amber-600" />
                  </div>
                  <span className="text-gray-700">Rating</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">
                    {course.averageRating?.toFixed(1) || 0}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    ({course.ratingCount || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiClock className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">Duration</span>
                </div>
                <span className="font-bold text-gray-800">
                  {course.duration || "N/A"} hours
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FiDollarSign className="text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Price</span>
                </div>
                <span className="font-bold text-gray-800">
                  ${course.price || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Course Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <p className="font-medium text-gray-800">
                  {course.category?.name || "Uncategorized"}
                </p>
              </div>
              
              {/* Dates Section with Upcoming Indicator */}
              {isUpcomingCourse ? (
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FiInfo className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-800">
                      Upcoming Course
                    </span>
                  </div>
                  {course.enrollmentStart || course.enrollmentEnd || course.courseStart ? (
                    <>
                      <p className="text-sm text-blue-700 mb-1">
                        Tentative Dates:
                      </p>
                      {course.enrollmentStart && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Enrollment Start:</span> {formatDate(course.enrollmentStart)}
                        </p>
                      )}
                      {course.enrollmentEnd && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Enrollment End:</span> {formatDate(course.enrollmentEnd)}
                        </p>
                      )}
                      {course.courseStart && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Course Start:</span> {formatDate(course.courseStart)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-blue-600">
                      Dates not set. Course is marked as "Upcoming".
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-sm text-gray-600">Enrollment Start</span>
                    <p className="font-medium text-gray-800">
                      {formatDate(course.enrollmentStart)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Enrollment End</span>
                    <p className="font-medium text-gray-800">
                      {formatDate(course.enrollmentEnd)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Course Start</span>
                    <p className="font-medium text-gray-800">
                      {formatDate(course.courseStart)}
                    </p>
                  </div>
                </>
              )}
              
              <div>
                <span className="text-sm text-gray-600">Created</span>
                <p className="font-medium text-gray-800">
                  {formatDate(course.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Updated</span>
                <p className="font-medium text-gray-800">
                  {formatDate(course.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to={`/teacher/courses/${course._id}/AddLecture`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <FiPlus />
                Add Lecture
              </Link>
              
              {isUpcomingCourse && (
                <Link
                  to={`/teacher/courses/update/${course._id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <FiCalendar />
                  Add Dates & Publish
                </Link>
              )}

              <Link
                to={`/course/${course._id}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
              >
                <FiEye />
                View Live Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetailsTeacher;
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUsers,
  FiBook,
  FiBarChart2,
  FiDollarSign,
  FiUserCheck,
  FiStar,
  FiEdit,
  FiPlus,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";
import { ImBlog } from "react-icons/im";
import { MdOutlineQuestionMark } from "react-icons/md";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router";

const TeacherDashboard = () => {
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [courses, setCourses] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/auth/users");
      const count = res.data.userCount;
      setTotalStudent(count.totalStudent);
      setTotalTeacher(count.totalTeacher);
    };

    const fetchCourses = async () => {
      const res = await api.get("/courses/teacherCourses");

      setTotalCourses(res.data.data.length);
      const sliceCourse = res.data.data.slice(0, 5);
      setCourses(sliceCourse);
    };

    const fetchBlogs = async () => {
      const res = await api.get("/blogs/my-blogs");      

      setTotalBlogs(res.data.length);
      const sliceBlog = res.data.slice(0, 5);
      setBlogs(sliceBlog);
    };

    const fetchQuestions = async () => {
      const res = await api.get("/qna");
      const sliceQuestion = res.data.questions.slice(0, 5);
      setQuestions(sliceQuestion);
    };

    fetchUser();
    fetchCourses();
    fetchBlogs();
    fetchQuestions();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: totalStudent,
      icon: FiUsers,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      icon: FiBook,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      title: "Active Teachers",
      value: totalTeacher,
      icon: FiUserCheck,
      color: "from-purple-500 to-fuchsia-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
    },
    {
      title: "Total Blogs",
      value: totalBlogs,
      icon: ImBlog,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      title: "Total Questions",
      value: totalBlogs,
      icon: MdOutlineQuestionMark,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
  ];

  const statusColors = {
    published: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    featured: "bg-amber-100 text-amber-700 border border-amber-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, Teacher! Here's what's happening today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${stat.bgColor} border border-gray-100`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
            ></div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Recent Blogs
              </h2>
              <Link
                to={"/teacher/blogs"}
                className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                View All
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {blogs?.map((blog) => (
              <Link
                to={`/teacher/blogs/${blog._id}`}
                key={blog._id}
                className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-emerald-100"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-700">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(blog.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[blog.status] || statusColors.default
                  } flex-shrink-0 ml-2`}
                >
                  {blog.status}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
        {/* Recent Questions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Recent Questions
              </h2>
              <Link
                to={"/teacher/questions"}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View All
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {questions?.map((question) => (
              <Link
                to={`/teacher/questions/${question._id}`}
                key={question._id}
                className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-blue-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-blue-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                    {question.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(question.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[question.status] || statusColors.default
                  } flex-shrink-0 ml-3`}
                >
                  {question.status}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Course Performance
              </h2>
              <Link
                to={"/teacher/courses"}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1 transition-colors"
              >
                View All
                <FiChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {courses?.map((course, i) => (
              <Link to={`/teacher/courses/${course._id}`}
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-purple-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-purple-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                    {course.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span>{course.averageRating || 0}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      {course.studentCount || 0} students
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[course.status] || statusColors.default
                  } flex-shrink-0 ml-3`}
                >
                  {course.status}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Create Blog",
            icon: FiBarChart2,
            actionIcon: FiTrendingUp,
            gradient: "from-purple-500 to-fuchsia-500",
            description: "Publish your thought and experience",
            to: "/teacher/blogs/add",
          },
        ].map((card, idx) => (
          <Link to={card.to} key={idx}>
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden bg-gradient-to-r ${card.gradient} text-white rounded-2xl shadow-lg p-6 cursor-pointer group hover:shadow-xl transition-all duration-300`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <card.icon size={28} className="opacity-90" />
                  <card.actionIcon
                    size={20}
                    className="opacity-80 group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </div>
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </main>
  );
};

export default TeacherDashboard;

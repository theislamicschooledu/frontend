import "quill/dist/quill.snow.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";

import ErrorPage from "./components/ErrorPage";
import AdminLayout from "./layout/AdminLayout";
import Main from "./layout/Main";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddBlog from "./pages/Admin/Blogs/AddBlog";
import AddBlogCategory from "./pages/Admin/Blogs/AddBlogCategory";
import BlogDetails from "./pages/Admin/Blogs/BlogDetails";
import BlogsAdmin from "./pages/Admin/Blogs/BlogsAdmin";
import UpdateBlog from "./pages/Admin/Blogs/UpdateBlog";
import CoursesAdmin from "./pages/Admin/Course/CoursesAdmin";
import AddQuestionCategory from "./pages/Admin/QnA/AddQuestionCategory";
import QnaAdmin from "./pages/Admin/QnA/QnaAdmin";
import QuestionDetailsAdmin from "./pages/Admin/QnA/QuestionDetailsAdmin";
import UserDetails from "./pages/Admin/User/UserDetails";
import Users from "./pages/Admin/User/Users";
import AskQuestion from "./pages/AskQuestion";
import ChangePassword from "./pages/Auth/ChangePassword";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Auth/Profile";
import ResetPassword from "./pages/Auth/ResetPassword";
import SignUp from "./pages/Auth/SignUp";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import QnA from "./pages/QnA";
import UpdateQuestion from "./pages/UpdateQuestion";
import AdminOnlyRoute from "./routes/AdminOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Question from "./pages/Question";
import AddCourse from "./pages/Admin/Course/AddCourse";
import AddCourseCategory from "./pages/Admin/Course/AddCourseCategory";
import CourseDetailsAdmin from "./pages/Admin/Course/CourseDetailsAdmin";
import UpdateCourse from "./pages/Admin/Course/UpdateCourse";
import AddLecture from "./pages/Admin/Course/AddLecture";
import UpdateLecture from "./pages/Admin/Course/UpdateLecture";
import CourseCoupons from "./pages/Admin/Course/CourseCoupons";
import AddCoupon from "./pages/Admin/Course/AddCoupon";
import EditCoupon from "./pages/Admin/Course/EditCoupon";
import CourseDetails from "./pages/CourseDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import MyCourses from "./pages/MyCourses";
import LearningPage from "./pages/LearningPage";
import TeacherOnlyRoute from "./routes/TeacherOnlyRoute";
import BlogsTeacher from "./pages/Teacher/Blogs/BlogsTeacher";
import BlogDetailsTeacher from "./pages/Teacher/Blogs/BlogDetailsTeacher";
import QnaTeacher from "./pages/Teacher/QnA/QnATeacher";
import QuestionDetailsTeacher from "./pages/Teacher/QnA/QuestionDetailsTeacher";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import CoursesTeacher from "./pages/Teacher/Course/CoursesTeacher";
import CourseDetailsTeacher from "./pages/Teacher/Course/CourseDetailsTeacher";
import AboutUs from "./pages/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <SignUp /> },
          { path: "/verify-otp", element: <VerifyOtp /> },
        ],
      },
      { path: "/courses", element: <Courses /> },
      { path: "/course/:id", element: <CourseDetails /> },
      { path: "/blogs", element: <Blogs /> },
      { path: "/blogs/:id", element: <Blog /> },
      { path: "/qa", element: <QnA /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/forget-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/change-password", element: <ChangePassword /> },
          { path: "qa/ask-question", element: <AskQuestion /> },
          { path: "qa/:id", element: <Question /> },
          { path: "qa/update/:id", element: <UpdateQuestion /> },
          // Payment
          { path: "/payment/success", element: <PaymentSuccess /> },
          { path: "/payment/cancel", element: <PaymentCancel /> },
          { path: "/my-courses", element: <MyCourses /> },
          { path: "/learn/:courseId", element: <LearningPage /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminOnlyRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "", element: <AdminDashboard /> },
              // User
              { path: "users", element: <Users /> },
              { path: "users/:id", element: <UserDetails /> },
              // Course
              { path: "courses", element: <CoursesAdmin /> },
              { path: "courses/add", element: <AddCourse /> },
              { path: "courses/category", element: <AddCourseCategory /> },
              { path: "courses/:id", element: <CourseDetailsAdmin /> },
              { path: "courses/update/:id", element: <UpdateCourse /> },
              { path: "courses/:courseId/AddLecture", element: <AddLecture /> },
              {
                path: "courses/:courseId/lectures/edit/:lectureId",
                element: <UpdateLecture />,
              },
              { path: "courses/:courseId/coupons", element: <CourseCoupons /> },
              { path: "courses/:courseId/coupons/add", element: <AddCoupon /> },
              {
                path: "courses/:courseId/coupons/edit/:couponId",
                element: <EditCoupon />,
              },
              // Blog
              { path: "blogs", element: <BlogsAdmin /> },
              { path: "blogs/add", element: <AddBlog /> },
              { path: "blogs/category", element: <AddBlogCategory /> },
              { path: "blogs/:id", element: <BlogDetails /> },
              { path: "blogs/update/:id", element: <UpdateBlog /> },
              // Question
              { path: "questions", element: <QnaAdmin /> },
              { path: "questions/category", element: <AddQuestionCategory /> },
              { path: "questions/:id", element: <QuestionDetailsAdmin /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/teacher",
    element: <ProtectedRoute />,
    children: [
      {
        element: <TeacherOnlyRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "", element: <TeacherDashboard /> },
              // Course
              { path: "courses", element: <CoursesTeacher /> },
              { path: "courses/:id", element: <CourseDetailsTeacher /> },
              { path: "courses/:courseId/AddLecture", element: <AddLecture /> },
              {
                path: "courses/:courseId/lectures/edit/:lectureId",
                element: <UpdateLecture />,
              },
              // Blog
              { path: "blogs", element: <BlogsTeacher /> },
              { path: "blogs/add", element: <AddBlog /> },
              { path: "blogs/:id", element: <BlogDetailsTeacher /> },
              { path: "blogs/update/:id", element: <UpdateBlog /> },
              // Question
              { path: "questions", element: <QnaTeacher /> },
              { path: "questions/category", element: <AddQuestionCategory /> },
              { path: "questions/:id", element: <QuestionDetailsTeacher /> },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  </React.StrictMode>
);

import {
  FaGauge,
  FaUsers,
  FaBookOpen,
  FaNewspaper,
  FaCircleQuestion,
  FaBook,
} from "react-icons/fa6";

export const Nav_Item = [
  { path: "/", label: "হোম" },
  { path: "/courses", label: "কোর্স সমুহ" },
  { path: "/blogs", label: "ব্লগ সমুহ" },
  { path: "/qa", label: "প্রশ্নোত্তর" },
  { path: "/about", label: "আমাদের সম্পর্কে" },
];

export const admin_nav_item = [
  { id: "dashboard", label: "ড্যাশবোর্ড", path: "/admin", icon: FaGauge },
  { id: "users", label: "সকল ইউজার", path: "/admin/users", icon: FaUsers },
  {
    id: "courses",
    label: "কোর্স সমুহ",
    path: "/admin/courses",
    icon: FaBookOpen,
  },
  { id: "blogs", label: "ব্লগ সমুহ", path: "/admin/blogs", icon: FaNewspaper },
  {
    id: "questions",
    label: "প্রশ্ন সমুহ",
    path: "/admin/questions",
    icon: FaCircleQuestion,
  },
];

export const teacher_nav_item = [
  { id: "dashboard", label: "ড্যাশবোর্ড", path: "/teacher", icon: FaGauge },
  {
    id: "courses",
    label: "কোর্স সমুহ",
    path: "/teacher/courses",
    icon: FaBook,
  },
  {
    id: "blogs",
    label: "ব্লগ সমুহ",
    path: "/teacher/blogs",
    icon: FaNewspaper,
  },
  {
    id: "প্রশ্ন সমুহ",
    label: "Questions",
    path: "/teacher/questions",
    icon: FaCircleQuestion,
  },
];

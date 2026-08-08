import {
  FaGauge,
  FaUsers,
  FaBookOpen,
  FaNewspaper,
  FaCircleQuestion,
  FaBook,
  FaPenFancy,
} from "react-icons/fa6";

export const Nav_Item = [
  {
    id: "home",
    path: "/",
    labelKey: "nav.home",
  },

  {
    id: "courses",
    path: "/courses",
    labelKey: "nav.courses",
  },

  {
    id: "instructors",
    path: "/instructors",
    labelKey: "nav.instructors",
  },

  {
    id: "about",
    path: "/about",
    labelKey: "nav.about",
  },

  {
    id: "blogs",
    path: "/blogs",
    labelKey: "nav.blogs",
  },

  {
    id: "qna",
    path: "/qa",
    labelKey: "nav.qna",
  },
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
  {
    id: "enrollment",
    label: "কোর্স ইনরোলমেন্ট",
    path: "/admin/enrollment",
    icon: FaPenFancy,
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

import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";

export const Nav_Item = [
  { path: "/", label: "Home" },
  { path: "/courses", label: "Courses" },
  { path: "/blogs", label: "Blogs" },
  { path: "/qa", label: "Question" },
];

export const admin_nav_item = [
  { id: "dashboard", label: "Dashboard", icon: FiHome, path: "/admin" },
  { id: "users", label: "All Users", icon: FiUsers, path: "/admin/users" },
  { id: "courses", label: "Courses", icon: FiBook, path: "/admin/courses" },
  { id: "blogs", label: "Blogs", icon: FiCalendar, path: "/admin/blogs" },
  {
    id: "questions",
    label: "Questions",
    icon: FiMessageSquare,
    path: "/admin/questions",
  }
];

export const teacher_nav_item = [
  { id: "dashboard", label: "Dashboard", icon: FiHome, path: "/teacher" },
  { id: "courses", label: "Courses", icon: FiBook, path: "/teacher/courses" },
  { id: "blogs", label: "Blogs", icon: FiCalendar, path: "/teacher/blogs" },
  {
    id: "questions",
    label: "Questions",
    icon: FiMessageSquare,
    path: "/teacher/questions",
  },
];

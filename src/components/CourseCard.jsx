// import React from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import {
//   FiBook,
//   FiBookOpen,
//   FiClock,
//   FiEye,
//   FiHeart,
//   FiStar,
// } from "react-icons/fi";
// import { FaChalkboardTeacher } from "react-icons/fa";
// import { Link } from "react-router";

// const stripHtml = (html) => (html ? String(html).replace(/<[^>]*>/g, "") : "");

// const formatPrice = (val) =>
//   val || val === 0 ? Number(val).toLocaleString() : "0";

// const CourseCard = ({ course, index }) => {
//   const getTimeRemaining = (enrollmentEnd) => {
//     if (!enrollmentEnd) return "No deadline";
//     const now = new Date();
//     const end = new Date(enrollmentEnd);
//     const diff = end - now;
//     if (Number.isNaN(diff)) return "Invalid date";
//     if (diff <= 0) return "Enrollment Closed";
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
//     const minutes = Math.floor(diff / (1000 * 60));
//     return `${minutes} min left`;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.05 }}
//       whileHover={{ y: -8, scale: 1.02 }}
//       className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 font-hind"
//       role="article"
//     >
//       <div className="relative h-52 overflow-hidden">
//         {course.thumbnail ? (
//           <img
//             src={course.thumbnail}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
//             <FiBookOpen className="text-4xl text-white opacity-80" />
//           </div>
//         )}

//         {/* Overlay gradient */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col gap-2">
//           <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
//             {getTimeRemaining(course.enrollmentEnd)}
//           </div>
//           <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold">
//             {course.category?.name || "Uncategorized"}
//           </div>
//         </div>

//         {/* Wishlist button */}
//         <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-gray-600 hover:text-red-500 transition-all duration-300 hover:scale-110 shadow-lg">
//           <FiHeart size={18} />
//         </button>

//         {/* Rating overlay */}
//         <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
//           <FiStar className="text-yellow-400" />
//           <span>{course.averageRating?.toFixed(1) || "0.0"}</span>
//         </div>
//       </div>

//       <div className="p-6">
//         <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
//           {course.title}
//         </h3>

//         <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
//           {stripHtml(course.description) || "No description available"}
//         </p>

//         {/* Course stats */}
//         <div className="flex items-center justify-between mb-4 text-sm text-gray-500 bg-gray-50 rounded-2xl px-4 py-3">
//           <div className="flex items-center gap-1">
//             <FiClock className="text-blue-500" size={16} />
//             <span className="font-medium">{course.duration ?? 0}h</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <FiBook className="text-green-500" size={16} />
//             <span className="font-medium">{course.lectures?.length ?? 0}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <FaChalkboardTeacher className="text-purple-500" size={16} />
//             <span className="font-medium">{course.teachers?.length ?? 1}</span>
//           </div>
//         </div>

//         {/* Teachers */}
//         {course.teachers && course.teachers.length > 0 && (
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex -space-x-3">
//               {course.teachers.slice(0, 4).map((teacher, idx) => (
//                 <img
//                   key={teacher._id || idx}
//                   src={teacher.avatar || "/default-teacher.jpg"}
//                   alt={teacher.name || "Teacher"}
//                   className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover hover:scale-110 transition-transform duration-300"
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
//               {course.teachers.length} instructor
//               {course.teachers.length > 1 ? "s" : ""}
//             </span>
//           </div>
//         )}

//         {/* Price and CTA */}
//         <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//           <div className="flex items-center">
//             <span className="text-3xl font-bold text-gray-900">
//               {formatPrice(course.price)}
//             </span>
//             <span className="text-gray-500 text-sm ml-1 mt-1">TK</span>
//           </div>

//           <div className="flex gap-2">
//             <Link
//               to={`/course/${course._id}`}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg flex items-center gap-2 group/btn"
//             >
//               <FiEye
//                 size={16}
//                 className="group-hover/btn:scale-110 transition-transform duration-300"
//               />
//               Preview
//             </Link>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default CourseCard;


import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiBook,
  FiBookOpen,
  FiClock,
  FiEye,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router";

const stripHtml = (html) => (html ? String(html).replace(/<[^>]*>/g, "") : "");

const formatPrice = (val) =>
  val || val === 0 ? Number(val).toLocaleString() : "0";

const CourseCard = ({ course, index }) => {
  const getTimeRemaining = (enrollmentEnd) => {
    if (!enrollmentEnd) return "No deadline";
    const now = new Date();
    const end = new Date(enrollmentEnd);
    const diff = end - now;
    if (Number.isNaN(diff)) return "Invalid date";
    if (diff <= 0) return "Enrollment Closed";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} min left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 font-hind flex flex-col"
      role="article"
    >
      <div className="relative h-52 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <FiBookOpen className="text-4xl text-white opacity-80" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            {getTimeRemaining(course.enrollmentEnd)}
          </div>
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold">
            {course.category?.name || "Uncategorized"}
          </div>
        </div>

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-gray-600 hover:text-red-500 transition-all duration-300 hover:scale-110 shadow-lg">
          <FiHeart size={18} />
        </button>

        {/* Rating overlay */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
          <FiStar className="text-yellow-400" />
          <span>{course.averageRating?.toFixed(1) || "0.0"}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {stripHtml(course.description) || "No description available"}
        </p>

        {/* Course stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500 bg-gray-50 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-1">
            <FiClock className="text-blue-500" size={16} />
            <span className="font-medium">{course.duration ?? 0}h</span>
          </div>
          <div className="flex items-center gap-1">
            <FiBook className="text-green-500" size={16} />
            <span className="font-medium">{course.lectures?.length ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaChalkboardTeacher className="text-purple-500" size={16} />
            <span className="font-medium">{course.teachers?.length ?? 1}</span>
          </div>
        </div>

        {/* Teachers */}
        {course.teachers && course.teachers.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex -space-x-3">
              {course.teachers.slice(0, 4).map((teacher, idx) => (
                <img
                  key={teacher._id || idx}
                  src={teacher.avatar || "/default-teacher.jpg"}
                  alt={teacher.name || "Teacher"}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover hover:scale-110 transition-transform duration-300"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              {course.teachers.length} instructor
              {course.teachers.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Price and CTA - Fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(course.price)}
              </span>
              <span className="text-gray-500 text-sm ml-1">TK</span>
            </div>

            <Link
              to={`/course/${course._id}`}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg flex items-center gap-2 group/btn"
            >
              <FiEye
                size={16}
                className="group-hover/btn:scale-110 transition-transform duration-300"
              />
              Preview
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
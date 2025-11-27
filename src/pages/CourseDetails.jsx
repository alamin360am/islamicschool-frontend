// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiBook,
  FiPlay,
  FiDollarSign,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiDownload,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaRegClock } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import api from "../utils/axios";
import PaymentModal from "../components/PaymentModal";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedLectures, setExpandedLectures] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
    setLoading(true);
    try {
      const courseRes = await api.get(`/courses/courseDetails/${id}`);

      if (courseRes.data.success) {
        setCourse(courseRes.data.course);
        setLectures(courseRes.data.course.lectures);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load course details"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchEnrollment = useCallback(async () => {
    try {
      const res = await api.get("/enrollment/me");
      const data = res.data;

      const findCourse = data.find((d) => d.course._id === id);

      if (findCourse && findCourse.paymentStatus === "completed") {
        setEnrolled(true);
      } else {
        setEnrolled(false);
      }
    } catch (error) {
      console.log("Enrollment check failed:", error);
      setEnrolled(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetails();
    fetchEnrollment();
  }, [fetchCourseDetails, fetchEnrollment]);

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const getTimeRemaining = (enrollmentEnd) => {
    const now = new Date();
    const end = new Date(enrollmentEnd);
    const diff = end - now;

    if (diff <= 0) return "Enrollment Closed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days left`;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours left`;
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Enroll button clicked");
    setShowPaymentModal(true);
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Implement wishlist API call here
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Failed to update wishlist", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FiBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            Course not found
          </h3>
          <p className="text-gray-500 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Course Header */}
      <div className="pt-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Breadcrumb and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 text-blue-200 text-sm">
                    <button
                      onClick={() => navigate("/courses")}
                      className="hover:text-white transition-colors"
                    >
                      Courses
                    </button>
                    <span>›</span>
                    <span>{course.category?.name || "UnCategorized"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {course.featured && (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <IoIosTrendingUp className="text-sm" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.status === "published"
                          ? "bg-green-500"
                          : course.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {course.status?.charAt(0).toUpperCase() +
                        course.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Course Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {course.title}
                </h1>

                {/* Course Description */}
                <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
                  {course.description
                    ?.replace(/<[^>]*>/g, "")
                    .substring(0, 200)}
                  {course.description?.length > 200 && "..."}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 text-blue-100">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                    <FiStar className="text-amber-300 text-lg" />
                    <span className="font-semibold">
                      {course.averageRating || "0.0"}
                    </span>
                    <span className="text-sm">
                      ({course.ratingCount || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                    <FiUsers className="text-amber-300 text-lg" />
                    <span>{course.studentCount || 0} students</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                    <FiClock className="text-amber-300 text-lg" />
                    <span>{formatDuration(course.duration || 0)}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                    <FiBook className="text-amber-300 text-lg" />
                    <span>{lectures.length} lectures</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enrollment Card - FIXED Z-INDEX AND POINTER EVENTS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-6 text-gray-800 relative z-10" // Added z-10 here
            >
              {/* Course Thumbnail */}
              <div className="relative rounded-xl overflow-hidden mb-4">
                {course.thumbnail ? (
                  <>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={toggleWishlist}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                          wishlisted
                            ? "bg-red-500 text-white"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <FiHeart className={wishlisted ? "fill-current" : ""} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <FiBookOpen className="text-4xl text-white" />
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiDollarSign className="text-green-600 text-2xl mr-1" />
                  <span className="text-3xl font-bold text-gray-800">
                    {course.price || 0}
                  </span>
                  <span className="text-gray-500 text-lg ml-1">TK</span>
                </div>
              </div>

              {/* Enrollment Timer */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <FaRegClock />
                  {getTimeRemaining(course.enrollmentEnd)}
                </div>
              </div>

              {/* Action Buttons - FIXED CLICK ISSUE */}
              <div
                className="space-y-3 relative"
                style={{ pointerEvents: "auto" }}
              >
                {enrolled ? (
                  <div className="space-y-3">
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 relative z-20"
                      onClick={() => navigate(`/learning/${course._id}`)}
                    >
                      <FiPlay />
                      Continue Learning
                    </button>
                    <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors relative z-20">
                      Share Course
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleEnrollClick}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 duration-200 relative z-20"
                      style={{ pointerEvents: "auto" }}
                    >
                      Enroll Now
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={toggleWishlist}
                        className={`border-2 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 relative z-20 ${
                          wishlisted
                            ? "border-red-500 text-red-500 bg-red-500/10"
                            : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        <FiHeart className={wishlisted ? "fill-current" : ""} />
                        {wishlisted ? "Wishlisted" : "Wishlist"}
                      </button>
                      <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 relative z-20">
                        <FiShare2 />
                        Share
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Guarantee */}
              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-sm text-blue-700 font-medium">
                  🎯 30-Day Money-Back Guarantee
                </p>
              </div>

              {/* Course Includes */}
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-500" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-500" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
                {[
                  { id: "overview", label: "Overview", icon: FiBook },
                  { id: "curriculum", label: "Curriculum", icon: FiPlay },
                  {
                    id: "instructors",
                    label: "Instructors",
                    icon: FaChalkboardTeacher,
                  },
                  { id: "reviews", label: "Reviews", icon: FiStar },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <IconComponent className="text-lg" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="pt-6">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                          About This Course
                        </h3>
                        <div
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-blue-600"
                          dangerouslySetInnerHTML={{
                            __html: course.description,
                          }}
                        />
                      </div>

                      {/* What You'll Learn */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
                        <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                          <FiAward className="text-blue-600" />
                          What You'll Learn
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course?.features?.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm"
                            >
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiCheck className="text-white text-sm" />
                              </div>
                              <span className="text-gray-700 font-medium">
                                {item}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Other tabs remain the same */}
                  {activeTab === "curriculum" && (
                    <motion.div
                      key="curriculum"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                        <h3 className="text-3xl font-bold text-gray-800">
                          Course Curriculum
                        </h3>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            {lectures.length} lectures
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            {formatDuration(course.duration || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {lectures.map((lecture, index) => (
                          <motion.div
                            key={lecture._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                          >
                            <div
                              className="flex items-center justify-between p-6 cursor-pointer"
                              onClick={() => toggleLecture(lecture._id)}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div
                                  className={`flex items-center justify-center w-10 h-10 rounded-xl font-semibold ${
                                    enrolled
                                      ? "bg-green-100 text-green-600"
                                      : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 text-lg">
                                    {lecture.title}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                    <div className="flex items-center gap-2">
                                      <FiPlay size={14} />
                                      <span>
                                        Video • {lecture.duration || "15 min"}
                                      </span>
                                    </div>
                                    {lecture.resources?.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <FiDownload size={14} />
                                        <span>
                                          {lecture.resources.length} resources
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {enrolled && (
                                  <button
                                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle play lecture
                                    }}
                                  >
                                    <FiPlay size={18} />
                                  </button>
                                )}
                                {expandedLectures[lecture._id] ? (
                                  <FiChevronUp className="text-gray-400 text-xl" />
                                ) : (
                                  <FiChevronDown className="text-gray-400 text-xl" />
                                )}
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedLectures[lecture._id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-6 pb-6"
                                >
                                  <div className="pt-4 border-t border-gray-200">
                                    <p className="text-gray-600 mb-4">
                                      {lecture.description ||
                                        "No description available for this lecture."}
                                    </p>
                                    {lecture.resources?.length > 0 && (
                                      <div>
                                        <h5 className="font-semibold text-gray-800 mb-2">
                                          Resources:
                                        </h5>
                                        <div className="space-y-2">
                                          {lecture.resources.map(
                                            (resource, resIndex) => (
                                              <div
                                                key={resIndex}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                              >
                                                <FiDownload className="text-blue-600" />
                                                <span className="text-gray-700">
                                                  {resource.name}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-auto">
                                                  {resource.size}
                                                </span>
                                              </div>
                                            )
                                          )}
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
                    </motion.div>
                  )}

                  {/* Other tabs... */}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar - Remains the same */}
          <div className="space-y-6">
            {/* Course Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiAward className="text-blue-500" />
                This Course Includes
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: FiPlay,
                    text: `${formatDuration(
                      course.duration || 0
                    )} on-demand video`,
                  },
                  {
                    icon: FiDownload,
                    text: `${lectures.reduce(
                      (acc, lecture) => acc + (lecture.resources?.length || 0),
                      0
                    )} downloadable resources`,
                  },
                  { icon: FiBook, text: "Full lifetime access" },
                  { icon: FiCalendar, text: "Access on mobile and TV" },
                  { icon: FiAward, text: "Certificate of completion" },
                  { icon: FiUsers, text: "Community support" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    <feature.icon className="text-blue-500 text-lg flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Course Dates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiCalendar className="text-purple-500" />
                Important Dates
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Enrollment Starts",
                    date: course.enrollmentStart,
                    color: "text-green-600",
                  },
                  {
                    label: "Enrollment Ends",
                    date: course.enrollmentEnd,
                    color: "text-amber-600",
                  },
                  {
                    label: "Course Starts",
                    date: course.courseStart,
                    color: "text-blue-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                    <span className={`font-semibold ${item.color}`}>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Share Course */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-6 text-center shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">Love this course?</h3>
              <p className="text-blue-100 mb-4">Share it with your friends!</p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <FiShare2 />
                Share Course
              </button>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 text-center shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-green-100 mb-4">
                We're here to support your learning journey
              </p>
              <button className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onSuccess={() => {
          setShowPaymentModal(false);
          setEnrolled(true);
          toast.success("Successfully enrolled in the course!");
        }}
      />
    </div>
  );
};

export default CourseDetails;

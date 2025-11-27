import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiClock,
  FiBook,
  FiDownload,
  FiMenu,
  FiX,
  FiBarChart2,
  FiHome,
  FiUser,
  FiSettings,
  FiYoutube,
  FiExternalLink,
  FiAward,
  FiStar
} from "react-icons/fi";
import api from "../utils/axios";

const LearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const videoContainerRef = useRef(null);

  // Auto-close sidebar on mobile when lecture is selected
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      const [courseRes, lecturesRes, enrollmentRes] = await Promise.all([
        api.get(`/courses/courseDetails/${courseId}`),
        api.get(`/courses/${courseId}/lectures`),
        api.get(`/enrollment/course/${courseId}`),
      ]);
      
      if (courseRes.data.success) {
        setCourse(courseRes.data.course);
      }

      if (lecturesRes.data) {
        const lecturesData = lecturesRes.data.lectures;
        setLectures(lecturesData);

        if (lecturesData.length > 0 && !currentLecture) {
          setCurrentLecture(lecturesData[0]);
        }
      }

      if (enrollmentRes.data.success) {
        setEnrollment(enrollmentRes.data.enrollment);
        setCompletedLectures(
          enrollmentRes.data.enrollment.completedLectures || []
        );
        setProgress(enrollmentRes.data.enrollment.progress || 0);
      }
    } catch (error) {
      console.error("Failed to fetch course data:", error);
      navigate("/my-courses");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const isVideoPlayable = (videoUrl) => {
    if (!videoUrl) return false;
    
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(videoUrl);
      return !!videoId;
    }
    
    return true;
  };

  const getYouTubeEmbedUrl = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;
    
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=1&autoplay=0`;
  };

  const markLectureComplete = async (lectureId) => {
    try {
      const { data } = await api.post(
        `/enrollments/${enrollment._id}/complete-lecture`,
        {
          lectureId,
        }
      );

      if (data.success) {
        setCompletedLectures((prev) => [...prev, lectureId]);
        setProgress(data.enrollment.progress);

        const currentIndex = lectures.findIndex(
          (lecture) => lecture._id === lectureId
        );
        if (currentIndex < lectures.length - 1) {
          setCurrentLecture(lectures[currentIndex + 1]);
          setVideoError(false);
        }
      }
    } catch (error) {
      console.error("Failed to mark lecture complete:", error);
    }
  };

  const toggleLectureCompletion = (lectureId) => {
    if (completedLectures.includes(lectureId)) {
      return;
    }
    markLectureComplete(lectureId);
  };

  const navigateToLecture = (lecture) => {
    setCurrentLecture(lecture);
    setVideoPlaying(true);
    setVideoError(false);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const goToNextLecture = () => {
    const currentIndex = lectures.findIndex(
      (lecture) => lecture._id === currentLecture._id
    );
    if (currentIndex < lectures.length - 1) {
      setCurrentLecture(lectures[currentIndex + 1]);
      setVideoPlaying(true);
      setVideoError(false);
    }
  };

  const goToPrevLecture = () => {
    const currentIndex = lectures.findIndex(
      (lecture) => lecture._id === currentLecture._id
    );
    if (currentIndex > 0) {
      setCurrentLecture(lectures[currentIndex - 1]);
      setVideoPlaying(true);
      setVideoError(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const openVideoInNewTab = () => {
    if (currentLecture?.videoUrl) {
      window.open(currentLecture.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getCurrentLectureIndex = () => {
    return lectures.findIndex(lecture => lecture._id === currentLecture?._id);
  };

  // Modern Video Player Component with proper controls
  const VideoPlayer = ({ lecture }) => {
    if (!lecture || !lecture.videoUrl) {
      return (
        <div className="flex items-center justify-center h-full min-h-[300px] lg:min-h-[400px]">
          <div className="text-center">
            <FiYoutube className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Video Available
            </h3>
            <p className="text-gray-400">
              This lecture doesn't have a video attached.
            </p>
          </div>
        </div>
      );
    }

    const videoId = getYouTubeVideoId(lecture.videoUrl);
    const embedUrl = getYouTubeEmbedUrl(lecture.videoUrl);

    if (!videoId || !embedUrl) {
      return (
        <div className="flex items-center justify-center h-full min-h-[300px] lg:min-h-[400px]">
          <div className="text-center">
            <FiYoutube className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Invalid Video URL
            </h3>
            <p className="text-gray-400 mb-4">
              The video URL for this lecture is not valid.
            </p>
            <button
              onClick={openVideoInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all mx-auto"
            >
              <FiExternalLink size={16} />
              Open Original Link
            </button>
          </div>
        </div>
      );
    }

    if (videoError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[300px] lg:min-h-[400px]">
          <div className="text-center">
            <FiYoutube className="text-6xl text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Video Not Available
            </h3>
            <p className="text-gray-400 mb-4">
              This video might be private or unavailable.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => setVideoError(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={openVideoInNewTab}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FiExternalLink size={16} />
                Open in YouTube
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full max-w-4xl mx-auto">
        {/* Video Container with proper controls */}
        <div className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-gray-800">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onError={handleVideoError}
            title={`Lecture: ${lecture.title}`}
            frameBorder="0"
          />
        </div>
        
        {/* Video Info and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-xl backdrop-blur-sm">
              <FiYoutube className="text-red-500" size={18} />
              <span className="text-gray-300 text-sm font-medium">YouTube</span>
            </div>
            <div className="text-gray-400 text-sm hidden sm:block">
              Full controls available in player
            </div>
          </div>
          
          <button
            onClick={openVideoInNewTab}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 border border-gray-600 w-full sm:w-auto justify-center"
          >
            <FiExternalLink size={16} />
            <span className="font-medium">Open in YouTube</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Course Not Found
          </h3>
          <p className="text-gray-400 mb-6">
            You are not enrolled in this course or it doesn't exist.
          </p>
          <button
            onClick={() => navigate("/my-courses")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentLectureIndex();
  const hasNextLecture = currentIndex < lectures.length - 1;
  const hasPrevLecture = currentIndex > 0;
  const isCurrentLectureCompleted = currentLecture ? completedLectures.includes(currentLecture._id) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Modern Top Navigation Bar */}
      <nav className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-white transition-all hover:bg-gray-700/50 rounded-xl lg:hidden"
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>

              <button
                onClick={() => navigate("/my-courses")}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <FiChevronLeft size={20} />
                <span className="hidden sm:block font-medium">My Courses</span>
              </button>

              <div className="hidden lg:block">
                <h1 className="text-lg font-bold text-white truncate max-w-xs lg:max-w-md">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <FiAward className="text-yellow-500" />
                  {progress}% Complete • {completedLectures.length}/{lectures.length} lectures
                </p>
              </div>
            </div>

            {/* Center Section - Course Title (Mobile) */}
            <div className="lg:hidden text-center flex-1 mx-4">
              <h1 className="text-sm font-bold text-white truncate">
                {course.title}
              </h1>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <FiStar className="text-yellow-500" size={12} />
                {progress}% Complete
              </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Modern Progress Bar */}
              <div className="hidden md:flex items-center gap-3">
                <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300 font-medium bg-gray-800 px-3 py-1 rounded-lg">
                  {progress}%
                </span>
              </div>

              <button className="p-2 text-gray-400 hover:text-white transition-all hover:bg-gray-700/50 rounded-xl">
                <FiSettings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Modern Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-80 bg-gray-800/95 backdrop-blur-xl border-r border-gray-700/50 flex flex-col fixed lg:static inset-y-0 left-0 z-40 lg:z-auto h-[calc(100vh-4rem)] mt-16 lg:mt-0"
              >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-4 mb-4">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FiBook className="text-white text-xl" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-white truncate text-base">
                        {course.title}
                      </h2>
                      <p className="text-gray-400 text-sm truncate">
                        {course.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  {/* Modern Progress Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50">
                      <div className="text-green-400 font-bold text-lg">
                        {progress}%
                      </div>
                      <div className="text-gray-400 text-xs">Progress</div>
                    </div>
                    <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50">
                      <div className="text-white font-bold text-lg">
                        {completedLectures.length}/{lectures.length}
                      </div>
                      <div className="text-gray-400 text-xs">Lectures</div>
                    </div>
                    <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50">
                      <div className="text-white font-bold text-lg">
                        {Math.round(course.duration * (progress / 100))}h
                      </div>
                      <div className="text-gray-400 text-xs">Completed</div>
                    </div>
                  </div>
                </div>

                {/* Modern Lectures List */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <h3 className="font-bold text-gray-300 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                      <FiBook size={16} />
                      Course Content
                    </h3>

                    <div className="space-y-2">
                      {lectures.map((lecture, index) => {
                        const hasVideo = isVideoPlayable(lecture.videoUrl);
                        const isCompleted = completedLectures.includes(lecture._id);
                        const isCurrent = currentLecture?._id === lecture._id;
                        
                        return (
                          <button
                            key={lecture._id}
                            onClick={() => navigateToLecture(lecture)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 group border ${
                              isCurrent
                                ? "bg-blue-500/20 border-blue-400/30 shadow-lg shadow-blue-500/10"
                                : "bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50 hover:shadow-lg"
                            } ${
                              !hasVideo ? "opacity-60" : ""
                            }`}
                            disabled={!hasVideo}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                                    : isCurrent
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                    : hasVideo
                                    ? "bg-gray-600 text-gray-300 group-hover:bg-gray-500"
                                    : "bg-gray-700 text-gray-500"
                                }`}
                              >
                                {isCompleted ? (
                                  <FiCheck size={16} />
                                ) : (
                                  index + 1
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-semibold text-sm truncate ${
                                    isCurrent
                                      ? "text-white"
                                      : hasVideo
                                      ? "text-gray-300 group-hover:text-white"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {lecture.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs mt-2">
                                  {hasVideo ? (
                                    <>
                                      <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-lg">
                                        <FiYoutube className="text-red-400" size={10} />
                                        <span className="text-red-400">YouTube</span>
                                      </div>
                                      {lecture.resources?.length > 0 && (
                                        <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-lg">
                                          <FiDownload size={10} className="text-blue-400" />
                                          <span className="text-blue-400">
                                            {lecture.resources.length}
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-500 bg-gray-600/50 px-2 py-1 rounded-lg">No video</span>
                                  )}
                                </div>
                              </div>

                              {isCompleted && (
                                <div className="flex-shrink-0 text-green-400 bg-green-500/20 p-2 rounded-lg">
                                  <FiCheck size={14} />
                                </div>
                              )}

                              {!hasVideo && (
                                <div className="flex-shrink-0 text-gray-500 bg-gray-600/50 p-2 rounded-lg" title="No video available">
                                  <FiX size={14} />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Modern Sidebar Footer */}
                <div className="p-6 border-t border-gray-700/50">
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 rounded-xl hover:shadow-lg transition-all hover:scale-105 active:scale-95 font-medium"
                  >
                    <FiHome size={18} />
                    Back to Courses
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modern Main Content - IMPROVED RESPONSIVE LAYOUT */}
        <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${
          sidebarOpen && window.innerWidth >= 1024 ? 'lg:ml-0' : ''
        }`}>
          {/* Video Player Section - RESPONSIVE HEIGHT */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto">
            {currentLecture ? (
              <div className="h-full flex flex-col">
                {/* Video Container with responsive height */}
                <div className="flex-none h-auto min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center p-4 lg:p-6">
                  <VideoPlayer lecture={currentLecture} />
                </div>

                {/* Modern Video Controls - IMPROVED RESPONSIVE DESIGN */}
                <div className="flex-none bg-gray-800/80 backdrop-blur-xl border-t border-gray-700/50 p-4 lg:p-6">
                  <div className="max-w-4xl mx-auto w-full">
                    {/* Lecture Title and Mark Complete Button */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 break-words">
                          {currentLecture.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                          <span>Lecture {currentIndex + 1} of {lectures.length}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{course.category?.name || "Uncategorized"}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 w-full lg:w-auto">
                        {isVideoPlayable(currentLecture.videoUrl) && !isCurrentLectureCompleted && (
                          <button
                            onClick={() => toggleLectureCompletion(currentLecture._id)}
                            className="w-full lg:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 active:scale-95 font-semibold shadow-lg"
                          >
                            <FiCheck size={18} />
                            Mark Complete
                          </button>
                        )}

                        {isCurrentLectureCompleted && (
                          <span className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-xl font-semibold border border-green-500/30">
                            <FiCheck size={18} />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Navigation Controls - IMPROVED MOBILE LAYOUT */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={goToPrevLecture}
                        disabled={!hasPrevLecture}
                        className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all w-full sm:w-auto ${
                          hasPrevLecture
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FiChevronLeft size={18} />
                        Previous
                      </button>

                      <div className="flex items-center gap-4 order-first sm:order-none">
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Progress</div>
                          <div className="text-green-400 font-bold text-lg">{progress}%</div>
                        </div>
                      </div>

                      <button
                        onClick={goToNextLecture}
                        disabled={!hasNextLecture}
                        className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all w-full sm:w-auto ${
                          hasNextLecture
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Next
                        <FiChevronRight size={18} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Course Progress</span>
                        <span className="text-sm text-gray-400">{completedLectures.length}/{lectures.length} lectures</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <FiPlay className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Start Learning
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Select a lecture from the sidebar to begin your journey
                  </p>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Open Course Content
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modern Resources Section */}
          {currentLecture?.resources && currentLecture.resources.length > 0 && (
            <div className="flex-none bg-gray-800/80 backdrop-blur-xl border-t border-gray-700/50 p-4 lg:p-8">
              <div className="max-w-4xl mx-auto w-full">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <FiDownload className="text-white" size={18} />
                  </div>
                  Lecture Resources
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentLecture.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-600/50 transition-all hover:scale-105 active:scale-95 border border-gray-600/50 group backdrop-blur-sm"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FiDownload className="text-white text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-base truncate group-hover:text-blue-300">
                          {resource.title}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Click to download
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-xl border-t border-gray-700/50 p-4 z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-gray-300 text-sm bg-gray-700/50 px-4 py-2 rounded-xl hover:bg-gray-600/50 transition-all flex-1 justify-center mx-1"
          >
            <FiMenu size={16} />
            Contents
          </button>

          <div className="text-center bg-gray-700/50 px-4 py-2 rounded-xl mx-1 flex-1">
            <div className="text-xs text-gray-400">Progress</div>
            <div className="text-green-400 font-bold">{progress}%</div>
          </div>

          <button
            onClick={() => navigate("/my-courses")}
            className="flex items-center gap-2 text-gray-300 text-sm bg-gray-700/50 px-4 py-2 rounded-xl hover:bg-gray-600/50 transition-all flex-1 justify-center mx-1"
          >
            <FiHome size={16} />
            Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
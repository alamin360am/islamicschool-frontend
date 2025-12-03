import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiBook,
  FiDownload,
  FiMenu,
  FiX,
  FiSettings,
  FiYoutube,
  FiExternalLink,
  FiHome,
} from "react-icons/fi";
import api from "../utils/axios";

const SIDEBAR_WIDTH_CLASS = "w-80";

const LearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseRes, lecturesRes, enrollmentRes] = await Promise.all([
        api.get(`/courses/courseDetails/${courseId}`),
        api.get(`/courses/${courseId}/lectures`),
        api.get(`/enrollment/course/${courseId}`)
      ]);

      if (courseRes.data?.success) {
        setCourse(courseRes.data.course);
      }
      if (lecturesRes.data) {
        const lecturesData = lecturesRes.data.lectures || [];
        setLectures(lecturesData);
        if (lecturesData.length > 0 && !currentLecture) {
          setCurrentLecture(lecturesData[0]);
        }
      }
      if (enrollmentRes.data?.success) {
        const e = enrollmentRes.data.enrollment;
        setEnrollment(e);
        setCompletedLectures(e.completedLectures || []);
        setProgress(e.progress || 0);
      }
    } catch (err) {
      console.error("fetchCourseData:", err);
      navigate("/my-courses");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = useCallback((url) => {
    if (!url) return null;
    const regex = /(?:v=|\/embed\/|\.be\/)([^#&?]{11})/;
    const match = String(url).match(regex);
    return match ? match[1] : null;
  }, []);

  const isVideoPlayable = useCallback((videoUrl) => {
    if (!videoUrl) return false;
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return !!getYouTubeVideoId(videoUrl);
    }
    return true;
  }, [getYouTubeVideoId]);

  const getYouTubeEmbedUrl = useCallback((videoUrl) => {
    const id = getYouTubeVideoId(videoUrl);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&controls=1`;
  }, [getYouTubeVideoId]);

  const markLectureComplete = async (lectureId) => {
    if (!enrollment?._id) return;
    try {
      const { data } = await api.post(
        `/enrollments/${enrollment._id}/complete-lecture`,
        { lectureId }
      );
      if (data?.success) {
        setCompletedLectures((prev) => {
          if (prev.includes(lectureId)) return prev;
          return [...prev, lectureId];
        });
        setProgress(data.enrollment?.progress ?? progress);

        const idx = lectures.findIndex((l) => l._id === lectureId);
        if (idx >= 0 && idx < lectures.length - 1) {
          setCurrentLecture(lectures[idx + 1]);
          setVideoError(false);
        }
      }
    } catch (err) {
      console.error("markLectureComplete:", err);
    }
  };

  const toggleLectureCompletion = (lectureId) => {
    if (completedLectures.includes(lectureId)) return;
    markLectureComplete(lectureId);
  };

  const getCurrentLectureIndex = () =>
    lectures.findIndex((l) => l._id === currentLecture?._id);

  const goToNextLecture = () => {
    const idx = getCurrentLectureIndex();
    if (idx >= 0 && idx < lectures.length - 1) {
      setCurrentLecture(lectures[idx + 1]);
      setVideoError(false);
      if (!isDesktop) setSidebarOpen(false);
    }
  };

  const goToPrevLecture = () => {
    const idx = getCurrentLectureIndex();
    if (idx > 0) {
      setCurrentLecture(lectures[idx - 1]);
      setVideoError(false);
      if (!isDesktop) setSidebarOpen(false);
    }
  };

  const openVideoInNewTab = () => {
    if (currentLecture?.videoUrl) {
      window.open(currentLecture.videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleVideoIframeError = () => {
    setVideoError(true);
  };

  const VideoPlayer = ({ lecture }) => {
    if (!lecture || !lecture.videoUrl) {
      return (
        <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
          <div className="text-center text-gray-300">
            <FiYoutube className="mx-auto text-5xl mb-3" />
            <div className="text-lg font-semibold">No Video Available</div>
            <div className="text-sm text-gray-400 mt-1">
              This lecture doesn't have a video attached.
            </div>
          </div>
        </div>
      );
    }

    const embedUrl = getYouTubeEmbedUrl(lecture.videoUrl);

    if (!embedUrl) {
      return (
        <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
          <div className="text-center text-gray-300">
            <FiYoutube className="mx-auto text-5xl mb-3" />
            <div className="text-lg font-semibold">Invalid Video URL</div>
            <div className="text-sm text-gray-400 mt-1 mb-4">
              The video url is not recognized.
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={openVideoInNewTab}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                Open Original
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (videoError) {
      return (
        <div className="flex items-center justify-center h-64 lg:h-[60vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
          <div className="text-center text-gray-300">
            <FiYoutube className="mx-auto text-5xl mb-3 text-red-400" />
            <div className="text-lg font-semibold">Video Unavailable</div>
            <div className="text-sm text-gray-400 mt-1 mb-4">
              The video might be private or blocked.
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setVideoError(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white"
              >
                Try Again
              </button>
              <button
                onClick={openVideoInNewTab}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                Open in YouTube
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            title={lecture.title || "Lecture video"}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={handleVideoIframeError}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-gray-300">Loading course content...</div>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-md text-center bg-gray-800/60 p-8 rounded-2xl">
          <FiBook className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Course Not Found</h3>
          <p className="text-gray-400 mb-6">
            You are not enrolled in this course or it doesn't exist.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/my-courses")}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              Back to My Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentLectureIndex();
  const hasNextLecture = currentIndex >= 0 && currentIndex < lectures.length - 1;
  const hasPrevLecture = currentIndex > 0;
  const isCurrentLectureCompleted = currentLecture
    ? completedLectures.includes(currentLecture._id)
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top */}
      <header className="sticky top-0 z-40 bg-gray-800/70 backdrop-blur border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* mobile menu toggle */}
              <button
                aria-label="Toggle sidebar"
                onClick={() => setSidebarOpen((v) => !v)}
                className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-200 lg:hidden"
              >
                {sidebarOpen ? <FiX /> : <FiMenu />}
              </button>

              <button
                onClick={() => navigate("/my-courses")}
                className="text-sm text-gray-200 flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-700/50"
              >
                <FiChevronLeft /> <span className="hidden sm:inline">My Courses</span>
              </button>

              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold truncate max-w-md">{course.title}</h1>
                <div className="text-xs text-gray-400 mt-0.5">
                  {completedLectures.length}/{lectures.length} lectures • {progress}% complete
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-36 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-300 px-3 py-1 rounded-md bg-gray-800/50">{progress}%</div>
              </div>

              <button className="p-2 bg-gray-700/50 rounded-xl hover:bg-gray-700">
                <FiSettings />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:flex lg:items-start lg:gap-8">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`${SIDEBAR_WIDTH_CLASS} flex-shrink-0 bg-gray-800/60 rounded-2xl p-4 border border-gray-700/50 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]`}
              >
                {/* Course header */}
                <div className="flex items-center gap-3 mb-4">
                  {course.thumbnail ? (
                    <img alt={course.title} src={course.thumbnail} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <FiBook className="text-white" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{course.title}</div>
                    <div className="text-xs text-gray-400 truncate">{course.category?.name || "UnCategorized"}</div>
                  </div>
                </div>

                {/* progress stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-700/40 rounded-xl p-3 text-center">
                    <div className="text-green-400 font-semibold">{progress}%</div>
                    <div className="text-xs text-gray-300">Progress</div>
                  </div>
                  <div className="bg-gray-700/40 rounded-xl p-3 text-center">
                    <div className="font-semibold">{completedLectures.length}/{lectures.length}</div>
                    <div className="text-xs text-gray-300">Lectures</div>
                  </div>
                  <div className="bg-gray-700/40 rounded-xl p-3 text-center">
                    <div className="font-semibold">{Math.round((course.duration || 0) * (progress / 100))}h</div>
                    <div className="text-xs text-gray-300">Completed</div>
                  </div>
                </div>

                {/* content list */}
                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: isDesktop ? "calc(100vh - 320px)" : "auto" }}>
                  <h4 className="text-xs text-gray-300 uppercase tracking-wide mb-2">Course Content</h4>
                  <div className="space-y-2">
                    {lectures.map((lecture, idx) => {
                      const hasVideo = isVideoPlayable(lecture.videoUrl);
                      const isCurrent = currentLecture?._id === lecture._id;
                      const isDone = completedLectures.includes(lecture._id);
                      return (
                        <button
                          key={lecture._id}
                          onClick={() => {
                            setCurrentLecture(lecture);
                            if (!isDesktop) setSidebarOpen(false);
                            setVideoError(false);
                          }}
                          disabled={!hasVideo}
                          className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition ${
                            isCurrent ? "bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/20 shadow-sm" : "bg-gray-800/40 hover:bg-gray-700/40"
                          } ${!hasVideo ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${
                            isDone ? "bg-green-500 text-white" : isCurrent ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-200"
                          }`}>
                            {isDone ? <FiCheck /> : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{lecture.title}</div>
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                              {hasVideo ? (
                                <span className="bg-red-600/20 px-2 py-0.5 rounded-md text-red-300 text-xs flex items-center gap-1">
                                  <FiYoutube size={12} /> YouTube
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">No video</span>
                              )}
                              {lecture.resources?.length > 0 && (
                                <span className="bg-blue-600/20 px-2 py-0.5 rounded-md text-blue-300 text-xs flex items-center gap-1">
                                  <FiDownload size={12} /> {lecture.resources.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-100"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiHome /> Back to Courses
                    </div>
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main column */}
          <div className="flex-1 mt-6 lg:mt-0">
            {/* Video area */}
            <div className="space-y-4">
              <VideoPlayer lecture={currentLecture} />

              {/* title + actions */}
              <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/40">
                <div className="lg:flex lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg lg:text-2xl font-semibold truncate">{currentLecture?.title || "Select a lecture"}</h2>
                    <div className="text-xs text-gray-400 mt-1">
                      {currentIndex + 1} of {lectures.length} • {course.category?.name || "UnCategorized"}
                    </div>
                  </div>

                  <div className="mt-3 lg:mt-0 flex items-center gap-3">
                    {isVideoPlayable(currentLecture?.videoUrl) && !isCurrentLectureCompleted && (
                      <button
                        onClick={() => toggleLectureCompletion(currentLecture._id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                      >
                        <div className="flex items-center gap-2">
                          <FiCheck /> Mark Complete
                        </div>
                      </button>
                    )}

                    {isCurrentLectureCompleted && (
                      <div className="px-4 py-2 rounded-xl bg-green-600/20 text-green-300 border border-green-600/30 flex items-center gap-2">
                        <FiCheck /> Completed
                      </div>
                    )}

                    <button
                      onClick={openVideoInNewTab}
                      className="px-3 py-2 rounded-xl bg-gray-700/40 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FiExternalLink /> Open in YouTube
                    </button>
                  </div>
                </div>

                {/* controls: prev / progress / next */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      disabled={!hasPrevLecture}
                      onClick={goToPrevLecture}
                      className={`px-4 py-2 rounded-xl w-full sm:w-auto ${hasPrevLecture ? "bg-blue-600/80 hover:scale-[1.02]" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <FiChevronLeft /> Previous
                      </div>
                    </button>

                    <button
                      disabled={!hasNextLecture}
                      onClick={goToNextLecture}
                      className={`px-4 py-2 rounded-xl w-full sm:w-auto ${hasNextLecture ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        Next <FiChevronRight />
                      </div>
                    </button>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-xs text-gray-400">Course Progress</div>
                    <div className="text-green-400 font-semibold">{progress}% • {completedLectures.length}/{lectures.length} lectures</div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div style={{ width: `${progress}%` }} className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* resources */}
              {currentLecture?.resources && currentLecture.resources.length > 0 && (
                <section className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/40">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <FiDownload className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Lecture Resources</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentLecture.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 hover:bg-gray-700/50 transition"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                          <FiDownload />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{res.title}</div>
                          <div className="text-xs text-gray-400">Click to download</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gray-800/70 backdrop-blur rounded-2xl p-3 flex items-center justify-between gap-3 border border-gray-700/50">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700/40 flex items-center justify-center gap-2"
          >
            <FiMenu /> Contents
          </button>

          <div className="flex-1 text-center">
            <div className="text-xs text-gray-300">Progress</div>
            <div className="text-green-400 font-semibold">{progress}%</div>
          </div>

          <button onClick={() => navigate("/my-courses")} className="flex-1 px-3 py-2 rounded-lg bg-gray-700/40 flex items-center justify-center gap-2">
            <FiHome /> Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;

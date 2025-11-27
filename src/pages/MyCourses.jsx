import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiBook,
  FiClock,
  FiPlay,
  FiBarChart2,
  FiCalendar,
  FiSearch
} from 'react-icons/fi';
import api from '../utils/axios';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await api.get('/payments/enrollments');
      if (data.success) {
        setEnrollments(data.enrollments);
      }
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Courses</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Continue your learning journey and track your progress
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 border-0"
            />
          </div>
        </div>

        {filteredEnrollments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FiBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              {searchTerm ? 'No courses found' : 'No courses enrolled yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start your learning journey by enrolling in your first course'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Browse Courses
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEnrollments.map((enrollment, index) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <FiBook className="text-white text-3xl" />
                    </div>
                  )}
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      enrollment.paymentStatus === 'completed' 
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                    }`}>
                      {enrollment.paymentStatus === 'completed' ? 'Enrolled' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {enrollment.course.category?.name || 'Uncategorized'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {enrollment.course.title}
                  </h3>

                  {/* Course Stats */}
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>{enrollment.course.duration || 0}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiBarChart2 />
                      <span>{enrollment.progress}% Complete</span>
                    </div>
                  </div>

                  {/* Enrollment Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FiCalendar />
                    <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/learn/${enrollment.course._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <FiPlay />
                    {enrollment.progress > 0 ? 'Continue' : 'Start Learning'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
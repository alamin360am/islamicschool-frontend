// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiUsers, FiBook, FiBarChart2, FiDollarSign, FiUserCheck, FiStar, FiEdit, FiPlus, FiTrendingUp} from 'react-icons/fi';
import AdminNavBar from '../../components/AdminNavBar';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Students', value: '2,456', icon: FiUsers, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { title: 'Total Courses', value: '24', icon: FiBook, color: 'from-green-500 to-emerald-500', change: '+8%' },
    { title: 'Active Teachers', value: '18', icon: FiUserCheck, color: 'from-purple-500 to-fuchsia-500', change: '+5%' },
    { title: 'Revenue', value: '$12,845', icon: FiDollarSign, color: 'from-amber-500 to-orange-500', change: '+23%' }
  ];

  const recentStudents = [
    { id: 1, name: 'Ahmed Rahman', course: 'Quran Basics', status: 'active' },
    { id: 2, name: 'Sara Khan', course: 'Islamic Manners', status: 'active' },
    { id: 3, name: 'Omar Ali', course: 'Prophet Stories', status: 'pending' },
    { id: 4, name: 'Fatima Ahmed', course: 'Tajweed for Kids', status: 'active' }
  ];

  const courses = [
    { id: 1, title: 'Quran Basics', students: 245, rating: 4.9, status: 'active' },
    { id: 2, title: 'Islamic Manners', students: 189, rating: 4.8, status: 'active' },
    { id: 3, title: 'Prophet Stories', students: 156, rating: 4.7, status: 'active' },
    { id: 4, title: 'Advanced Tajweed', students: 98, rating: 4.9, status: 'draft' }
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-xl font-semibold text-gray-800 mt-1">{stat.value}</h3>
                <p className="text-emerald-600 text-sm mt-1">{stat.change} from last week</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                <stat.icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    {/* Students & Courses */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
          <button className="text-emerald-600 text-sm hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img
                  src={`https://i.pravatar.cc/150?img=${student.id + 10}`}
                  alt={student.name}
                  className="w-9 h-9 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.course}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {student.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Course Performance */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Course Performance</h2>
          <button className="text-emerald-600 text-sm hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">{course.title}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>{course.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{course.students} students</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {course.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

      {/* Revenue Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Revenue Analytics</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs">Monthly</button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-xs">Quarterly</button>
          </div>
        </div>
        <div className="h-56 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FiTrendingUp className="mx-auto text-4xl text-emerald-500" />
            <p className="text-gray-500">Revenue chart visualization</p>
            <p className="text-xl font-bold text-emerald-600 mt-2">+23% this month</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Manage Students", icon: FiUsers, actionIcon: FiEdit, gradient: "from-emerald-500 to-green-500", description: "Add, edit, or remove student accounts" },
          { title: "Create Course", icon: FiBook, actionIcon: FiPlus, gradient: "from-blue-500 to-cyan-500", description: "Design and publish new courses" },
          { title: "View Reports", icon: FiBarChart2, actionIcon: FiTrendingUp, gradient: "from-purple-500 to-fuchsia-500", description: "Analyze performance metrics" }
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className={`bg-gradient-to-r ${card.gradient} text-white rounded-xl shadow-lg p-6 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} />
              <card.actionIcon size={18} />
            </div>
            <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
            <p className="text-sm opacity-90">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default AdminDashboard;
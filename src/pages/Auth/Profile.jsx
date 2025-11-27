// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit3,
  FiSave,
  FiArrowLeft,
  FiLock,
  FiBookOpen,
  FiAward,
  FiBarChart2,
} from "react-icons/fi";
import Avatar from '../../../public/Avatar.jpg'
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const iso = user.createdAt;

  const date = new Date(iso);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogOut = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
      toast.success("Logged out successfully");
    } else {
      toast.field("Logout failed");
    }
  };

  const [profileData, setProfileData] = useState({
    name: "Abdullah Al Mamun",
    email: "mamun@example.com",
    phone: "01712345678",
    address: "Dhaka, Bangladesh",
    joinDate: "January 15, 2024",
    children: [
      { name: "Ayesha", age: 8, progress: 85 },
      { name: "Mohammad", age: 6, progress: 72 },
    ],
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileData({ ...editData });
    } else {
      setEditData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const stats = [
    {
      label: "Total Enrollment",
      value: "12",
      icon: FiBookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Running Courses",
      value: "15 days",
      icon: FiAward,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Overall Progress",
      value: "78%",
      icon: FiBarChart2,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const recentActivities = [
    { action: "Completed Quran Basics", time: "2 hours ago", icon: "📖" },
    { action: "Earned Perfect Score in Quiz", time: "1 day ago", icon: "🏆" },
    { action: "Started Arabic Alphabet", time: "2 days ago", icon: "🔤" },
    { action: "Shared Progress with Teacher", time: "3 days ago", icon: "👨‍🏫" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-green-600 hover:text-green-700 transition mr-6"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditToggle}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
              }`}
            >
              {isEditing ? (
                <FiSave className="mr-2" />
              ) : (
                <FiEdit3 className="mr-2" />
              )}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Profile Info */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white p-8">
                <div className="flex items-center">
                  {/* TODO: Add profile img */}
                  <div className="relative w-24 h-24 rounded-full">
                    <img
                      src={Avatar}
                      alt="Profile"
                      className="w-full rounded-full border-4 border-white/20 overflow-hidden"
                    />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <FiEdit3 className="text-white text-xs" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="bg-white/20 rounded-lg px-3 py-1 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="Enter your name"
                        />
                      ) : (
                        user.name
                      )}
                    </h2>
                    <div className="flex items-center mt-2 text-green-100 text-sm">
                      <FiCalendar className="mr-1" />
                      <span>Joined {formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-6">
                {/* Email */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <FiMail className="text-green-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email Address</p>

                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <FiPhone className="text-blue-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <FiMapPin className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {user.address ? user.address : "-"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Change Password */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  <FiLock className="mr-2 text-gray-600" />
                  <Link
                    to={"/change-password"}
                    className="text-gray-700 font-medium"
                  >
                    Change Password
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  <FiLock className="mr-2 text-gray-600" />
                  <div
                    onClick={handleLogOut}
                    className="text-gray-700 font-medium"
                  >
                    Log Out
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Stats & Activities */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <stat.icon className="text-white text-xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: "courses", label: "My Courses" },
                    { id: "achievements", label: "Achievements" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition ${
                        activeTab === tab.id
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                      >
                        <span className="text-2xl mr-4">{activity.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiBookOpen className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Enrolled Courses
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You are currently enrolled in 3 courses
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                      View All Courses
                    </button>
                  </div>
                )}

                {activeTab === "achievements" && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiAward className="text-yellow-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Your Achievements
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You've earned 8 achievements so far!
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                      View Achievements
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 mt-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Add Child",
                    icon: "👶",
                    color: "bg-blue-100 text-blue-600",
                  },
                  {
                    label: "Progress Report",
                    icon: "📊",
                    color: "bg-green-100 text-green-600",
                  },
                  {
                    label: "Settings",
                    icon: "⚙️",
                    color: "bg-purple-100 text-purple-600",
                  },
                  {
                    label: "Help Center",
                    icon: "❓",
                    color: "bg-orange-100 text-orange-600",
                  },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-4 rounded-xl ${action.color} hover:shadow-md transition`}
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-medium text-center">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

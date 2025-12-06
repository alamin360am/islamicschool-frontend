// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FiMessageSquare,
  FiArrowRight,
  FiStar,
  FiUser,
  FiHeart,
  FiBook,
  FiAward,
  FiSmile,
} from "react-icons/fi";
import PopularBlogs from "../components/PopularBlogs";
import PopularQuestion from "../components/PopularQuestion";
import FeaturedCourses from "../components/FeaturedCourses";
import Carousel from "../components/Carousel";
import Instructors from "../components/Instructors";
import DirectorVoice from "../components/DirectorVoice";

const Home = () => {
  const bounceAnimation = {
    whileHover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring", stiffness: 300 },
    },
    whileTap: { scale: 0.95 },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-200 opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <FiStar size={24} />
          </motion.div>
        ))}
      </div>
      <section id="home" className="overflow-hidden">
        <Carousel />
      </section>

      {/* Courses Section with Enhanced Animations */}
      <section className="relative py-16 bg-gradient-to-b from-blue-50 to-white px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-800 mb-4"
              whileInView={{ scale: [0.9, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Featured Courses
            </motion.h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our carefully designed courses make Islamic learning engaging and
              effective for children of all ages.
            </p>
          </motion.div>

          <FeaturedCourses />

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div {...bounceAnimation}>
              <button className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transition shadow-lg">
                <Link to={"/courses"}>View All Courses</Link>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Director's Voice */}

      <DirectorVoice />

      {/* Enhanced Instructors Section */}
      <Instructors />


      {/* Enhanced Feedback Section */}
      <section
        id="feedback"
        className="relative pb-16 px-6 bg-gradient-to-b from-amber-50 to-sky-50 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What Parents Say 💬
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from parents who have seen their children grow in faith and
              knowledge through our programs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ali's Mother",
                feedback:
                  "My son loves the Quran class! The teacher makes it so fun.",
                rating: 5,
                date: "2 weeks ago",
                color: "bg-pink-50",
                child: "Ali, 7 years",
              },
              {
                name: "Sara's Father",
                feedback:
                  "The duas course helped my daughter memorize easily. JazakAllah!",
                rating: 5,
                date: "1 month ago",
                color: "bg-blue-50",
                child: "Sara, 6 years",
              },
              {
                name: "Omar's Mother",
                feedback:
                  "Very interactive and child-friendly. Highly recommended.",
                rating: 5,
                date: "3 weeks ago",
                color: "bg-amber-50",
                child: "Omar, 8 years",
              },
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`${review.color} p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-500`}
              >
                <div className="flex mb-3 text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.2 }}>
                      <FiStar className="fill-current" />
                    </motion.div>
                  ))}
                </div>
                <div className="mb-4 relative">
                  <FiMessageSquare
                    className="absolute -left-2 -top-2 text-green-500 opacity-20"
                    size={24}
                  />
                  <p className="text-gray-700 italic relative z-10">
                    "{review.feedback}"
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">
                      {review.name}
                    </h3>
                    <p className="text-sm text-gray-600">{review.child}</p>
                  </div>
                  <motion.span
                    className="text-xs text-gray-500"
                    whileHover={{ scale: 1.1 }}
                  >
                    {review.date}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Blogs Section */}
      <section
        id="blogs"
        className="relative pb-16 px-6 bg-gradient-to-b from-sky-50 to-white z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Popular Blogs ✍️
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover insightful articles on Islamic parenting, education, and
              nurturing faith in children.
            </p>
          </motion.div>

          <PopularBlogs />

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div {...bounceAnimation}>
              <Link
                to={"/blogs"}
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transition shadow-lg inline-flex items-center"
              >
                <FiBook className="mr-2" />
                View All Blogs
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Q&A Section */}
      <section
        id="qa"
        className="relative pb-16 px-6 bg-gradient-to-b from-white to-green-50 z-10"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Islamic Q&A ❓
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Answers to common questions about Islamic practices, beliefs, and
              parenting in light of Islamic teachings.
            </p>
          </motion.div>

          <PopularQuestion />

          <motion.div
            className="text-center mt-12 flex flex-col md:flex-row justify-center items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div {...bounceAnimation}>
              <Link
                to={"/qa"}
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transition shadow-lg inline-flex items-center"
              >
                <FiAward className="mr-2" />
                See More Questions
              </Link>
            </motion.div>

            <motion.div {...bounceAnimation}>
              <Link
                to={"/qa/ask-question"}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center shadow-lg"
              >
                <FiMessageSquare className="mr-2" />
                Ask Question
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button for Kids */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1, rotate: 360 }}
      >
        <button className="bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition flex items-center justify-center">
          <FiHeart size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default Home;

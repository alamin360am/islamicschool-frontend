import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { FiBook, FiBookOpen, FiCalendar, FiClock, FiDollarSign, FiEye, FiStar } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router";
import CourseCard from "./CourseCard";

const FeaturedCourses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/featuredCourse");
      if (res.data.success) {
        setCourses(res.data.courses);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if(loading) return <p>Loading</p>

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 font-hind">
      {courses?.map((course, index) => (
        <CourseCard course={course} index={index} />
      ))}
    </div>
  );
};

export default FeaturedCourses;

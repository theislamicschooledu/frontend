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
import Instructors from "../components/Instructors";
import DirectorVoice from "../components/DirectorVoice";
import Heading from "../components/Heading";
import HeroSection from "../components/HeroSection";
import HomeAbout from "../components/HomeAbout";
import { useLanguage } from "../hooks/useLanguage";

const Home = () => {
  const { t } = useLanguage();

  const bounceAnimation = {
    whileHover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring", stiffness: 300 },
    },
    whileTap: { scale: 0.95 },
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans overflow-hidden">
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

      <HeroSection />

      <section>
        <HomeAbout />
      </section>

      {/* Courses Section with Enhanced Animations */}
      <section className="relative bg-linear-to-b from-blue-50 to-white px-6 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Featured Courses */}

          <Heading
            label={t("home.courses.label")}
            text1={t("home.courses.heading")}
            text2={t("home.courses.description")}
          />

          <FeaturedCourses />

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div {...bounceAnimation}>
              <button className="border-2 border-green-600 text-green-600 px-6 py-3 mb-10 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transition shadow-lg">
                <Link to={"/courses"}>{t("home.courses.viewAll")}</Link>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Director's Voice */}

      <DirectorVoice />

      <Instructors limit={3} />

      {/* Enhanced Blogs Section */}
      <section
        id="blogs"
        className="relative pt-8 px-6 bg-linear-to-b from-sky-50 to-white z-10"
      >
        <div className="max-w-7xl mx-auto">
          <PopularBlogs />

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.div>
        </div>
      </section>

      <section
        id="qa"
        className="relative pt-8 px-6 bg-linear-to-b from-white to-green-50 z-10"
      >
        <div className="max-w-5xl mx-auto">
          <PopularQuestion />
        </div>
      </section>
    </div>
  );
};

export default Home;

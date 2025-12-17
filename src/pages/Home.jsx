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
import Heading from "../components/Heading";

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
      <section className="relative pt-8 bg-gradient-to-b from-blue-50 to-white px-6 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Featured Courses */}

          <Heading
            text1={"জনপ্রিয় কোর্স সমুহ"}
            text2={
              "চাহিদার শীর্ষে থাকা আমাদের কোর্সসমুহ। যা আপনাদের আল্লাহর পথে পরিচালিত করতে সহয়তা করবে।"
            }
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

      <Heading text1={"আমাদের উস্তাদগণ"} text2={""} />

      <Instructors />

      {/* Enhanced Blogs Section */}
      <section
        id="blogs"
        className="relative pt-8 px-6 bg-gradient-to-b from-sky-50 to-white z-10"
      >
        <div className="max-w-7xl mx-auto">
          <Heading
            text1={"জনপ্রিয় ব্লগ সমুহ"}
            text2={
              "আমাদের দক্ষ উস্তাদগণের লেখা জনপ্রিয় ব্লগ ও নসিহামূলক লেখাগুলো পড়ুন"
            }
          />

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
        className="relative pt-8 px-6 bg-gradient-to-b from-white to-green-50 z-10"
      >
        <div className="max-w-5xl mx-auto">
          <Heading
            text1={"ইসলামিক প্রশ্নোত্তর"}
            text2={
              "ইসলামী শিক্ষা অনুসারে ইসলামিক আচরণ, বিশ্বাস ও পিতামাতার দায়িত্ব সম্পর্কিত সাধারণ প্রশ্নের উত্তর"
            }
          />

          <PopularQuestion />

          <motion.div
            className="text-center my-8 flex flex-col md:flex-row justify-center items-center gap-6"
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
    </div>
  );
};

export default Home;

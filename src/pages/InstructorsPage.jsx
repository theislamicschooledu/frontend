import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Heading from "../components/Heading";
import Instructors from "../components/Instructors";

const InstructorsPage = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans overflow-hidden pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            text1={"আমাদের উস্তাদগণ"}
            text2={
              "আমাদের সম্মানিত উস্তাদ ও এডমিনগণ, যারা ইসলামী জ্ঞান প্রচারে নিরলসভাবে কাজ করছেন"
            }
          />
        </motion.div>

        <Instructors limit={null} />
      </div>
    </div>
  );
};

export default InstructorsPage;

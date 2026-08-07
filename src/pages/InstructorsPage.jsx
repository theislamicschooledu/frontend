import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Heading from "../components/Heading";
import Instructors from "../components/Instructors";

const InstructorsPage = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans overflow-hidden pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Instructors limit={null} />
      </div>
    </div>
  );
};

export default InstructorsPage;

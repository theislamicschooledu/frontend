import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Heading = ({ text1, text2 }) => {
  return (
    <motion.div
      className="text-center my-8 md:my-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 tracking-tight">
        {text1}
      </h2>
      <div className="w-28 h-1 bg-green-600 mx-auto rounded-full mb-3"></div>
      <p className="text-gray-600 max-w-2xl mx-auto">{text2}</p>
    </motion.div>
  );
};

export default Heading;

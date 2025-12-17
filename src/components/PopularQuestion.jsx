import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiArrowUpRight, FiBook } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { Link } from "react-router";

const PopularQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/qna/featuredQuestion");

      if (res.data.success) {
        setQuestions(res.data.questions);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-6 font-hind">
      {questions?.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                {item.category?.name}
              </span>
              <button className="text-green-600 p-1 rounded-full hover:bg-green-100 transition">
                <FiBook size={16} />
              </button>
            </div>
            <h3 className="font-semibold text-lg mb-2 flex items-start">
              <span className="text-green-600 mr-2">Q:</span>
              {item.title}
            </h3>
            <p className="text-gray-600 pl-5 border-l-2 border-green-200">
              <span className="text-green-600 font-medium">A:</span>
              <div
                className="prose prose-lg max-w-none mb-4 text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: item.answers[0].text.slice(0, 120),
                }}
              />
              <Link
                to={`/qa/${item._id}`}
                className="text-green-600 font-medium flex items-center group-hover:underline"
              >
                Read More
                <FiArrowUpRight className="ml-1" />
              </Link>
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PopularQuestion;

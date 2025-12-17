// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiBookOpen, FiMeh } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="fixed top-6 left-6 z-50">
        <Link 
          to="/"
          className="flex items-center text-green-600 font-bold text-lg"
        >
          <FiBookOpen className="mr-2" />
          IslamicLearn Admin
        </Link>
      </div>
      
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between">
        {/* Illustration Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 mb-10 md:mb-0"
        >
          <div className="relative">
            {/* Main illustration */}
            <svg viewBox="0 0 500 500" className="w-full h-auto">
              <motion.path
                d="M250,50 C350,30 450,80 450,180 C450,280 350,330 250,310 C150,330 50,280 50,180 C50,80 150,30 250,50 Z"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <text 
                  x="250" 
                  y="180" 
                  textAnchor="middle" 
                  fontSize="120" 
                  fontWeight="bold" 
                  fill="#065f46"
                  fontFamily="system-ui, sans-serif"
                >
                  40
                </text>
                <motion.g
                  animate={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <circle cx="250" cy="180" r="100" fill="none" />
                  <circle cx="380" cy="180" r="60" fill="#f59e0b" opacity="0.2" />
                </motion.g>
                <text 
                  x="380" 
                  y="180" 
                  textAnchor="middle" 
                  fontSize="120" 
                  fontWeight="bold" 
                  fill="#065f46"
                  fontFamily="system-ui, sans-serif"
                >
                  4
                </text>
              </motion.g>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-20 left-20 text-5xl text-amber-500 opacity-80"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <FiMeh />
            </motion.div>
            
            <motion.div
              className="absolute bottom-40 right-20 text-4xl text-emerald-500 opacity-70"
              animate={{ y: [0, 15, 0], rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
              <FiMeh />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full md:w-1/2 md:pl-10 text-center md:text-left"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-emerald-900 mb-4">Oops!</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই। এটি মুছে ফেলা হতে পারে, 
            নাম পরিবর্তন করা হতে পারে বা সাময়িকভাবে অনুপলব্ধ হতে পারে।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-lg hover:bg-emerald-700 transition"
              >
                <FiHome className="mr-2" />
                হোমপেজে ফিরে যান
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 border border-emerald-200 rounded-xl font-medium hover:bg-emerald-50 transition"
              >
                <FiArrowLeft className="mr-2" />
                পূর্ববর্তী পৃষ্ঠা
              </button>
            </motion.div>
          </div>
          
          {/* Additional help section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-10 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
          >
            <p className="text-emerald-800">
              সাহায্যের প্রয়োজন?{' '}
              <a href="/contact" className="font-semibold underline hover:text-emerald-600">
                সহায়তা কেন্দ্রে
              </a>{' '}
              যোগাযোগ করুন
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-emerald-200 opacity-40"
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 rounded-full bg-amber-200 opacity-30"
        animate={{
          scale: [1, 1.8, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};

export default ErrorPage;
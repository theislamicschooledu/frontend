import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/featuredCourse");

      console.log(res.data.courses);
      
      
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

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === courses?.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [courses?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleSlideClick = (index, courseId, event) => {
    if (index === currentIndex) {
      return;
    } else {
      event.preventDefault();
      event.stopPropagation();
      goToSlide(index);
    }
  };

  const getLayerStyle = (index) => {
    const totalSlides = courses?.length || 0;

    let relativePosition = index - currentIndex;
    
    if (relativePosition < -Math.floor(totalSlides / 2)) {
      relativePosition += totalSlides;
    } else if (relativePosition > Math.floor(totalSlides / 2)) {
      relativePosition -= totalSlides;
    }

    if (relativePosition === 0) {
      return {
        transform: "translateX(0) scale(1) rotateY(0deg)",
        zIndex: 30,
        opacity: 1,
      };
    } else if (Math.abs(relativePosition) === 1) {
      if (relativePosition < 0) {
        return {
          transform: "translateX(-75%) scale(0.85) rotateY(-8deg)",
          zIndex: 20,
          opacity: 0.8,
        };
      } else {
        return {
          transform: "translateX(75%) scale(0.85) rotateY(8deg)",
          zIndex: 20,
          opacity: 0.8,
        };
      }
    } else if (Math.abs(relativePosition) === 2) {
      if (relativePosition < 0) {
        return {
          transform: "translateX(-110%) scale(0.75) rotateY(-12deg)",
          zIndex: 10,
          opacity: 0.5,
        };
      } else {
        return {
          transform: "translateX(110%) scale(0.75) rotateY(12deg)",
          zIndex: 10,
          opacity: 0.5,
        };
      }
    } else {
      if (relativePosition < 0) {
        return {
          transform: "translateX(-135%) scale(0.65) rotateY(-15deg)",
          zIndex: 5,
          opacity: 0.3,
        };
      } else {
        return {
          transform: "translateX(135%) scale(0.65) rotateY(15deg)",
          zIndex: 5,
          opacity: 0.3,
        };
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(price);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ));
  };

  const getGradientClass = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600", 
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  if(loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="relative font-hind w-full max-w-7xl mx-auto pt-20 lg:pt-8 px-4">
      <style jsx global>{`
        @keyframes neon-glow {
          0%, 100% {
            border-color: #3b82f6;
            box-shadow: 
              0 0 20px rgba(59, 130, 246, 0.4),
              0 0 40px rgba(59, 130, 246, 0.3),
              0 0 60px rgba(59, 130, 246, 0.2),
              inset 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            border-color: #8b5cf6;
            box-shadow: 
              0 0 30px rgba(139, 92, 246, 0.5),
              0 0 50px rgba(139, 92, 246, 0.4),
              0 0 70px rgba(139, 92, 246, 0.3),
              inset 0 0 30px rgba(139, 92, 246, 0.4);
          }
        }
        .animate-neon-glow {
          animation: neon-glow 3s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="relative h-[350px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-3xl overflow-visible perspective-1000">
        <div className="relative w-full h-full flex items-center justify-center">
          {courses?.map((course, index) => (
            <div
              key={course._id || course.id}
              className={`absolute transition-all duration-700 ease-out rounded-3xl overflow-hidden shadow-2xl ${
                index === currentIndex ? "cursor-pointer" : "cursor-pointer"
              }`}
              style={{
                ...getLayerStyle(index),
                width: '95%', 
                height: '95%',
                ...(window.innerWidth >= 640 && {
                  width: '85%',
                  height: '90%'
                }),
                ...(window.innerWidth >= 768 && {
                  width: '75%',
                  height: '85%'
                }),
                ...(window.innerWidth >= 1024 && {
                  width: '60%',
                  height: '80%'
                }),
                ...(window.innerWidth >= 1280 && {
                  width: '50%',
                  height: '75%'
                })
              }}
              onClick={(e) => handleSlideClick(index, course._id, e)}
            >
              {/* Course Card */}
              <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(index)} text-white relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-4 sm:p-6 md:p-8">
                  {/* Header Section - Made more compact */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      {/* Category */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="glass-effect px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          {course.category?.name || "কোর্স"}
                        </span>
                      </div>

                      {/* Title - Fixed to show properly */}
                      <h3 className="sm:text-lg md:text-2xl lg:text-3xl font-bold leading-tight line-clamp-2 mb-2 sm:mb-3">
                        {course.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {getRatingStars(course.averageRating || 0)}
                        </div>
                        <span className="text-xs sm:text-sm opacity-90">
                          ({course.ratingCount || 0} রিভিউ)
                        </span>
                      </div>
                    </div>

                    {/* Student Count */}
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="glass-effect px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-center">
                        <div className="sm:text-sm md:text-2xl font-bold">{course.studentCount || 0}</div>
                        <div className="text-xs opacity-90">শিক্ষার্থী</div>
                      </div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm sm:text-base">{course.duration} দিন</div>
                        <div className="text-xs opacity-80">মেয়াদ</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm sm:text-base">{course.teachers?.length || 0} জন</div>
                        <div className="text-xs opacity-80">শিক্ষক</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm sm:text-base">{course.lectures?.length || 0} টি</div>
                        <div className="text-xs opacity-80">লেকচার</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm sm:text-base">সার্টিফিকেট</div>
                        <div className="text-xs opacity-80">সমাপ্তিতে</div>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA - Made more compact */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/20 mt-auto">
                    <div className="min-w-0">
                      <div className="sm:text-xl md:text-2xl font-bold">{formatPrice(course.price)}</div>
                      {course.enrollmentEnd && (
                        <div className="text-xs sm:text-sm opacity-90 mt-1">
                          ⏰ এনরোলমেন্ট শেষ: {new Date(course.enrollmentEnd).toLocaleDateString('bn-BD')}
                        </div>
                      )}
                    </div>
                    {index === currentIndex ? (
                      <Link
                        to={`/course/${course._id}`}
                        className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex-shrink-0 ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        এনরোল করুন
                      </Link>
                    ) : (
                      <button className="bg-white/50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base opacity-50 cursor-default flex-shrink-0 ml-2">
                        বিস্তারিত
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Neon Border for Active Slide */}
              {index === currentIndex && (
                <div className="absolute inset-0 rounded-3xl border-[3px] border-transparent animate-neon-glow pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-4 mt-6 md:hidden">
        {courses?.map((course, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex flex-col items-center transition-all duration-300 ${
              index === currentIndex
                ? "scale-110" 
                : "opacity-50 hover:opacity-100 hover:scale-105"
            }`}
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white shadow-lg ring-4 ring-blue-500/50"
                : "bg-gray-400 hover:bg-gray-300"
            }`} />
            <span className={`text-xs mt-2 font-medium transition-all duration-300 ${
              index === currentIndex 
                ? "text-gray-900 font-semibold" 
                : "text-gray-500"
            }`}>
              {index + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
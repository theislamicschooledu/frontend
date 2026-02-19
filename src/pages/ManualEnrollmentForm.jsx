// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiInfo,
  FiCopy,
  FiSmartphone,
  FiZap,
  FiSend,
  FiClock,
  FiMessageCircle,
  FiMail,
  FiCheckSquare,
  FiTag,
} from "react-icons/fi";
import { BsPhone, BsRocket, BsCashCoin, BsBank } from "react-icons/bs";
import {
  RiBankCardLine,
  RiSecurePaymentLine,
  RiCustomerServiceLine,
} from "react-icons/ri";
import { MdPayment, MdOutlinePayment, MdVerifiedUser } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../hooks/useAuth";

const ManualEnrollmentForm = () => {
  const { user } = useAuth();
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);
  const [submitting, setSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // লোকেশন স্টেট থেকে কুপনের তথ্য নেওয়া
  const appliedCoupon = location.state?.appliedCoupon || null;
  const couponCode = location.state?.couponCode || null;
  const finalAmount = location.state?.finalAmount || null;

  const [formData, setFormData] = useState({
    studentName: user?.name || "",
    mobileNumber: user?.phone || "",
    transactionId: "",
    paymentMethod: "bkash",
    amount: location.state?.finalAmount || "",
    courseId: courseId,
    couponCode: location.state?.couponCode || undefined
  });

  useEffect(() => {
    if (!user) {
      toast.error('প্লিজ প্রথমে লগইন করুন');
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  const paymentMethods = [
    {
      id: "bkash",
      name: "বিকাশ",
      number: "017XXXXXXXX",
      color: "from-pink-500 to-rose-500",
      icon: FiSmartphone,
    },
    {
      id: "nagad",
      name: "নগদ",
      number: "017XXXXXXXX",
      color: "from-orange-500 to-amber-500",
      icon: FiSmartphone,
    },
    {
      id: "rocket",
      name: "রকেট",
      number: "017XXXXXXXX",
      color: "from-purple-500 to-violet-500",
      icon: BsRocket,
    },
  ];

  // কোর্সের ডাটা লোড করা (যদি স্টেটে না থাকে)
  useEffect(() => {
    if (!course) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // ফাইনাল অ্যামাউন্ট আপডেট করা
  useEffect(() => {
    if (finalAmount) {
      setFormData(prev => ({
        ...prev,
        amount: finalAmount
      }));
    }
  }, [finalAmount]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      toast.error("কোর্সের তথ্য পাওয়া যায়নি");
      navigate(`/course/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyNumber = (number, index) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(index);
    toast.success("নম্বর কপি করা হয়েছে!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate mobile number
    const mobileRegex = /^(\+8801|01)[0-9]{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error("সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)");
      setSubmitting(false);
      return;
    }

    // Validate amount
    if (parseFloat(formData.amount) !== parseFloat(finalAmount || course?.price)) {
      toast.error("সঠিক পরিমাণ টাকা দিন");
      setSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/enrollments/manual", formData);
      toast.success(
        "আপনার আবেদন জমা দেওয়া হয়েছে! অ্যাডমিন অ্যাপ্রুভ করার পর আপনি কোর্স এক্সেস পাবেন।",
      );
      
      setTimeout(() => {
        navigate(`/my-courses`, {
          state: { enrollmentSuccess: true }
        });
      }, 3000);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-hind min-h-screen bg-linear-to-b from-sky-50 to-green-50 text-gray-800 font-sans flex items-center justify-center py-18 px-2 md:py-24 md:px-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row rounded-lg md:rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Payment Instructions */}
        <motion.div
          className="w-full lg:w-2/5 bg-linear-to-br from-green-600 to-emerald-500 text-white p-4 md:p-12 flex flex-col relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="md:mb-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <RiSecurePaymentLine className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">যেভাবে পেমেন্ট করবেন</h2>
                <p className="text-green-100 opacity-90 text-sm">নিচের ধাপগুলো অনুসরণ করুন</p>
              </div>
            </div>
          </div>

          {/* Course Info Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              {course?.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiBookOpen className="text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm">{course?.title}</h3>
                <p className="text-green-100 text-xs">কোর্স ফি: ৳{course?.price}</p>
                {appliedCoupon && (
                  <p className="text-green-100 text-xs flex items-center gap-1">
                    <FiTag size={12} />
                    ডিসকাউন্ট: ৳{course?.price - finalAmount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods Cards */}
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-white rounded-full opacity-60"></div>
                    <h3 className="font-semibold">{method.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <BsBank className="text-white/60" size={14} />
                    <span className="font-mono text-sm">{method.number}</span>
                  </div>
                  <button
                    onClick={() => handleCopyNumber(method.number, index)}
                    className="text-white/80 hover:text-white transition cursor-pointer bg-white/10 p-1.5 rounded-lg"
                  >
                    {copiedIndex === index ? (
                      <FiCheckCircle className="text-green-300" size={16} />
                    ) : (
                      <FiCopy size={16} />
                    )}
                  </button>
                </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full bg-linear-to-r ${method.color} flex items-center gap-1`}
                  >
                    <FiZap size={12} />
                    Send Money
                  </span>
                </div>
                
              </motion.div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <FiInfo className="text-white" />
              নির্দেশনা:
            </h3>
            <ul className="space-y-3 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-white mt-0.5 shrink-0" size={16} />
                <span>পেমেন্ট করার সময় Reference তে আপনার নাম এবং কোর্সের নাম দিন</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-white mt-0.5 shrink-0" size={16} />
                <span>ট্রানজেকশন আইডি সঠিকভাবে লিখুন</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="text-white mt-0.5 shrink-0" size={16} />
                <span>সঠিক পরিমাণ টাকা পাঠান: <span className="font-bold">৳{finalAmount || course?.price}</span></span>
              </li>
              <li className="flex items-start gap-2">
                <FiClock className="text-white mt-0.5 shrink-0" size={16} />
                <span>অ্যাডমিন অ্যাপ্রুভ করার পর আপনি কোর্স এক্সেস পাবেন (২৪ ঘন্টার মধ্যে)</span>
              </li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-green-400/30">
            <div className="text-center mb-3">
              <p className="text-green-100 text-sm flex items-center justify-center gap-1">
                <FiMessageCircle />
                কোনো সমস্যা হলে যোগাযোগ করুন:
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                <FiPhone className="inline mb-1 text-white/80" size={16} />
                <p className="text-xs opacity-80">সাপোর্ট</p>
                <p className="font-semibold text-sm">017XXXXXXXX</p>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                <FiMail className="inline mb-1 text-white/80" size={16} />
                <p className="text-xs opacity-80">ইমেইল</p>
                <p className="font-semibold text-sm">support@example.com</p>
              </div>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-green-100 text-xs">
            <MdVerifiedUser className="text-white" />
            <span>নিরাপদ ও বিশ্বস্ত পেমেন্ট সিস্টেম</span>
          </div>
        </motion.div>

        {/* Right Side - Main Form */}
        <motion.div
          className="w-full lg:w-3/5 bg-white p-8 md:p-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <Link
              to={`/course/${courseId}`}
              className="inline-flex items-center text-green-600 hover:text-green-700 transition mb-6"
            >
              <FiArrowLeft className="mr-2" />
              কোর্সে ফিরে যান
            </Link>
            <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <MdOutlinePayment className="text-green-600" />
              ম্যানুয়াল এনরোলমেন্ট
            </h1>
            <p className="text-gray-600 flex items-center gap-1">
              <FiInfo className="text-green-500" />
              নিচের ফর্ম পূরণ করে আপনার এনরোলমেন্ট রিকোয়েস্ট সাবমিট করুন
            </p>
          </div>

          {/* Applied Coupon Display */}
          {appliedCoupon && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiTag className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      কুপন এপ্লাইড: {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discountValue}% ডিসকাউন্ট` 
                        : `৳${appliedCoupon.discountValue} ডিসকাউন্ট`
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">ডিসকাউন্ট মূল্য</p>
                  <p className="text-lg font-bold text-green-600">৳{finalAmount}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Name */}
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                <FiUser className="inline mr-1 text-green-600" />
                আপনার নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="আপনার পুরো নাম লিখুন"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                <FiPhone className="inline mr-1 text-green-600" />
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <FiInfo className="text-gray-400" size={12} />
                যেমন: 01712345678
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                <RiBankCardLine className="inline mr-1 text-green-600" />
                পেমেন্ট মেথড <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCreditCard className="text-gray-400" />
                </div>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent appearance-none"
                  required
                >
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                <FiSend className="inline mr-1 text-green-600" />
                ট্রানজেকশন আইডি <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCopy className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="TrXIDXXXXXX"
                  required
                />
              </div>
            </div>

            {/* Amount - Read only or disabled */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                <BsCashCoin className="inline mr-1 text-green-600" />
                পেমেন্ট অ্যামাউন্ট <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="টাকার পরিমাণ"
                  required
                  min="1"
                  readOnly={!!finalAmount} // কুপন এপ্লাই করা থাকলে readOnly
                />
              </div>
              {!finalAmount && (
                <p className="text-xs text-gray-500 mt-1">
                  * কোর্সের মূল্য: ৳{course?.price}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-linear-to-r from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-8 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  সাবমিট হচ্ছে...
                </span>
              ) : (
                <>
                  <FiCheckSquare className="text-xl" />
                  এনরোলমেন্ট রিকোয়েস্ট সাবমিট
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ManualEnrollmentForm;
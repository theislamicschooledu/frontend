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
  FiShield,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";
import { BsPhone, BsRocket, BsCashCoin, BsBank } from "react-icons/bs";
import { RiBankCardLine, RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlinePayment, MdVerifiedUser } from "react-icons/md";
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

  const appliedCoupon = location.state?.appliedCoupon || null;
  // eslint-disable-next-line no-unused-vars
  const couponCode = location.state?.couponCode || null;
  const finalAmount = location.state?.finalAmount || null;

  const [formData, setFormData] = useState({
    studentName: user?.name || "",
    mobileNumber: user?.phone || "",
    transactionId: "",
    paymentMethod: "bkash",
    amount: location.state?.finalAmount || "",
    courseId,
    couponCode: location.state?.couponCode || undefined,
  });

  useEffect(() => {
    if (!user) {
      toast.error("প্লিজ প্রথমে লগইন করুন");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  const paymentMethods = [
    {
      id: "bkash",
      name: "বিকাশ",
      number: "017XXXXXXXX",
      color: "from-pink-500 to-rose-500",
      softColor: "bg-pink-50 text-pink-600 border-pink-100",
      icon: FiSmartphone,
    },
    {
      id: "nagad",
      name: "নগদ",
      number: "017XXXXXXXX",
      color: "from-orange-500 to-amber-500",
      softColor: "bg-orange-50 text-orange-600 border-orange-100",
      icon: FiSmartphone,
    },
    {
      id: "rocket",
      name: "রকেট",
      number: "017XXXXXXXX",
      color: "from-purple-500 to-violet-500",
      softColor: "bg-purple-50 text-purple-600 border-purple-100",
      icon: BsRocket,
    },
  ];

  useEffect(() => {
    if (!course) {
      fetchCourseDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (finalAmount) {
      setFormData((prev) => ({
        ...prev,
        amount: finalAmount,
      }));
    }
  }, [finalAmount]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses/${courseId}`);
      setCourse(response.data);
      // eslint-disable-next-line no-unused-vars
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

    const mobileRegex = /^(\+8801|01)[0-9]{9}$/;

    if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error("সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)");
      setSubmitting(false);
      return;
    }

    if (
      parseFloat(formData.amount) !== parseFloat(finalAmount || course?.price)
    ) {
      toast.error("সঠিক পরিমাণ টাকা দিন");
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/enrollments/manual", formData);

      toast.success(
        "আপনার আবেদন জমা দেওয়া হয়েছে! অ্যাডমিন অ্যাপ্রুভ করার পর আপনি কোর্স এক্সেস পাবেন।",
      );

      setTimeout(() => {
        navigate("/my-courses", {
          state: { enrollmentSuccess: true },
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

  const payableAmount = finalAmount || course?.price || 0;
  const discountAmount =
    appliedCoupon && course?.price
      ? Number(course.price) - Number(payableAmount)
      : 0;

  if (loading) {
    return (
      <div className="font-hind min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-4xl border border-[#e6dfcf] bg-white p-8 text-center shadow-[0_20px_60px_rgba(45,75,65,0.10)]"
        >
          <div className="relative mx-auto mb-5 h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-[#dcebe4]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#16745f] border-t-[#16745f]" />
            </motion.div>

            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#eef8f4]">
              <FiCreditCard className="text-xl text-[#16745f]" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-[#263c35]">
            পেমেন্ট তথ্য প্রস্তুত হচ্ছে
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6d7c76]">
            কোর্স ও এনরোলমেন্টের তথ্য লোড করা হচ্ছে।
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      <section className="py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[1.9rem] border border-[#e4ddcf] bg-white shadow-[0_24px_75px_rgba(31,67,55,0.13)]">
            <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
              {/* Left: payment information */}
              <motion.aside
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
                className="relative overflow-hidden bg-[#263c35] p-5 text-white sm:p-7 lg:p-8"
              >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#f7c969]/16" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#ef8f6d]/10" />
                <div className="absolute right-10 top-[46%] h-32 w-32 rounded-full bg-[#8bcdbd]/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f7c969]">
                        <RiSecurePaymentLine className="text-xl" />
                      </span>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                          Payment Guide
                        </p>
                        <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                          যেভাবে পেমেন্ট করবেন
                        </h2>
                      </div>
                    </div>

                    <span className="hidden items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70 sm:inline-flex">
                      <FiLock />
                      Secure
                    </span>
                  </div>

                  {/* Course summary */}
                  <div className="mt-6 rounded-[1.35rem] border border-white/12 bg-white/[0.07] p-3.5 backdrop-blur">
                    <div className="flex items-center gap-3">
                      {course?.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-white/15"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                          <FiBookOpen className="text-xl text-[#f7c969]" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                          Selected Course
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-5 text-white sm:text-base">
                          {course?.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                            মূল মূল্য: ৳{course?.price || 0}
                          </span>

                          {appliedCoupon && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#9de2c9]/15 px-2 py-0.5 text-[10px] font-bold text-[#aee7d3]">
                              <FiTag />৳{discountAmount} ছাড়
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-white/45">
                          Payable
                        </p>
                        <p className="mt-1 text-xl font-extrabold text-[#f7c969]">
                          ৳{payableAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold">
                        পেমেন্ট নম্বরসমূহ
                      </h3>
                      <span className="text-[10px] font-semibold text-white/45">
                        Send Money
                      </span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {paymentMethods.map((method, index) => {
                        const MethodIcon = method.icon;
                        const isSelected = formData.paymentMethod === method.id;

                        return (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.08 + 0.18,
                            }}
                            className={`rounded-[1.2rem] border p-3 backdrop-blur transition ${
                              isSelected
                                ? "border-[#f7c969]/45 bg-white/11"
                                : "border-white/10 bg-white/5.5"
                            }`}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r ${method.color} text-white shadow-lg`}
                                >
                                  <MethodIcon />
                                </span>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-extrabold">
                                      {method.name}
                                    </h4>
                                    {isSelected && (
                                      <span className="rounded-full bg-[#f7c969]/15 px-2 py-0.5 text-[9px] font-bold text-[#f7c969]">
                                        Selected
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                                    <BsBank />
                                    <span className="font-mono">
                                      {method.number}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyNumber(method.number, index)
                                }
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 text-xs font-bold text-white/80 transition hover:bg-white/[0.14] hover:text-white"
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <FiCheckCircle className="text-[#9de2c9]" />
                                    কপি হয়েছে
                                  </>
                                ) : (
                                  <>
                                    <FiCopy />
                                    কপি করুন
                                  </>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/6 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold">
                      <FiInfo className="text-[#f7c969]" />
                      গুরুত্বপূর্ণ নির্দেশনা
                    </h3>

                    <div className="mt-3 space-y-3">
                      {[
                        "Reference-এ আপনার নাম ও কোর্সের নাম লিখুন",
                        "ট্রানজেকশন আইডি সঠিকভাবে কপি করে দিন",
                        `সঠিক পরিমাণ টাকা পাঠান: ৳${payableAmount}`,
                        "অ্যাডমিন অনুমোদনের পর কোর্স এক্সেস সক্রিয় হবে",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 text-xs leading-5 text-white/67 sm:text-sm"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-extrabold text-[#f7c969]">
                            {index + 1}
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Support */}
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="flex items-center justify-center gap-2 text-xs font-semibold text-white/55">
                      <FiMessageCircle />
                      কোনো সমস্যা হলে আমাদের সঙ্গে যোগাযোগ করুন
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white/[0.07] p-3 text-center">
                        <FiPhone className="mx-auto text-[#f7c969]" />
                        <p className="mt-1 text-[10px] text-white/45">
                          সাপোর্ট
                        </p>
                        <p className="mt-1 text-xs font-extrabold">
                          017XXXXXXXX
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.07] p-3 text-center">
                        <FiMail className="mx-auto text-[#f7c969]" />
                        <p className="mt-1 text-[10px] text-white/45">ইমেইল</p>
                        <p className="mt-1 break-all text-xs font-extrabold">
                          support@example.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-white/45">
                    <MdVerifiedUser className="text-[#9de2c9]" />
                    নিরাপদ ও বিশ্বস্ত ম্যানুয়াল পেমেন্ট ব্যবস্থা
                  </div>
                </div>
              </motion.aside>

              {/* Right: enrollment form */}
              <motion.main
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="bg-[#fffdf8] p-5 sm:p-7 lg:p-8 xl:p-10"
              >
                <div className="flex flex-col gap-4 border-b border-[#ece5d8] pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9704b]">
                      Enrollment Form
                    </p>

                    <h2 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-[#263c35] sm:text-3xl">
                      <MdOutlinePayment className="text-[#16745f]" />
                      পেমেন্ট তথ্য দিন
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#71817b]">
                      পেমেন্ট সম্পন্ন করার পর নিচের তথ্যগুলো সঠিকভাবে পূরণ করুন।
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e5f4ee] px-3 py-1.5 text-xs font-extrabold text-[#16745f]">
                    <FiCheckCircle />
                    Step 2 of 2
                  </span>
                </div>

                {/* Applied coupon */}
                {appliedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex flex-col gap-3 rounded-[1.3rem] border border-[#cfe6dc] bg-[#edf8f3] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16745f] text-white">
                        <FiTag />
                      </span>

                      <div>
                        <p className="text-sm font-extrabold text-[#145f50]">
                          কুপন প্রয়োগ হয়েছে: {appliedCoupon.code}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#4d8172]">
                          {appliedCoupon.discountType === "percentage"
                            ? `${appliedCoupon.discountValue}% ডিসকাউন্ট`
                            : `৳${appliedCoupon.discountValue} ডিসকাউন্ট`}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/70 px-4 py-2 text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#71817b]">
                        Discounted Price
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[#16745f]">
                        ৳{finalAmount}
                      </p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Student name */}
                  <div>
                    <label
                      htmlFor="studentName"
                      className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                    >
                      <FiUser className="text-[#16745f]" />
                      আপনার নাম
                      <span className="text-[#d9704b]">*</span>
                    </label>

                    <div className="relative">
                      <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                      <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-4 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                        placeholder="আপনার পুরো নাম লিখুন"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile and payment method */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                      >
                        <FiPhone className="text-[#16745f]" />
                        মোবাইল নম্বর
                        <span className="text-[#d9704b]">*</span>
                      </label>

                      <div className="relative">
                        <BsPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-4 text-sm font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                          placeholder="01XXXXXXXXX"
                          required
                        />
                      </div>

                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#8a9691]">
                        <FiInfo />
                        যেমন: 01712345678
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="paymentMethod"
                        className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                      >
                        <RiBankCardLine className="text-[#16745f]" />
                        পেমেন্ট মেথড
                        <span className="text-[#d9704b]">*</span>
                      </label>

                      <div className="relative">
                        <FiCreditCard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                        <select
                          id="paymentMethod"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          className="h-13 w-full appearance-none rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-10 text-sm font-bold text-[#263c35] outline-none transition focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                          required
                        >
                          {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.name}
                            </option>
                          ))}
                        </select>

                        <FiArrowRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#8b9893]" />
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label
                      htmlFor="transactionId"
                      className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                    >
                      <FiSend className="text-[#7865c9]" />
                      ট্রানজেকশন আইডি
                      <span className="text-[#d9704b]">*</span>
                    </label>

                    <div className="relative">
                      <FiCopy className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                      <input
                        type="text"
                        id="transactionId"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-white pl-11 pr-4 font-mono text-sm font-bold uppercase tracking-wide text-[#263c35] outline-none transition placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-[#9ba6a2] focus:border-[#a99be3] focus:ring-4 focus:ring-[#a99be3]/15"
                        placeholder="TrXIDXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label
                      htmlFor="amount"
                      className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#40554d]"
                    >
                      <BsCashCoin className="text-[#d9704b]" />
                      পেমেন্ট অ্যামাউন্ট
                      <span className="text-[#d9704b]">*</span>
                    </label>

                    <div className="relative">
                      <FiDollarSign className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9893]" />
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`h-13 w-full rounded-xl border pl-11 pr-4 text-sm font-extrabold outline-none transition ${
                          finalAmount
                            ? "border-[#d7e4de] bg-[#f1f6f3] text-[#16745f]"
                            : "border-[#dfe5e0] bg-white text-[#263c35] focus:border-[#8bcdbd] focus:ring-4 focus:ring-[#8bcdbd]/15"
                        }`}
                        placeholder="টাকার পরিমাণ"
                        required
                        min="1"
                        readOnly={!!finalAmount}
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1 font-medium text-[#8a9691]">
                        <FiInfo />
                        কোর্সের নির্ধারিত মূল্য অনুযায়ী পরিমাণ দিন
                      </span>

                      <span className="font-extrabold text-[#16745f]">
                        পরিশোধযোগ্য: ৳{payableAmount}
                      </span>
                    </div>
                  </div>

                  {/* Confirmation */}
                  <div className="flex items-start gap-3 rounded-[1.2rem] border border-[#f0dfba] bg-[#fff9eb] p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7c969]/25 text-[#a97519]">
                      <FiClock />
                    </span>

                    <p className="text-xs leading-6 text-[#756748] sm:text-sm">
                      সাবমিট করার আগে ট্রানজেকশন আইডি, মোবাইল নম্বর এবং
                      পেমেন্টের পরিমাণ পুনরায় যাচাই করুন। অ্যাডমিন অনুমোদনের পর
                      কোর্সটি আপনার অ্যাকাউন্টে যুক্ত হবে।
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ y: submitting ? 0 : -2 }}
                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_15px_34px_rgba(22,116,95,0.24)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {submitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        সাবমিট হচ্ছে...
                      </>
                    ) : (
                      <>
                        <FiCheckSquare className="text-xl" />
                        এনরোলমেন্ট রিকোয়েস্ট সাবমিট
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#8a9691]">
                    <FiShield className="text-[#16745f]" />
                    আপনার জমা দেওয়া তথ্য শুধুমাত্র পেমেন্ট যাচাইয়ের জন্য ব্যবহার
                    করা হবে
                  </p>
                </form>
              </motion.main>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManualEnrollmentForm;

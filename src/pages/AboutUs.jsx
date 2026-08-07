// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiArrowRight,
  FiAward,
  FiBook,
  FiCheck,
  FiClock,
  FiGlobe,
  FiHeart,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiMessageSquare,
  FiPhone,
  FiSend,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaMosque,
  FaPray,
  FaQuran,
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";
import { MdSecurity, MdWorkspacePremium } from "react-icons/md";
import api from "../utils/axios";

const floatingDecorations = [
  { left: "4%", top: "13%", size: 18, delay: 0.2, duration: 6.2 },
  { left: "13%", top: "74%", size: 13, delay: 1.1, duration: 7.1 },
  { left: "31%", top: "28%", size: 15, delay: 0.5, duration: 6.8 },
  { left: "58%", top: "82%", size: 17, delay: 1.5, duration: 7.4 },
  { left: "78%", top: "18%", size: 14, delay: 0.8, duration: 6.5 },
  { left: "93%", top: "65%", size: 19, delay: 1.8, duration: 7.2 },
];

const SectionHeading = ({ badge, title, description, align = "center" }) => (
  <div
    className={`mb-7 sm:mb-9 ${
      align === "left" ? "text-left" : "mx-auto max-w-3xl text-center"
    }`}
  >
    {badge && (
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#073b46]/10 bg-white px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.13em] text-[#08736e] shadow-sm">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ff6542] text-white">
          <HiSparkles size={13} />
        </span>
        {badge}
      </div>
    )}

    <h2 className="text-2xl font-black leading-tight tracking-tight text-[#073b46] sm:text-3xl lg:text-4xl">
      {title}
    </h2>

    {description && (
      <p className="mt-3 text-sm font-medium leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    )}
  </div>
);

const AboutUs = () => {
  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documentation");
      if (res.data.success) {
        setDocumentation(res.data.data);
      } else {
        setError("Failed to load documentation");
        toast.error("Failed to load documentation data");
      }
    } catch (err) {
      console.error("Error fetching documentation:", err);
      setError("Network error. Please try again.");
      toast.error("Failed to fetch documentation");
    } finally {
      setLoading(false);
    }
  };

  // যদি API ডেটা না থাকে, ডিফল্ট ডেটা ব্যবহার করা
  const mission =
    documentation?.ourMission ||
    "প্রযুক্তির মাধ্যমে সঠিক ইসলামী জ্ঞান সহজলভ্য করা। আমরা ঘরে ঘরে দাঈ, হাফেজ ও আলেম গড়ে তুলতে এবং বিশ্বব্যাপী ইসলামের বাণী ছড়িয়ে দিতে নিবেদিত।";
  const vision =
    documentation?.ourVision ||
    "আন্তর্জাতিক মানের একটি অনলাইন শিক্ষা প্ল্যাটফর্ম হিসেবে আত্মপ্রকাশ করা, যা হাটহাজারি কওমি বোর্ড কর্তৃক স্বীকৃত ও সনদপ্রাপ্ত, যেখান থেকে পৃথিবীর যেকোনো প্রান্তের মুসলিম মানসম্মত ইলম অর্জন করতে পারবেন।";

  // Core Values (এটি ডাটাবেস থেকে আসবে না, স্ট্যাটিক রাখছি)
  const coreValues = [
    {
      icon: FaQuran,
      title: "কুরআন-সুন্নাহ ভিত্তিক",
      desc: "সমস্ত শিক্ষা কুরআন ও বিশুদ্ধ সুন্নাহর আলোকে পরিচালিত হয়",
      accent: "bg-[#e9f8f5] text-[#08736e]",
      border: "hover:border-[#62d6c7]",
    },
    {
      icon: GiTeacher,
      title: "প্রশিক্ষিত উস্তায",
      desc: "মাদ্রাসা ও বিশ্ববিদ্যালয় শিক্ষিত অভিজ্ঞ আলেম দ্বারা পাঠদান",
      accent: "bg-[#f2ecff] text-[#7654c8]",
      border: "hover:border-[#cbbdff]",
    },
    {
      icon: MdSecurity,
      title: "নিরাপদ পরিবেশ",
      desc: "শরীয়ত সম্মত ও আদব-কায়দা রক্ষা করে অনলাইন ক্লাস পরিচালনা",
      accent: "bg-[#fff0eb] text-[#e85031]",
      border: "hover:border-[#ffc4b2]",
    },
    {
      icon: FaGraduationCap,
      title: "আন্তর্জাতিক মান",
      desc: "আন্তর্জাতিক কারিকুলাম ও আধুনিক পদ্ধতিতে শিক্ষাদান",
      accent: "bg-[#fff5cc] text-[#9a6900]",
      border: "hover:border-[#f2ce63]",
    },
  ];

  // Platform Stats (এটি ডাটাবেস থেকে আসবে না, স্ট্যাটিক রাখছি)
  const stats = [
    {
      icon: FiUsers,
      value: "১,২৯,০৩২+",
      label: "মোট শিক্ষার্থী",
      color: "bg-[#08736e]",
      soft: "bg-[#e9f8f5]",
    },
    {
      icon: FaChalkboardTeacher,
      value: "১১৪+",
      label: "উস্তায ও স্টাফ",
      color: "bg-[#7654c8]",
      soft: "bg-[#f2ecff]",
    },
    {
      icon: FiBook,
      value: "৪২+",
      label: "ইসলামিক কোর্স",
      color: "bg-[#ff6542]",
      soft: "bg-[#fff0eb]",
    },
    {
      icon: FiAward,
      value: "৯৭%",
      label: "সন্তুষ্টি হার",
      color: "bg-[#e2a318]",
      soft: "bg-[#fff5cc]",
    },
  ];

  // Teaching Methodology (ডাটাবেস থেকে আসবে)
  const methodologies = documentation?.onlineFeatures || [
    "লাইভ ইন্টারেক্টিভ ক্লাসের মাধ্যমে সরাসরি শিক্ষক-শিক্ষার্থী সংযোগ",
    "প্রতিটি ক্লাস রেকর্ডেড ভিডিও হিসেবে সংরক্ষণ (লাইফটাইম এক্সেস)",
    "সাপ্তাহিক অ্যাসাইনমেন্ট ও মাসিক মূল্যায়ন পরীক্ষা",
    "প্রাইভেট ডাউট ক্লিয়ারিং সেশন ও মেন্টরশিপ প্রোগ্রাম",
    "মোবাইল অ্যাপের মাধ্যমে যেকোনো সময় পড়াশোনার সুযোগ",
  ];

  // Accreditation & Recognition (ডাটাবেস থেকে আসবে)
  const accreditations = documentation?.ourAchievement || [
    "হাটহাজারি কওমি বোর্ড কর্তৃক অনুমোদিত",
    "আল-জামিয়াতুল আহলিয়া দারুল উলুম মঈনুল ইসলাম কর্তৃক স্বীকৃত",
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের সাথে অধিভুক্ত",
    "আন্তর্জাতিক ইসলামী বিশ্ববিদ্যালয় মালয়েশিয়া (IIUM) এর সাথে সহযোগিতা",
  ];

  // Contact Information (ডাটাবেস থেকে আসবে)
  const contactInfo = [
    {
      icon: FiPhone,
      title: "হেল্পলাইন",
      details: documentation?.contact?.helpline || [
        "+৮৮০১৭০০-১২৩৪৫৬",
        "+৮৮০১৯১১-৯৮৭৬৫৪",
      ],
      desc: "সকাল ৯টা - রাত ১০টা (শুক্রবার ব্যতীত)",
      accent: "bg-[#e9f8f5] text-[#08736e]",
    },
    {
      icon: FiMail,
      title: "ইমেইল",
      details: documentation?.contact?.email || [
        "support@islamicacademy.com",
        "admission@islamicacademy.com",
      ],
      desc: "২৪ ঘন্টার মধ্যে উত্তর প্রদান",
      accent: "bg-[#f2ecff] text-[#7654c8]",
    },
    {
      icon: FiMapPin,
      title: "হেড অফিস",
      details: documentation?.contact?.headOffice
        ? [documentation.contact.headOffice]
        : ["১২৩ ইসলামিক টাওয়ার, বিজয়নগর", "ঢাকা-১২১২, বাংলাদেশ"],
      desc: "সোম-বৃহঃ সকাল ১০টা - সন্ধ্যা ৬টা",
      accent: "bg-[#fff0eb] text-[#e85031]",
    },
    {
      icon: FiGlobe,
      title: "ওয়েবসাইট",
      details: documentation?.contact?.website || [
        "www.islamicacademy.com",
        "www.learnislam.tv",
      ],
      desc: "২৪/৭ লাইভ সাপোর্ট",
      accent: "bg-[#fff5cc] text-[#9a6900]",
    },
  ];

  // Social Media (ডাটাবেস থেকে আসবে)
  const socialMedia = documentation?.socialMedia
    ? [
        {
          name: "ফেসবুক পেজ",
          link:
            documentation.socialMedia.facebook || "facebook.com/islamicacademy",
          icon: "fb",
          iconComponent: FiMessageSquare,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          name: "ইউটিউব চ্যানেল",
          link:
            documentation.socialMedia.youtube || "youtube.com/@islamicacademy",
          icon: "yt",
          iconComponent: FiVideo,
          color: "text-red-600",
          bgColor: "bg-red-100",
          subscribers: "৫০০K+",
        },
        {
          name: "হোয়াটসঅ্যাপ গ্রুপ",
          link: `https://wa.me/${
            documentation.socialMedia.whatsapp || "8801700123456"
          }`,
          icon: "wa",
          iconComponent: FiMessageCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          name: "টেলিগ্রাম চ্যানেল",
          link: `https://t.me/${(
            documentation.socialMedia.telegram || "islamicacademy"
          ).replace("@", "")}`,
          icon: "tg",
          iconComponent: FiSend,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          members: "১০০K+",
        },
      ]
    : [
        {
          name: "ফেসবুক পেজ",
          link: "facebook.com/islamicacademy",
          icon: "fb",
          iconComponent: FiMessageSquare,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          name: "ইউটিউব চ্যানেল",
          link: "youtube.com/@islamicacademy",
          icon: "yt",
          iconComponent: FiVideo,
          color: "text-red-600",
          bgColor: "bg-red-100",
          subscribers: "৫০০K+",
        },
        {
          name: "হোয়াটসঅ্যাপ গ্রুপ",
          link: "wa.me/8801700123456",
          icon: "wa",
          iconComponent: FiMessageCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          name: "টেলিগ্রাম চ্যানেল",
          link: "t.me/islamicacademy",
          icon: "tg",
          iconComponent: FiSend,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          members: "১০০K+",
        },
      ];

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-linear-to-b from-[#fff9e7] via-[#eef9ff] to-[#f2fbf6] font-hind">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-5 h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-[#62d6c7]/25" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#08736e]"
            />
            <div className="absolute inset-3 grid place-items-center rounded-full bg-[#fff4c9] text-[#073b46]">
              <FaMosque size={25} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#073b46]">লোড হচ্ছে...</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            আমাদের সম্পর্কে তথ্য প্রস্তুত হচ্ছে।
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-[#fff9e7] via-[#eef9ff] to-[#f2fbf6] font-hind text-slate-800">
      {/* Page decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {floatingDecorations.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-[#ffd36e]/45"
            style={{ left: item.left, top: item.top }}
            animate={{
              y: [0, -13, 0],
              rotate: [0, 15, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <HiSparkles size={item.size} />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative isolate z-10 overflow-hidden bg-[#fff4c9] pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#ff6542]/14"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 top-6 h-80 w-80 rounded-full bg-[#62d6c7]/24"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-5 left-[46%] h-40 w-40 rounded-full bg-[#8b6fe8]/10"
        />

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-16 hidden h-14 w-14 place-items-center rounded-3xl border-4 border-white bg-[#ff6542] text-white shadow-lg md:grid"
        >
          <FaMosque size={27} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 11, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-20 hidden h-12 w-12 place-items-center rounded-full border-4 border-white bg-[#8b6fe8] text-white shadow-lg md:grid"
        >
          <HiSparkles size={24} />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#073b46]/10 bg-white/75 px-3.5 py-1.5 text-xs font-extrabold text-[#073b46] shadow-sm backdrop-blur-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#08736e] text-white">
                <FaMosque size={13} />
              </span>
              ২০০৫ সাল থেকে ইসলামী শিক্ষা বিস্তারে নিবেদিত
            </div>

            <h1 className="text-3xl font-black leading-[1.1] tracking-tight text-[#073b46] sm:text-4xl lg:text-5xl">
              ইসলামী জ্ঞানের যাত্রায়
              <span className="relative ml-2 inline-block text-[#ff6542]">
                আপনার বিশ্বস্ত সঙ্গী
                <svg
                  viewBox="0 0 260 18"
                  aria-hidden="true"
                  className="absolute -bottom-3 left-0 h-4 w-full text-[#ffd36e]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 12C66 3 151 3 257 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base sm:leading-8">
              এশিয়ার বৃহত্তম অনলাইন ইসলামিক লার্নিং প্ল্যাটফর্ম, যেখানে ১৮
              বছরের অভিজ্ঞতায় আমরা তৈরি করেছি একটি সহজ, বিশ্বস্ত ও মানসম্মত
              শিক্ষা পরিবেশ।
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-extrabold text-[#08736e] shadow-sm">
                <FiUsers size={15} /> ১ লক্ষের বেশি শিক্ষার্থী
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-extrabold text-[#7654c8] shadow-sm">
                <FiBook size={15} /> মানসম্মত ইসলামিক কোর্স
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-extrabold text-[#e85031] shadow-sm">
                <FiAward size={15} /> অভিজ্ঞ উস্তায
              </span>
            </div>
          </motion.div>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="absolute -bottom-px left-0 h-10 w-full sm:h-14"
        >
          <path
            d="M0 52C158 94 334 101 500 66C692 26 809 15 1002 54C1167 87 1308 91 1440 42V110H0Z"
            fill="#eef9ff"
          />
        </svg>
      </section>

      {error && (
        <section className="relative z-20 mx-auto -mt-5 max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border border-[#ffd1c2] bg-[#fff0eb] px-4 py-3 text-center text-sm font-bold text-[#c9472b] shadow-sm">
            {error} — ডিফল্ট তথ্য দেখানো হচ্ছে।
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-4xl border-4 border-white bg-[#08736e] p-6 text-white shadow-[0_18px_45px_rgba(7,59,70,0.13)] sm:p-7"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[#62d6c7]/25" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-[#fff4c9] ring-1 ring-white/20">
                  <FaPray size={23} />
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#aee9df]">
                    Our Purpose
                  </span>
                  <h2 className="text-2xl font-black sm:text-3xl">
                    আমাদের মিশন
                  </h2>
                </div>
              </div>

              <p className="text-sm font-medium leading-7 text-[#e6fffa] sm:text-base">
                {mission}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-xs font-extrabold text-white ring-1 ring-white/15">
                <FiCheck className="text-[#ffd36e]" /> ১৮ বছরের সফল অভিজ্ঞতা
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-4xl border-4 border-white bg-[#7654c8] p-6 text-white shadow-[0_18px_45px_rgba(79,61,137,0.13)] sm:p-7"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[#ffcf66]/20" />

            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-[#fff4c9] ring-1 ring-white/20">
                  <MdWorkspacePremium size={25} />
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ded5ff]">
                    Our Direction
                  </span>
                  <h2 className="text-2xl font-black sm:text-3xl">
                    আমাদের ভিশন
                  </h2>
                </div>
              </div>

              <p className="text-sm font-medium leading-7 text-[#f4f0ff] sm:text-base">
                {vision}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-xs font-extrabold text-white ring-1 ring-white/15">
                <FiCheck className="text-[#ffd36e]" /> ৫টি দেশে আমাদের কার্যক্রম
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Foundation"
          title="আমাদের মূল্যবোধ ও আদর্শ"
          description="যে নীতি ও আদর্শের উপর ভিত্তি করে আমরা প্রতিটি শিক্ষা কার্যক্রম পরিচালনা করি।"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className={`group rounded-3xl border-2 border-white bg-white p-5 shadow-[0_12px_32px_rgba(7,59,70,0.08)] transition duration-300 ${value.border}`}
              >
                <div
                  className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${value.accent}`}
                >
                  <Icon size={23} />
                </div>
                <h3 className="text-lg font-black text-[#073b46]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                  {value.desc}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 overflow-hidden bg-[#073b46] py-11 text-white sm:py-14">
        <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-[#62d6c7]/12" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#ff6542]/12" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 text-center sm:mb-9">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#aee9df] ring-1 ring-white/10">
              <FiAward size={14} /> Our Impact
            </div>
            <h2 className="text-2xl font-black sm:text-3xl lg:text-4xl">
              গর্বের অর্জন ও পরিসংখ্যান
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-3xl border border-white/10 bg-white/8 p-4 text-center backdrop-blur-sm sm:p-5"
                >
                  <div
                    className={`mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg sm:h-12 sm:w-12 ${stat.color}`}
                  >
                    <Icon size={21} />
                  </div>
                  <div className="text-2xl font-black sm:text-3xl lg:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-bold text-slate-300 sm:text-sm">
                    {stat.label}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching Methodology & Accreditation */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-11 sm:px-6 sm:py-14 lg:px-8">
        <SectionHeading
          badge="How We Teach"
          title="আমাদের শিক্ষা পদ্ধতি"
          description="আধুনিক প্রযুক্তি ও প্রথাগত ইসলামী শিক্ষা পদ্ধতির সমন্বয়ে তৈরি একটি সহজ, কার্যকর ও মানবিক শিক্ষা ব্যবস্থা।"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65 }}
          className="overflow-hidden rounded-4xl border-4 border-white bg-white shadow-[0_18px_48px_rgba(7,59,70,0.09)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-[#eef9f7] p-5 sm:p-7 lg:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#08736e] text-white shadow-lg">
                  <FaChalkboardTeacher size={23} />
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#08736e]">
                    Learning Experience
                  </span>
                  <h3 className="text-xl font-black text-[#073b46] sm:text-2xl">
                    অনলাইন লার্নিং ফিচারস
                  </h3>
                </div>
              </div>

              <ul className="space-y-3">
                {methodologies && methodologies.length > 0 ? (
                  methodologies.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.07 }}
                      className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#08736e] text-white">
                        <FiCheck size={13} />
                      </span>
                      <span className="text-sm font-semibold leading-6 text-slate-700">
                        {item}
                      </span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-sm font-semibold text-slate-500">
                    লোড হচ্ছে...
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-[#faf7ff] p-5 sm:p-7 lg:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7654c8] text-white shadow-lg">
                  <MdWorkspacePremium size={24} />
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7654c8]">
                    Recognition
                  </span>
                  <h3 className="text-xl font-black text-[#073b46] sm:text-2xl">
                    স্বীকৃতি ও অনুমোদন
                  </h3>
                </div>
              </div>

              <ul className="space-y-3">
                {accreditations && accreditations.length > 0 ? (
                  accreditations.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.07 }}
                      className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#7654c8] text-white">
                        <FiAward size={13} />
                      </span>
                      <span className="text-sm font-semibold leading-6 text-slate-700">
                        {item}
                      </span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-sm font-semibold text-slate-500">
                    লোড হচ্ছে...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Information */}
      <section className="relative z-10 border-y border-[#073b46]/8 bg-[#fffdf5] py-11 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Get In Touch"
            title="যোগাযোগের ঠিকানা"
            description="আপনার প্রশ্ন, ভর্তি সংক্রান্ত তথ্য বা যেকোনো সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;

              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border-2 border-white bg-white p-5 shadow-[0_12px_32px_rgba(7,59,70,0.08)] transition duration-300 hover:border-[#62d6c7]/50"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl ${contact.accent}`}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="text-lg font-black text-[#073b46]">
                      {contact.title}
                    </h3>
                  </div>

                  <div className="min-h-13 space-y-1.5">
                    {Array.isArray(contact.details) ? (
                      contact.details.map((detail, idx) => (
                        <p
                          key={idx}
                          className="wrap-break-word text-sm font-bold text-slate-700"
                        >
                          {detail}
                        </p>
                      ))
                    ) : (
                      <p className="wrap-break-word text-sm font-bold text-slate-700">
                        {contact.details}
                      </p>
                    )}
                  </div>

                  <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs font-semibold leading-5 text-slate-500">
                    <FiClock className="mt-0.5 shrink-0 text-[#08736e]" />
                    {contact.desc}
                  </p>
                </motion.article>
              );
            })}
          </div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-7 rounded-4xl border-4 border-white bg-[#eef9f7] p-5 shadow-[0_15px_38px_rgba(7,59,70,0.08)] sm:p-7"
          >
            <div className="mb-5 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#08736e]">
                  Social Community
                </span>
                <h3 className="mt-1 text-xl font-black text-[#073b46] sm:text-2xl">
                  সামাজিক যোগাযোগ মাধ্যমে যুক্ত থাকুন
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-500 sm:max-w-xs sm:text-right">
                সর্বশেষ ক্লাস, ঘোষণা ও শিক্ষামূলক কনটেন্ট পেতে আমাদের অনুসরণ
                করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {socialMedia.map((social, index) => {
                const IconComponent = social.iconComponent;

                return (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl border border-[#073b46]/8 bg-white p-4 shadow-sm transition hover:border-[#62d6c7] hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${social.bgColor}`}
                      >
                        <IconComponent className={`text-xl ${social.color}`} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-[#073b46]">
                          {social.name}
                        </h4>
                        <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                          {social.link.replace(/^(https?:\/\/)?/, "")}
                        </p>
                      </div>
                      <FiArrowRight className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#08736e]" />
                    </div>

                    {(social.subscribers || social.members) && (
                      <div className="mt-3 rounded-xl bg-[#fffdf5] px-3 py-2 text-center text-xs font-extrabold text-[#9a6900]">
                        {social.subscribers &&
                          `${social.subscribers} সাবস্ক্রাইবার`}
                        {social.members && `${social.members} সদস্য`}
                      </div>
                    )}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 overflow-hidden bg-[#08736e] py-12 text-white sm:py-16">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#62d6c7]/20" />
        <div className="absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-[#ff6542]/16" />
        <div className="absolute left-[47%] top-8 h-32 w-32 rounded-full bg-[#ffd36e]/10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-extrabold ring-1 ring-white/15 backdrop-blur-sm">
              <FiHeart className="text-[#ffb8a6]" />
              ১৮ বছর ধরে ইসলামী শিক্ষার সেবায় নিয়োজিত
            </div>

            <h2 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
              ইসলামী জ্ঞানার্জনের মহান যাত্রায় শরিক হোন
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-[#d8f5ef] sm:text-base">
              এখনই রেজিস্ট্রেশন করুন এবং একটি ফ্রি ডেমো ক্লাসে অংশগ্রহণ করুন।
              আমাদের অভিজ্ঞ উস্তাযদের সাথে সরাসরি কথা বলুন।
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#fff4c9] px-6 py-3.5 text-sm font-black text-[#073b46] shadow-lg transition hover:-translate-y-0.5 hover:bg-white">
                <FiPhone />
                ফ্রি কনসালটেশন বুক করুন
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/70 bg-white/5 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/12">
                <FiMail />
                ইমেইলে তথ্য চাই
              </button>
            </div>

            <p className="mt-5 text-xs font-semibold leading-5 text-[#aee9df]">
              সকাল ৯টা থেকে রাত ১০টা পর্যন্ত খোলা (শুক্রবার দুপুর ১২টা থেকে ৩টা
              পর্যন্ত বন্ধ)
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

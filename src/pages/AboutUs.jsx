// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiUsers, FiAward, FiBook, FiMail, FiPhone, FiMapPin, FiGlobe, FiClock, FiCheck, FiHeart } from "react-icons/fi";
import { FaChalkboardTeacher, FaHandshake, FaPray, FaQuran, FaMosque, FaGraduationCap } from "react-icons/fa";
import { MdWorkspacePremium, MdSecurity } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";

const AboutUs = () => {
  // Mission & Vision Statements
  const mission = "প্রযুক্তির মাধ্যমে সঠিক ইসলামী জ্ঞান সহজলভ্য করা। আমরা ঘরে ঘরে দাঈ, হাফেজ ও আলেম গড়ে তুলতে এবং বিশ্বব্যাপী ইসলামের বাণী ছড়িয়ে দিতে নিবেদিত।";
  const vision = "আন্তর্জাতিক মানের একটি অনলাইন শিক্ষা প্ল্যাটফর্ম হিসেবে আত্মপ্রকাশ করা, যা হাটহাজারি কওমি বোর্ড কর্তৃক স্বীকৃত ও সনদপ্রাপ্ত, যেখান থেকে পৃথিবীর যেকোনো প্রান্তের মুসলিম মানসম্মত ইলম অর্জন করতে পারবেন।";

  // Core Values
  const coreValues = [
    { icon: FaQuran, title: "কুরআন-সুন্নাহ ভিত্তিক", desc: "সমস্ত শিক্ষা কুরআন ও বিশুদ্ধ সুন্নাহর আলোকে পরিচালিত হয়" },
    { icon: GiTeacher, title: "প্রশিক্ষিত উস্তায", desc: "মাদ্রাসা ও বিশ্ববিদ্যালয় শিক্ষিত অভিজ্ঞ আলেম দ্বারা পাঠদান" },
    { icon: MdSecurity, title: "নিরাপদ পরিবেশ", desc: "শরীয়ত সম্মত ও আদব-কায়দা রক্ষা করে অনলাইন ক্লাস পরিচালনা" },
    { icon: FaGraduationCap, title: "আন্তর্জাতিক মান", desc: "আন্তর্জাতিক কারিকুলাম ও আধুনিক পদ্ধতিতে শিক্ষাদান" },
  ];

  // Platform Stats
  const stats = [
    { icon: FiUsers, value: "১,২৯,০৩২+", label: "মোট শিক্ষার্থী", color: "from-blue-500 to-cyan-500" },
    { icon: FaChalkboardTeacher, value: "১১৪+", label: "উস্তায ও স্টাফ", color: "from-purple-500 to-pink-500" },
    { icon: FiBook, value: "৪২+", label: "ইসলামিক কোর্স", color: "from-green-500 to-emerald-500" },
    { icon: FiAward, value: "৯৭%", label: "সন্তুষ্টি হার", color: "from-amber-500 to-orange-500" },
  ];

  // Teaching Methodology
  const methodologies = [
    "লাইভ ইন্টারেক্টিভ ক্লাসের মাধ্যমে সরাসরি শিক্ষক-শিক্ষার্থী সংযোগ",
    "প্রতিটি ক্লাস রেকর্ডেড ভিডিও হিসেবে সংরক্ষণ (লাইফটাইম এক্সেস)",
    "সাপ্তাহিক অ্যাসাইনমেন্ট ও মাসিক মূল্যায়ন পরীক্ষা",
    "প্রাইভেট ডাউট ক্লিয়ারিং সেশন ও মেন্টরশিপ প্রোগ্রাম",
    "মোবাইল অ্যাপের মাধ্যমে যেকোনো সময় পড়াশোনার সুযোগ",
  ];

  // Accreditation & Recognition
  const accreditations = [
    "হাটহাজারি কওমি বোর্ড কর্তৃক অনুমোদিত",
    "আল-জামিয়াতুল আহলিয়া দারুল উলুম মঈনুল ইসলাম কর্তৃক স্বীকৃত",
    "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশের সাথে অধিভুক্ত",
    "আন্তর্জাতিক ইসলামী বিশ্ববিদ্যালয় মালয়েশিয়া (IIUM) এর সাথে সহযোগিতা",
  ];

  // Contact Information
  const contactInfo = [
    { icon: FiPhone, title: "হেল্পলাইন", details: ["+৮৮০১৭০০-১২৩৪৫৬", "+৮৮০১৯১১-৯৮৭৬৫৪"], desc: "সকাল ৯টা - রাত ১০টা (শুক্রবার ব্যতীত)" },
    { icon: FiMail, title: "ইমেইল", details: ["support@islamicacademy.com", "admission@islamicacademy.com"], desc: "২৪ ঘন্টার মধ্যে উত্তর প্রদান" },
    { icon: FiMapPin, title: "হেড অফিস", details: ["১২৩ ইসলামিক টাওয়ার, বিজয়নগর", "ঢাকা-১২১২, বাংলাদেশ"], desc: "সোম-বৃহঃ সকাল ১০টা - সন্ধ্যা ৬টা" },
    { icon: FiGlobe, title: "ওয়েবসাইট", details: ["www.islamicacademy.com", "www.learnislam.tv"], desc: "২৪/৭ লাইভ সাপোর্ট" },
  ];

  // Social Media
  const socialMedia = [
    { name: "ফেসবুক পেজ", link: "facebook.com/islamicacademy", icon: "fb" },
    { name: "ইউটিউব চ্যানেল", link: "youtube.com/@islamicacademy", icon: "yt", subscribers: "৫০০K+" },
    { name: "হোয়াটসঅ্যাপ গ্রুপ", link: "wa.me/8801700123456", icon: "wa" },
    { name: "টেলিগ্রাম চ্যানেল", link: "t.me/islamicacademy", icon: "tg", members: "১০০K+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="pt-16 sm:pt-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: "100px 100px"
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FaMosque className="text-amber-300" />
              <span className="text-sm font-medium">২০০৫ সাল থেকে ইসলামী শিক্ষা বিস্তারে নিবেদিত</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
              ইসলামী জ্ঞানের যাত্রায় <span className="text-amber-300">আপনার বিশ্বস্ত সঙ্গী</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              এশিয়ার বৃহত্তম অনলাইন ইসলামিক লার্নিং প্ল্যাটফর্ম, যেখানে ১৮ বছরের অভিজ্ঞতায় আমরা তৈরি করেছি এক আদর্শ শিক্ষা পরিবেশ।
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <FaPray className="text-2xl" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold">আমাদের মিশন</h3>
            </div>
            <p className="text-blue-50 text-lg leading-relaxed">{mission}</p>
            <div className="mt-6 flex items-center gap-2 text-blue-100">
              <FiCheck className="text-green-300" />
              <span className="text-sm">১৮ বছরের সফল অভিজ্ঞতা</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <MdWorkspacePremium className="text-2xl" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold">আমাদের ভিশন</h3>
            </div>
            <p className="text-amber-50 text-lg leading-relaxed">{vision}</p>
            <div className="mt-6 flex items-center gap-2 text-amber-100">
              <FiCheck className="text-green-300" />
              <span className="text-sm">৫ টি দেশে আমাদের কার্যক্রম</span>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-4">আমাদের মূল্যবোধ ও আদর্শ</h2>
          <p className="text-gray-600 text-center text-lg mb-10 lg:mb-12 max-w-3xl mx-auto">যে নীতি ও আদর্শের উপর ভিত্তি করে আমরা আমাদের শিক্ষা কার্যক্রম পরিচালনা করি</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                  <value.icon className="text-2xl text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-10 lg:mb-12">গর্বের অর্জন ও পরিসংখ্যান</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                      <stat.icon className="text-2xl" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Teaching Methodology */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">আমাদের শিক্ষা পদ্ধতি</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">আধুনিক প্রযুক্তি ও প্রথাগত ইসলামী শিক্ষা পদ্ধতির সমন্বয়ে আমরা তৈরি করেছি অনন্য এক শিক্ষা ব্যবস্থা</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaChalkboardTeacher className="text-blue-600" />
                  অনলাইন লার্নিং ফিচারস
                </h3>
                <ul className="space-y-4">
                  {methodologies.map((item, index) => (
                    <motion.li key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <FiCheck className="text-white text-sm" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FiAward className="text-purple-600" />
                  স্বীকৃতি ও অনুমোদন
                </h3>
                <ul className="space-y-4">
                  {accreditations.map((item, index) => (
                    <motion.li key={index} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <MdWorkspacePremium className="text-white text-sm" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 lg:py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="text-center mb-10 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">যোগাযোগের ঠিকানা</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">আমাদের সাথে যে কোনো প্রয়োজনে যোগাযোগ করতে পারেন। আমরা আপনার সেবায় সদা প্রস্তুত</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {contactInfo.map((contact, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100">
                      <contact.icon className="text-xl text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{contact.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {contact.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                    <FiClock className="text-gray-400" />
                    {contact.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">সামাজিক যোগাযোগ মাধ্যমে আমাদের সাথে যুক্ত থাকুন</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {socialMedia.map((social, index) => (
                  <motion.a key={index} href={`https://${social.link}`} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                    <div className="text-2xl mb-2">
                      {social.icon === 'fb' && <span className="text-blue-600">f</span>}
                      {social.icon === 'yt' && <span className="text-red-600">▶️</span>}
                      {social.icon === 'wa' && <span className="text-green-600">✆</span>}
                      {social.icon === 'tg' && <span className="text-blue-500">✈️</span>}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{social.name}</h4>
                    <p className="text-sm text-gray-600 break-all">{social.link}</p>
                    {social.subscribers && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">{social.subscribers} সাবস্ক্রাইবার</p>
                    )}
                    {social.members && (
                      <p className="text-xs text-green-600 mt-1 font-medium">{social.members} সদস্য</p>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FiHeart className="text-red-300" />
              <span className="text-sm font-medium">১৮ বছর ধরে ইসলামী শিক্ষার সেবায় নিয়োজিত</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">ইসলামী জ্ঞানার্জনের এই মহান যাত্রায় শরিক হোন</h2>
            <p className="text-xl text-blue-100 mb-8">এখনই রেজিস্ট্রেশন করুন এবং একটি ফ্রি ডেমো ক্লাসে অংশগ্রহণ করুন। আমাদের অভিজ্ঞ উস্তাযদের সাথে সরাসরি কথা বলুন।</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg">
                <span className="flex items-center justify-center gap-2">
                  <FiPhone />
                  ফ্রি কনসালটেশন বুক করুন
                </span>
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                <span className="flex items-center justify-center gap-2">
                  <FiMail />
                  ইমেইলে তথ্য চাই
                </span>
              </button>
            </div>
            <p className="text-blue-200 mt-6 text-sm">সকাল ৯টা থেকে রাত ১০টা পর্যন্ত খোলা (শুক্রবার দুপুর ১২টা থেকে ৩টা পর্যন্ত বন্ধ)</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
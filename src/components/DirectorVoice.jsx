import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";
import {
  FiBookOpen,
  FiFeather,
  FiHeart,
  FiMessageCircle,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import TypingAnimation from "./TypingAnimation";
import api from "../utils/axios";
import { useLanguage } from "../hooks/useLanguage";

const DECORATIONS = [
  {
    id: 1,
    left: "5%",
    top: "20%",
    size: 24,
    duration: 6,
    delay: 0,
    rotate: 8,
    icon: "star",
  },
  {
    id: 2,
    left: "88%",
    top: "25%",
    size: 20,
    duration: 7,
    delay: 0.6,
    rotate: -10,
    icon: "heart",
  },
  {
    id: 3,
    left: "12%",
    top: "75%",
    size: 22,
    duration: 5.5,
    delay: 1.2,
    rotate: -8,
    icon: "book",
  },
  {
    id: 4,
    left: "85%",
    top: "72%",
    size: 18,
    duration: 6.5,
    delay: 0.9,
    rotate: 10,
    icon: "star",
  },
];

const ICONS = {
  star: HiSparkles,
  book: FiBookOpen,
  heart: FiHeart,
};

const DirectorVoiceSkeleton = () => {
  const { t } = useLanguage();

  return (
    <section
      id="director-message"
      className="relative overflow-hidden bg-[#faf8f5] px-4 py-16 font-hind sm:px-6 lg:py-24"
      aria-label={t("home.director.loading")}
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mx-auto mb-12 h-9 w-52 rounded-full bg-[#e8e4f2]" />
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mx-auto h-72 w-64 rounded-3xl bg-[#e8e4f2] sm:h-96 sm:w-80" />
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-10">
            <div className="mb-5 h-7 w-3/5 rounded-full bg-[#e8e4f2]" />
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-[#f0eef5]" />
              <div className="h-4 rounded-full bg-[#f0eef5]" />
              <div className="h-4 w-11/12 rounded-full bg-[#f0eef5]" />
              <div className="h-4 w-4/5 rounded-full bg-[#f0eef5]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DirectorVoice = () => {
  const { t } = useLanguage();
  const directorName = t("home.director.name");

  const [directorVoice, setDirectorVoice] = useState(null);
  const [status, setStatus] = useState("loading");
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    const fetchVoice = async () => {
      try {
        setStatus("loading");

        const response = await api.get("/documentation", {
          signal: controller.signal,
        });

        const voice = response?.data?.data?.principalVoice;

        if (!voice) {
          setStatus("empty");
          return;
        }

        setDirectorVoice(voice);
        setStatus("success");
      } catch (error) {
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
          return;
        }

        console.error("Unable to load director voice:", error);
        setStatus("error");
      }
    };

    fetchVoice();

    return () => controller.abort();
  }, []);

  if (status === "loading") {
    return <DirectorVoiceSkeleton />;
  }

  if (status === "error" || status === "empty" || !directorVoice) {
    return (
      <section
        id="director-message"
        className="relative overflow-hidden bg-[#faf8f5] px-4 py-16 font-hind sm:px-6 lg:py-24"
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3edf9] text-[#7b5bb2]">
            <FiMessageCircle size={30} />
          </div>
          <h2 className="text-2xl font-bold text-[#49366f]">
            {t("home.director.unavailableTitle")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            {t("home.director.unavailableDescription")}
          </p>
        </div>
      </section>
    );
  }

  const directorTitle =
    directorVoice?.title || t("home.director.fallbackTitle");

  return (
    <section
      id="director-message"
      className="relative overflow-hidden bg-[#faf8f5] px-4 py-16 font-hind sm:px-6 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 top-20 h-64 w-64 rounded-full bg-[#7b5bb2]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 bottom-20 h-64 w-64 rounded-full bg-[#fa7478]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
      >
        {DECORATIONS.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.id}
              className="absolute flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/60 text-[#7b5bb2] shadow-sm backdrop-blur-sm"
              style={{
                left: item.left,
                top: item.top,
              }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                      rotate: [0, item.rotate, 0],
                    }
              }
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon size={item.size} />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-[#f3edf9] px-4 py-1.5 text-sm font-semibold text-[#7b5bb2]">
            <HiSparkles className="text-[#7b5bb2]" />
            {t("home.director.badge")}
          </div>
          <h2 className="font-baloo text-3xl font-bold tracking-tight text-[#2d1b4e] sm:text-4xl lg:text-5xl">
            {t("home.director.heading")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 sm:text-base">
            {t("home.director.description")}
          </p>
        </motion.div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* পরিচালকের ছবি */}
          <motion.div
            className="flex justify-center"
            initial={reduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="relative w-full max-w-sm">
              {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-[#7b5bb2]/10 to-[#fa7478]/10"
              />

              <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">
                <div className="relative aspect-4/5 overflow-hidden bg-[#f7efe3]">
                  {directorVoice?.photo && !imageFailed ? (
                    <motion.img
                      src={directorVoice.photo}
                      alt={`${directorName}, ${directorTitle}`}
                      className="h-full w-full object-cover object-top"
                      onError={() => setImageFailed(true)}
                      initial={reduceMotion ? false : { scale: 1.05 }}
                      whileInView={reduceMotion ? undefined : { scale: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#f3edf9] to-[#faf8f5] text-[#7b5bb2]">
                      <FiUser size={80} />
                    </div>
                  )}

                  {/* ওভারলে - হালকা */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/40 to-transparent" />

                  {/* নামের ব্যাজ */}
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <p className="text-xl font-bold">{directorName}</p>
                    <p className="mt-0.5 text-sm font-medium text-white/80">
                      {directorTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* মেসেজ কার্ড - স্ক্রলেবল টেক্সট এরিয়া */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 30 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8 lg:p-10">
              {/* আইকন */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7b5bb2] text-white shadow-md">
                <FiFeather size={22} />
              </div>

              {/* স্ক্রলেবল টেক্সট এরিয়া */}
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-1 -top-6 select-none font-serif text-6xl leading-none text-[#7b5bb2]/10"
                >
                  “
                </span>

                {/* এখানে নির্দিষ্ট উচ্চতা দিয়ে স্ক্রল যোগ করা হয়েছে */}
                <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#7b5bb2]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#7b5bb2]/50">
                  <div className="text-justify text-base font-medium leading-7 text-gray-700 sm:text-lg sm:leading-8">
                    <TypingAnimation
                      text={directorVoice?.text || ""}
                      speed={20}
                      delay={550}
                      className="text-base leading-7 sm:text-lg sm:leading-8"
                    />
                  </div>
                </div>
              </div>

              {/* ফুটার */}
              <motion.div
                className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div>
                  <p className="text-base font-bold text-[#2d1b4e]">
                    {directorName}
                  </p>
                  <p className="text-sm text-gray-500">{directorTitle}</p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#f3edf9] px-4 py-1.5 text-xs font-semibold text-[#7b5bb2]">
                  <FiHeart className="text-[#fa7478]" />
                  {t("home.director.footerBadge")}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DirectorVoice;

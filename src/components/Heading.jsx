import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";

const Heading = ({ text1, text2, label, align = "center", className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  const isLeftAligned = align === "left";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative isolate mb-12 overflow-hidden font-hind md:my-16 lg:my-20 ${
        isLeftAligned ? "text-left" : "text-center"
      } ${className}`}
    >
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.span
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -7, 0],
                  rotate: [0, 8, 0],
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-4 hidden h-4 w-4 rounded-full bg-[#ff6542]/25 sm:block"
        />

        <motion.span
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 0],
                }
          }
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[9%] top-8 hidden h-6 w-6 rounded-full border-4 border-[#073b46]/10 sm:block"
        />

        <div className="absolute left-1/2 top-1/2 h-28 w-[75%] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff8da]/60 blur-3xl" />
      </div>

      <div
        className={`relative mx-auto ${
          isLeftAligned ? "max-w-3xl" : "max-w-4xl"
        }`}
      >
        {/* Optional top label */}
        {label && (
          <motion.div
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.85,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: 0.1,
            }}
            className={`mb-4 inline-flex items-center gap-2 rounded-full bg-[#fff3bd] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#073b46] ${
              isLeftAligned ? "" : "mx-auto"
            }`}
          >
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, 15, -10, 0],
                      scale: [1, 1.15, 1],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex text-[#ff6542]"
            >
            </motion.span>

            {label}
          </motion.div>
        )}

        {/* Main heading */}
        <motion.h2
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-3xl font-black leading-[1.15] tracking-tight text-[#073b46] sm:text-4xl lg:text-[48px]"
        >
          {text1}
        </motion.h2>

        {/* Animated divider */}
        <div
          className={`mt-5 flex items-center gap-2 ${
            isLeftAligned ? "justify-start" : "justify-center"
          }`}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-1.5 w-20 origin-right rounded-full bg-[#ffd36e] sm:w-28"
          />

          <motion.span
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: [1, 1.35, 1],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-3 w-3 rounded-full bg-[#ff6542] shadow-[0_0_0_5px_rgba(255,101,66,0.12)]"
          />

          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-1.5 w-10 origin-left rounded-full bg-[#073b46] sm:w-16"
          />
        </div>

        {/* Description */}
        {text2 && (
          <motion.p
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 ${
              isLeftAligned ? "max-w-2xl" : "mx-auto max-w-2xl"
            }`}
          >
            {text2}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Heading;

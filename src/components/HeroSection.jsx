import React, { useEffect, useRef } from "react";
import { Link } from "react-router";

const bee = "/bee.png";
const boy = "/man.png";
const girl = "/woman.png";

const HeroSection = () => {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const beeRef = useRef(null);
  const girlRef = useRef(null);
  const boyRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!section || !hasFinePointer || prefersReducedMotion) {
      return undefined;
    }

    let animationFrameId = null;

    const setTransforms = (clientX, clientY) => {
      const rect = section.getBoundingClientRect();

      const normalizedX = (clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (clientY - rect.top) / rect.height - 0.5;

      const x = Math.max(-0.5, Math.min(0.5, normalizedX));
      const y = Math.max(-0.5, Math.min(0.5, normalizedY));

      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        if (circleRef.current) {
          circleRef.current.style.transform = `rotate(${x * 7}deg)`;
        }

        if (beeRef.current) {
          beeRef.current.style.transform = `translate3d(
            ${x * 38}px,
            ${y * 28}px,
            0
          )`;
        }

        if (girlRef.current) {
          girlRef.current.style.transform = `translate3d(
            ${x * 18}px,
            ${y * 14}px,
            0
          )`;
        }

        if (boyRef.current) {
          boyRef.current.style.transform = `translate3d(
            ${x * 22}px,
            ${y * 18}px,
            0
          )`;
        }
      });
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;

      setTransforms(event.clientX, event.clientY);
    };

    const resetTransforms = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        if (circleRef.current) {
          circleRef.current.style.transform = "rotate(0deg)";
        }

        if (beeRef.current) {
          beeRef.current.style.transform = "translate3d(0, 0, 0)";
        }

        if (girlRef.current) {
          girlRef.current.style.transform = "translate3d(0, 0, 0)";
        }

        if (boyRef.current) {
          boyRef.current.style.transform = "translate3d(0, 0, 0)";
        }
      });
    };

    section.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    section.addEventListener("pointerleave", resetTransforms);

    return () => {
      cancelAnimationFrame(animationFrameId);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", resetTransforms);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        hero-enter-section
        relative
        isolate
        z-0
        min-h-[max(36rem,calc(100svh-6rem))]
        w-full
        touch-pan-y
        overflow-x-clip
        overflow-y-visible
        bg-[#fff4c9]
        sm:min-h-[max(38rem,calc(100svh-6.5rem))]
        lg:min-h-[max(40rem,calc(100svh-7rem))]
      "
    >
      <style>{`
        @keyframes heroSectionFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes heroDecorationFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes heroGirlEnter {
          0% {
            opacity: 0;
            transform: translate3d(-5rem, 2.5rem, 0) rotate(-5deg) scale(0.88);
          }
          70% {
            opacity: 1;
            transform: translate3d(0.5rem, -0.25rem, 0) rotate(1.5deg) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes heroBoyEnter {
          0% {
            opacity: 0;
            transform: translate3d(5rem, 2.5rem, 0) rotate(5deg) scale(0.88);
          }
          70% {
            opacity: 1;
            transform: translate3d(-0.5rem, -0.25rem, 0) rotate(-1.5deg) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes heroCircleEnter {
          0% {
            opacity: 0;
            transform: translate3d(0, 2rem, 0) rotate(-12deg) scale(0.62);
          }
          65% {
            opacity: 1;
            transform: translate3d(0, -0.35rem, 0) rotate(2deg) scale(1.055);
          }
          82% {
            transform: translate3d(0, 0.15rem, 0) rotate(-0.75deg) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes heroBeeEnter {
          0% {
            opacity: 0;
            transform: translate3d(7rem, -5rem, 0) rotate(24deg) scale(0.55);
          }
          60% {
            opacity: 1;
            transform: translate3d(-0.6rem, 0.5rem, 0) rotate(-8deg) scale(1.08);
          }
          80% {
            transform: translate3d(0.25rem, -0.2rem, 0) rotate(3deg) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes heroBadgeEnter {
          0% {
            opacity: 0;
            transform: translate3d(1.5rem, 2rem, 0) rotate(28deg) scale(0.25);
          }
          68% {
            opacity: 1;
            transform: translate3d(0, -0.2rem, 0) rotate(-5deg) scale(1.12);
          }
          84% {
            transform: translate3d(0, 0.1rem, 0) rotate(2deg) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes heroCopyEnter {
          0% {
            opacity: 0;
            transform: translate3d(0, 1rem, 0) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes heroWaveEnter {
          0% {
            opacity: 0;
            transform: translate3d(0, 100%, 0) scaleX(1.08);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scaleX(1);
          }
        }

        @keyframes heroButtonGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 203, 59, 0);
          }
          50% {
            box-shadow: 0 0 0 0.55rem rgba(255, 203, 59, 0.22);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .hero-enter-section {
            animation: heroSectionFadeIn 450ms ease-out both;
          }

          .hero-enter-decoration {
            opacity: 0;
            animation: heroDecorationFadeIn 900ms ease-out 250ms both;
          }

          .hero-enter-girl {
            opacity: 0;
            transform-origin: bottom center;
            animation: heroGirlEnter 950ms cubic-bezier(0.2, 0.8, 0.2, 1.15) 100ms both;
          }

          .hero-enter-boy {
            opacity: 0;
            transform-origin: bottom center;
            animation: heroBoyEnter 950ms cubic-bezier(0.2, 0.8, 0.2, 1.15) 180ms both;
          }

          .hero-enter-circle-shell {
            opacity: 0;
            transform-origin: center;
            animation: heroCircleEnter 950ms cubic-bezier(0.18, 0.88, 0.28, 1.2) 280ms both;
          }

          .hero-enter-bee {
            opacity: 0;
            transform-origin: center;
            animation: heroBeeEnter 1s cubic-bezier(0.16, 0.9, 0.25, 1.2) 520ms both;
          }

          .hero-enter-badge {
            opacity: 0;
            transform-origin: center;
            animation: heroBadgeEnter 800ms cubic-bezier(0.2, 0.9, 0.24, 1.25) 720ms both;
          }

          .hero-enter-copy {
            opacity: 0;
            animation: heroCopyEnter 620ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
          }

          .hero-enter-copy-1 {
            animation-delay: 610ms;
          }

          .hero-enter-copy-2 {
            animation-delay: 700ms;
          }

          .hero-enter-copy-3 {
            animation-delay: 790ms;
          }

          .hero-enter-copy-4 {
            animation-delay: 880ms;
          }

          .hero-enter-copy-5 {
            animation-delay: 970ms;
          }

          .hero-enter-wave {
            opacity: 0;
            transform-origin: bottom center;
            animation: heroWaveEnter 850ms cubic-bezier(0.16, 0.84, 0.25, 1) 220ms both;
          }

          .hero-start-button {
            animation: heroButtonGlow 1.8s ease-in-out 1.3s 2;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="
          hero-enter-decoration
          pointer-events-none
          absolute
          -left-24
          top-[8%]
          hidden
          h-[clamp(18rem,32vw,26rem)]
          w-[clamp(8rem,15vw,13rem)]
          rotate-20
          rounded-full
          border-[7px]
          border-[#f8c092]/30
          border-b-transparent
          border-r-transparent
          sm:block
        "
      />

      <div
        aria-hidden="true"
        className="
          hero-enter-decoration
          pointer-events-none
          absolute
          -right-20
          -top-20
          hidden
          h-[clamp(16rem,28vw,23rem)]
          w-[clamp(7rem,13vw,11rem)]
          rounded-full
          border-[7px]
          border-[#f8c092]/30
          border-b-transparent
          border-l-transparent
          sm:block
        "
      />

      {/* Girl */}
      <div
        ref={girlRef}
        className="
          absolute
          bottom-[clamp(2.75rem,7vw,6.5rem)]
          left-[clamp(0rem,2vw,1.5rem)]
          top-[clamp(5.5rem,12vw,8rem)]
          z-10
          w-[clamp(6rem,19vw,18rem)]
          will-change-transform
          transition-transform
          duration-200
          ease-out
          motion-reduce:transition-none
        "
      >
        <img
          src={girl}
          alt="Student girl"
          draggable={false}
          decoding="async"
          className="hero-enter-girl block h-full w-full select-none object-contain object-bottom"
        />
      </div>

      {/* Main circle */}
      <div
        className="
          absolute
          left-1/2
          top-[clamp(3rem,8vw,5.5rem)]
          z-20
          -translate-x-1/2
        "
      >
        <div className="hero-enter-circle-shell relative">
          {/* Circle outline */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -inset-[3%]
              rotate-[-20deg]
              rounded-full
              border-x-[clamp(2px,0.35vw,5px)]
              border-[#fa7478]
            "
          />

          <div
            ref={circleRef}
            className="
              relative
              flex
              aspect-square
              w-[clamp(13.75rem,38vw,23.125rem)]
              flex-col
              items-center
              justify-center
              rounded-full
              bg-[#fa7478]
              px-[8%]
              py-[7%]
              text-center
              text-white
              will-change-transform
              transition-transform
              duration-200
              ease-out
              motion-reduce:transition-none
            "
            style={{ transformOrigin: "center" }}
          >
            <h1 className="hero-enter-copy hero-enter-copy-1 m-0 font-sans font-extrabold leading-none">
              <span
                className="
                  block
                  text-[clamp(2rem,5vw,3.5rem)]
                  tracking-[-0.05em]
                "
              >
                Online
              </span>

              <span
                className="
                  mt-[0.05em]
                  block
                  text-[clamp(1.25rem,3.25vw,2.35rem)]
                  tracking-[-0.03em]
                "
              >
                ISLAMIC
              </span>
            </h1>

            <p
              className="
                hero-enter-copy
                hero-enter-copy-2
                mt-[clamp(0.2rem,0.8vw,0.6rem)]
                text-[clamp(0.625rem,1.4vw,1rem)]
                font-extrabold
                leading-none
              "
            >
              School for
            </p>

            <div
              className="
                hero-enter-copy
                hero-enter-copy-3
                mt-[clamp(0.1rem,0.4vw,0.25rem)]
                text-[clamp(2.75rem,6.7vw,5rem)]
                font-extrabold
                leading-[0.85]
                tracking-[-0.07em]
              "
            >
              KIDS
            </div>

            <div className="hero-enter-copy hero-enter-copy-4 mt-[clamp(0.65rem,1.8vw,1.25rem)]">
              <Link
                to="/courses"
                className="
                  hero-start-button
                  flex
                  h-[clamp(2rem,4vw,2.875rem)]
                  w-[clamp(6.5rem,13vw,10rem)]
                  items-center
                  justify-center
                  rounded-md
                  border-2
                  border-[#f0aa1d]
                  bg-[#ffcb3b]
                  px-3
                  text-[clamp(0.75rem,1.6vw,1.2rem)]
                  font-bold
                  leading-none
                  text-[#e85e31]
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#ffd454]
                  hover:shadow-lg
                  focus-visible:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-white/70
                  motion-reduce:hover:translate-y-0
                "
              >
                Start Today
              </Link>
            </div>

            <p
              className="
                hero-enter-copy
                hero-enter-copy-5
                mt-[clamp(0.4rem,1.2vw,0.8rem)]
                max-w-[85%]
                text-[clamp(0.5rem,1vw,0.7rem)]
                font-bold
                leading-[1.3]
              "
            >
              Sign up → 5-minute evaluation →
              <br />
              pick a class time → done!
            </p>
          </div>
        </div>
      </div>

      {/* Bee */}
      <div
        ref={beeRef}
        className="
          absolute
          right-[clamp(2rem,25vw,15rem)]
          top-[clamp(0.75rem,4vw,4rem)]
          z-30
          w-[clamp(4.5rem,14vw,12rem)]
          will-change-transform
          transition-transform
          duration-200
          ease-out
          motion-reduce:transition-none
        "
      >
        <div className="hero-enter-bee">
          <img
            src={bee}
            alt="Bee"
            draggable={false}
            decoding="async"
            className="
              mx-auto
              block
              h-auto
              w-full
              select-none
              object-contain
              animate-bounce
              motion-reduce:animate-none
            "
          />
        </div>
      </div>

      {/* Boy */}
      <div
        ref={boyRef}
        className="
          absolute
          bottom-[clamp(2.75rem,7vw,6.5rem)]
          right-[clamp(-0.5rem,1vw,1rem)]
          top-[clamp(5rem,11vw,7.5rem)]
          z-10
          w-[clamp(6.5rem,21vw,19rem)]
          will-change-transform
          transition-transform
          duration-200
          ease-out
          motion-reduce:transition-none
        "
      >
        <img
          src={boy}
          alt="Student boy"
          draggable={false}
          decoding="async"
          className="hero-enter-boy block h-full w-full select-none object-contain object-bottom"
        />
      </div>

      {/* Money-back badge */}
      <div
        className="
          absolute
          bottom-[clamp(3.5rem,30vw,7.5rem)]
          right-[clamp(4.5rem,22vw,28rem)]
          z-30
          aspect-square
          w-[clamp(4rem,9vw,7.25rem)]
          transition-transform
          duration-300
          hover:scale-105
          motion-reduce:transition-none
        "
      >
        <div className="hero-enter-badge relative h-full w-full">
          {/* Ribbons */}
          <div
            aria-hidden="true"
            className="
              absolute
              bottom-[5%]
              left-[24%]
              z-0
              h-[47%]
              w-[19%]
              rotate-30
              bg-[#e96d70]
              [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-[5%]
              right-[24%]
              z-0
              h-[47%]
              w-[19%]
              rotate-[-30deg]
              bg-[#e96d70]
              [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]
            "
          />

          {/* Badge body */}
          <div
            className="
              absolute
              left-1/2
              top-0
              z-10
              flex
              h-[68%]
              w-[82%]
              -translate-x-1/2
              -rotate-[5deg]
              flex-col
              items-center
              justify-center
              rounded-[50%]
              border-[clamp(1px,0.18vw,2px)]
              border-[#6e3d9d]
              bg-[#f6cb36]
              px-1
              text-center
              text-[#6e3d9d]
              shadow-[0_0_0_clamp(2px,0.25vw,4px)_#e96d70]
            "
          >
            <strong
              className="
                text-[clamp(0.65rem,1.25vw,1rem)]
                font-extrabold
                leading-none
              "
            >
              100%
            </strong>

            <span
              className="
                mt-[4%]
                text-[clamp(0.38rem,0.75vw,0.68rem)]
                font-extrabold
                leading-[1.05]
              "
            >
              MONEY BACK
            </span>

            <span
              className="
                text-[clamp(0.38rem,0.75vw,0.68rem)]
                font-extrabold
                leading-[1.05]
              "
            >
              GUARANTEE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-px
          left-0
          z-40
          h-[clamp(3.5rem,10vw,9.5rem)]
          w-full
        "
      >
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          className="hero-enter-wave block h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="
              M0,70
              C80,5 145,5 220,70
              C300,140 365,140 445,70
              C525,5 590,5 670,70
              C750,140 815,140 895,70
              C975,5 1040,5 1120,70
              C1200,140 1270,140 1340,70
              C1380,35 1410,30 1440,50
              L1440,180
              L0,180
              Z
            "
            fill="#eff6ff"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

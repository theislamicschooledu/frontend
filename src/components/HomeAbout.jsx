import { useMemo, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

const HomeAbout = ({
  youtubeUrl = "https://www.youtube.com/watch?v=1KviEqtohqQ&pp=ygUPaXNsYW1pYyBuYXNoZWVk0gcJCaMLAYcqIYzv",
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = useMemo(() => {
    try {
      const url = new URL(youtubeUrl);

      if (url.hostname.includes("youtu.be")) {
        return url.pathname.replace("/", "");
      }

      if (url.searchParams.get("v")) {
        return url.searchParams.get("v");
      }

      if (url.pathname.includes("/embed/")) {
        return url.pathname.split("/embed/")[1]?.split("/")[0];
      }

      if (url.pathname.includes("/shorts/")) {
        return url.pathname.split("/shorts/")[1]?.split("/")[0];
      }

      return "";
    } catch {
      return "";
    }
  }, [youtubeUrl]);

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "";

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : "";

  return (
    <section className="relative overflow-hidden bg-blue-50 py-14 font-sans sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main heading */}
        <h2 className="mb-12 text-center font-black tracking-wide text-[#083843] sm:text-left sm:text-5xl lg:mb-16 lg:text-6xl">
          {t("home.about.heading")}
        </h2>

        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* Left content */}
          <div className="order-2 lg:order-1">
            <h3 className="text-3xl font-black leading-tight text-[#063844] sm:text-4xl lg:text-[42px]">
              {t("home.about.title")}
            </h3>

            <h4 className="mt-5 text-base font-extrabold text-[#073844] sm:text-lg">
              {t("home.about.subtitle")}
            </h4>

            <div className="mt-2 max-w-2xl space-y-2 text-[15px] leading-6 text-slate-800 sm:text-base sm:leading-7">
              <p>{t("home.about.paragraph1")}</p>
              <p>{t("home.about.paragraph2")}</p>
              <p>{t("home.about.paragraph3")}</p>
            </div>

            <ul className="mt-3 space-y-1 text-[15px] leading-6 text-slate-800 sm:text-base">
              <li className="flex items-start gap-2">
                <span aria-hidden="true">🎓</span>
                <span>{t("home.about.benefit1")}</span>
              </li>

              <li className="flex items-start gap-2">
                <span aria-hidden="true">🔎</span>
                <span>{t("home.about.benefit2")}</span>
              </li>

              <li className="flex items-start gap-2">
                <span aria-hidden="true">📖</span>
                <span>{t("home.about.benefit3")}</span>
              </li>

              <li className="flex items-start gap-2">
                <span aria-hidden="true">🎉</span>
                <span>{t("home.about.benefit4")}</span>
              </li>

              <li className="flex items-start gap-2">
                <span aria-hidden="true">🚀</span>
                <span>{t("home.about.benefit5")}</span>
              </li>
            </ul>

            <a
              href="#programs"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded border-2 border-[#ff5c39] px-6 py-2 text-sm font-black tracking-wide text-[#ff5c39] transition duration-300 hover:bg-[#ff5c39] hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              {t("home.about.explorePrograms")}
            </a>
          </div>

          {/* TV area */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-137.5 pb-20 pt-24 sm:pb-24 sm:pt-28">
              {/* TV top/antenna */}
              <img
                src="/tv-top.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 z-0 w-[48%] -translate-x-1/2 object-contain"
              />

              {/* TV body */}
              <div className="relative z-10 rounded-[28px] bg-[#0a3b46] p-3 shadow-[0_18px_45px_rgba(8,56,67,0.18)] sm:p-4">
                <div className="relative aspect-video overflow-hidden rounded-[17px] bg-[#fff2b9]">
                  {isPlaying && embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={t("home.about.videoTitle")}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoId && setIsPlaying(true)}
                      disabled={!videoId}
                      aria-label={t("home.about.playVideo")}
                      className="group absolute inset-0 h-full w-full cursor-pointer overflow-hidden disabled:cursor-not-allowed"
                    >
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={t("home.about.videoThumbnailAlt")}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#fff0ad] px-6 text-center font-bold text-[#083843]">
                          {t("home.about.invalidVideo")}
                        </div>
                      )}

                      {/* Dark overlay */}
                      {videoId && (
                        <>
                          <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />

                          {/* Play button */}
                          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff5c39] text-white shadow-xl transition duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                            <svg
                              viewBox="0 0 24 24"
                              className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10"
                              aria-hidden="true"
                            >
                              <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l10.78-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* TV legs */}
                <span className="absolute -bottom-8 left-[18%] h-12 w-7 -rotate-25 rounded-b-md bg-[#0a3b46]" />
                <span className="absolute -bottom-8 right-[18%] h-12 w-7 rotate-25 rounded-b-md bg-[#0a3b46]" />
              </div>

              {/* Bird */}
              <img
                src="/bird.png"
                alt={t("home.about.birdAlt")}
                className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-[42%] min-w-36 -translate-x-1/2 object-contain drop-shadow-sm sm:w-[46%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;

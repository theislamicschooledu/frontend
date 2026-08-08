// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router";
import logoWhite from "./../../public/Logo-white.png";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import {
  FaFacebook,
  FaPhone,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { MdEmail, MdLocationCity } from "react-icons/md";
import { useLanguage } from "../hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocumentation = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documentation");
      if (res.data.success) {
        setDocumentation(res.data.data);
      } else {
        toast.error(t("footer.loadFailed"));
      }
    } catch (err) {
      console.error("Error fetching documentation:", err);
      toast.error(t("footer.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const normalizeUrl = (url) => {
    if (!url || typeof url !== "string") return "#";

    const trimmedUrl = url.trim();

    if (!trimmedUrl) return "#";

    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
      return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
  };

  return (
    <footer className="bg-linear-to-b from-emerald-700 to-green-900 text-white py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <img
                src={logoWhite}
                alt={t("footer.logoAlt")}
                className="h-6 w-auto md:h-8 lg:h-10 object-contain transition-all duration-300"
              />
              <div className="flex flex-col gap-0">
                <p className="text-xl font-bold text-white">
                  {t("common.siteName")}
                </p>
                <span className="text-xs text-gray-300 leading-2 tracking-widest">
                  {t("common.tagline")}
                </span>
              </div>
            </div>
            <p className="text-green-100 mb-4 max-w-md">
              {t("footer.description")}
            </p>
            {loading ? (
              <div>{t("footer.loading")}</div>
            ) : (
              <div className="flex space-x-4">
                <motion.a
                  href={normalizeUrl(documentation?.socialMedia?.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FaFacebook className="w-10 h-10 text-green-100 bg-green-600 p-2 rounded-full hover:text-white hover:bg-green-500 transition" />
                </motion.a>
                <motion.a
                  href={normalizeUrl(
                    `wa.me/${documentation?.socialMedia?.whatsapp}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FaWhatsapp className="w-10 h-10 text-green-100 bg-green-600 p-2 rounded-full hover:text-white hover:bg-green-500 transition" />
                </motion.a>
                <motion.a
                  href={normalizeUrl(documentation?.socialMedia?.youtube)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FaYoutube className="w-10 h-10 text-green-100 bg-green-600 p-2 rounded-full hover:text-white hover:bg-green-500 transition" />
                </motion.a>
                <motion.a
                  href={normalizeUrl(documentation?.socialMedia?.telegram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FaTelegram className="w-10 h-10 text-green-100 bg-green-600 p-2 rounded-full hover:text-white hover:bg-green-500 transition" />
                </motion.a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={"/"}
                  className="text-green-100 hover:text-white transition"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to={"/courses"}
                  className="text-green-100 hover:text-white transition"
                >
                  {t("nav.courses")}
                </Link>
              </li>
              <li>
                <Link
                  to={"/about"}
                  className="text-green-100 hover:text-white transition"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to={"/blogs"}
                  className="text-green-100 hover:text-white transition"
                >
                  {t("nav.blogs")}
                </Link>
              </li>
              <li>
                <Link
                  to={"/qa"}
                  className="text-green-100 hover:text-white transition"
                >
                  {t("nav.qna")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-2 text-green-100">
              <li className="flex items-center">
                <MdEmail size={5} className="w-4 h-4 mr-2 mt-1 text-white" />
                <span>{documentation?.contact?.email[0]}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="w-4 h-4 mr-2 mt-1" />
                <span>{documentation?.contact?.helpline[0]}</span>
              </li>
              <li className="flex items-center">
                <MdLocationCity className="w-4 h-4 mr-2 mt-1 text-white" />
                <span>{documentation?.contact?.headOffice}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-600 pt-8 text-center text-green-200">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="mt-2 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="hover:text-white transition">
              {t("footer.terms")}
            </a>
            <a href="#" className="hover:text-white transition">
              {t("footer.faq")}
            </a>
          </div>
          <div className="pt-3">
            <a href="https://alamin-portfolio.web.app/">
              {t("footer.contactDeveloper")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

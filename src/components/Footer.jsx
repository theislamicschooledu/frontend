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

const Footer = () => {
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
        toast.error(error);
      }
    } catch (err) {
      console.error("Error fetching documentation:", err);
      setError("Network error. Please try again.");
      toast.error("Failed to fetch documentation");
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

  console.log(documentation?.contact);

  return (
    <footer className="bg-linear-to-b from-emerald-700 to-green-900 text-white py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <img
                src={logoWhite}
                alt="Website Logo"
                className="h-6 w-auto md:h-8 lg:h-10 object-contain transition-all duration-300"
              />
              <div className="flex flex-col gap-0">
                <p className="text-xl font-bold text-white">
                  THE ISLAMIC SCHOOL
                </p>
                <span className="text-xs text-gray-300 leading-2 tracking-widest">
                  Learn - Light - Lead with Islam
                </span>
              </div>
            </div>
            <p className="text-green-100 mb-4 max-w-md">
              Making Islamic education fun, engaging and accessible for
              children. We help build a strong foundation of faith and knowledge
              from an early age.
            </p>
            {loading ? (
              <div>loading</div>
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
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={"/"}
                  className="text-green-100 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={"/courses"}
                  className="text-green-100 hover:text-white transition"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to={"/about"}
                  className="text-green-100 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to={"/blogs"}
                  className="text-green-100 hover:text-white transition"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to={"/qa"}
                  className="text-green-100 hover:text-white transition"
                >
                  Q&A
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
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
          <p>
            © {new Date().getFullYear()} Islamic Kids Learning. All rights
            reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              FAQ
            </a>
          </div>
          <div className="pt-3">
            <a href="https://alamin-portfolio.web.app/">Contact Developer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

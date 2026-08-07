import { useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiBook,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiHelpCircle,
  FiInfo,
  FiSave,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "../utils/axios";

const UpdateQuestion = () => {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      setLocalLoading(true);
      try {
        const res = await api.get(`/qna/${id}`);
        const q = res.data.question;
        setTitle(q.title);
        setSelectedCategory(q.category || "");

        if (quillRef.current) {
          quillRef.current.root.innerHTML = q.description || "";
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/qna/questionCategory");
        setCategories(res.data.categories);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Update your question details here...",
        modules: {
          toolbar: [["bold", "italic", "underline", "strike"], ["clean"]],
        },
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = quillRef.current.root.innerHTML;

    if (!title || !description || !selectedCategory) {
      toast.error("Title, description, and category are required!");
      return;
    }

    setLocalLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", JSON.stringify(description));
      formData.append("category", selectedCategory);

      const res = await api.put(`/qna/${id}`, formData);

      if (res.data.success) {
        toast.success(res.data.message || "Question updated successfully!");
        navigate("/admin/questions");
      } else {
        toast.error(res.data.message || "Failed to update!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const guidelines = [
    "প্রশ্নের মূল বিষয় ও প্রেক্ষাপট পরিষ্কারভাবে উপস্থাপন করুন",
    "শিরোনাম সংক্ষিপ্ত, নির্দিষ্ট ও সহজবোধ্য রাখুন",
    "অপ্রয়োজনীয় ব্যক্তিগত বা সংবেদনশীল তথ্য সরিয়ে দিন",
    "প্রকাশের আগে বানান, ভাষা ও তথ্য পুনরায় যাচাই করুন",
  ];

  const tips = [
    "প্রয়োজনীয় বয়স, সময় বা ঘটনার প্রেক্ষাপট উল্লেখ রাখুন",
    "একাধিক বিষয় থাকলে মূল প্রশ্নটিকে অগ্রাধিকার দিন",
    "প্রয়োজনে প্রশ্নের ভাষা আরও সম্মানজনক ও নিরপেক্ষ করুন",
  ];

  return (
    <div className="font-hind min-h-screen overflow-hidden bg-[#f8f5ed] text-[#263c35]">
      {/* Compact Header */}
      <section className="relative overflow-hidden border-b border-[#e8dfce] pt-8">
        <div className="absolute inset-0 bg-linear-to-br from-[#fffaf0] via-[#f4fbf7] to-[#edf7f4]" />
        <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-[#f6c85f]/18 blur-3xl" />
        <div className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#9d8be8]/16 blur-3xl" />

        <motion.div
          className="absolute left-[7%] top-28 hidden h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-[#ffe8dd] text-[#df7650] shadow-sm md:flex"
          animate={{ y: [0, -8, 0], rotate: [12, 18, 12] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FiEdit3 className="text-xl" />
        </motion.div>

        <motion.div
          className="absolute right-[8%] top-28 hidden h-11 w-11 -rotate-12 items-center justify-center rounded-full bg-[#e9e5ff] text-[#7865c9] shadow-sm lg:flex"
          animate={{ y: [0, 9, 0], rotate: [-12, -5, -12] }}
          transition={{ duration: 4.8, repeat: Infinity }}
        >
          <FiCheckCircle className="text-xl" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-4xl text-center"
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-[#d7e9e2] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#16745f] shadow-sm backdrop-blur transition hover:bg-white"
            >
              <FiArrowLeft />
              ফিরে যান
            </button>

            <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-[#eeeafd] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#6e5bb4]">
              <FiEdit3 />
              Question Management
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-[1.18] text-[#263c35] sm:text-4xl lg:text-[3.1rem]">
              প্রশ্নের তথ্য
              <span className="relative ml-2 inline-block text-[#16745f]">
                আপডেট করুন
                <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#f7c969]/45" />
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#687a73] sm:text-base">
              প্রশ্নের শিরোনাম, ক্যাটাগরি ও বিস্তারিত তথ্য পর্যালোচনা করে
              প্রয়োজনীয় পরিবর্তন সংরক্ষণ করুন।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Update Form */}
      <section className="py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
            <motion.main
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-w-0"
            >
              <div className="relative overflow-hidden rounded-[1.7rem] border border-[#e5ded0] bg-white shadow-[0_18px_50px_rgba(45,75,65,0.08)]">
                {localLoading && (
                  <div className="absolute inset-x-0 top-0 z-20 h-1 overflow-hidden bg-[#dcebe4]">
                    <motion.div
                      className="h-full w-1/3 bg-[#16745f]"
                      animate={{ x: ["-100%", "400%"] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                )}

                <div className="border-b border-[#eee8dc] bg-[#fffdf8] px-5 py-4 sm:px-7 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d9704b]">
                      <FiEdit3 className="text-xl" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9704b]">
                        Edit Form
                      </p>
                      <h2 className="mt-1 text-xl font-extrabold text-[#263c35] sm:text-2xl">
                        প্রশ্নের তথ্য সম্পাদনা
                      </h2>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8">
                  {/* Title */}
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label
                        htmlFor="question-title"
                        className="flex items-center gap-2 text-base font-extrabold text-[#263c35] sm:text-lg"
                      >
                        <FiHelpCircle className="text-[#d9704b]" />
                        প্রশ্নের শিরোনাম
                      </label>

                      <span
                        className={`text-xs font-bold ${
                          title.length >= 180
                            ? "text-[#d9704b]"
                            : "text-[#8b9893]"
                        }`}
                      >
                        {title.length}/200
                      </span>
                    </div>

                    <input
                      id="question-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your question title..."
                      className="h-13 w-full rounded-xl border border-[#dfe5e0] bg-[#fafbf8] px-4 text-base font-medium text-[#263c35] outline-none transition placeholder:text-[#9ba6a2] focus:border-[#8bcdbd] focus:bg-white focus:ring-4 focus:ring-[#8bcdbd]/15"
                      maxLength={200}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="mt-7">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <label className="flex items-center gap-2 text-base font-extrabold text-[#263c35] sm:text-lg">
                          <FiBook className="text-[#16745f]" />
                          ক্যাটাগরি নির্বাচন করুন
                        </label>
                        <p className="mt-1 text-xs leading-5 text-[#7b8983] sm:text-sm">
                          প্রশ্নের সঙ্গে সবচেয়ে প্রাসঙ্গিক একটি ক্যাটাগরি
                          নির্বাচন করুন।
                        </p>
                      </div>

                      {selectedCategory && (
                        <span className="w-fit rounded-full bg-[#e5f4ee] px-3 py-1 text-xs font-bold text-[#16745f]">
                          নির্বাচিত
                        </span>
                      )}
                    </div>

                    {categories.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {categories.map((cat) => {
                          const isSelected = selectedCategory === cat._id;

                          return (
                            <motion.button
                              key={cat._id}
                              type="button"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCategory(cat._id)}
                              className={`group flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition ${
                                isSelected
                                  ? "border-[#16745f] bg-[#eaf6f1] text-[#16745f] shadow-[0_8px_20px_rgba(22,116,95,0.10)]"
                                  : "border-[#e0e5e0] bg-[#fafbf8] text-[#53665e] hover:border-[#8bcdbd] hover:bg-[#f2f9f6] hover:text-[#16745f]"
                              }`}
                            >
                              <span className="line-clamp-2">{cat.name}</span>

                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                                  isSelected
                                    ? "bg-[#16745f] text-white"
                                    : "bg-[#edf1ee] text-[#9aa6a1] group-hover:bg-[#dff0e9] group-hover:text-[#16745f]"
                                }`}
                              >
                                <FiCheckCircle className="text-sm" />
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-12 animate-pulse rounded-xl bg-[#f0f2ed]"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mt-7">
                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-base font-extrabold text-[#263c35] sm:text-lg">
                        <FiEdit3 className="text-[#7865c9]" />
                        প্রশ্নের বিস্তারিত
                      </label>
                      <p className="mt-1 text-xs leading-5 text-[#7b8983] sm:text-sm">
                        প্রশ্নের প্রেক্ষাপট, তথ্য ও ভাষা প্রয়োজন অনুযায়ী সংশোধন
                        করুন।
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-[1.25rem] border border-[#dfe5e0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] [&_.ql-container.ql-snow]:min-h-64 [&_.ql-container.ql-snow]:border-0 [&_.ql-editor]:min-h-64 [&_.ql-editor]:p-4 [&_.ql-editor]:text-base [&_.ql-editor]:leading-8 [&_.ql-editor]:text-[#52645d] [&_.ql-editor.ql-blank:before]:left-4 [&_.ql-editor.ql-blank:before]:right-4 [&_.ql-editor.ql-blank:before]:text-[#9ba6a2] [&_.ql-toolbar.ql-snow]:border-0 [&_.ql-toolbar.ql-snow]:border-b [&_.ql-toolbar.ql-snow]:border-[#e6ebe7] [&_.ql-toolbar.ql-snow]:bg-[#f8faf7]">
                      <div ref={editorRef} />
                    </div>
                  </div>

                  {/* Admin Notice */}
                  <div className="mt-6 flex items-start gap-3 rounded-[1.15rem] border border-[#ded8f4] bg-[#f7f4ff] p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eeeafd] text-[#6e5bb4]">
                      <FiInfo />
                    </div>
                    <p className="text-xs leading-6 text-[#665d82] sm:text-sm">
                      পরিবর্তন সংরক্ষণ করার আগে প্রশ্নের ভাষা, ক্যাটাগরি ও
                      বিস্তারিত তথ্য পুনরায় যাচাই করুন।
                    </p>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={localLoading}
                    whileHover={{ y: localLoading ? 0 : -2 }}
                    whileTap={{ scale: localLoading ? 1 : 0.99 }}
                    className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#16745f] px-6 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(22,116,95,0.22)] transition hover:bg-[#115f4e] disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {localLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                        সংরক্ষণ করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        পরিবর্তন সংরক্ষণ করুন
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.main>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="space-y-5 lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="rounded-[1.55rem] border border-[#e5ded0] bg-white p-5 shadow-[0_14px_40px_rgba(45,75,65,0.07)]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b77ce]">
                        Guidelines
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold text-[#263c35]">
                        সম্পাদনার নির্দেশনা
                      </h3>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeafd] text-[#7865c9]">
                      <FiShield />
                    </span>
                  </div>

                  <ul className="mt-5 space-y-3.5">
                    {guidelines.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-[#63736c]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5f4ee] text-[#16745f]">
                          <FiCheckCircle className="text-xs" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="relative overflow-hidden rounded-[1.55rem] bg-[#263c35] p-6 text-white shadow-[0_18px_45px_rgba(38,60,53,0.20)]"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f7c969]/18" />
                  <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#ef8f6d]/12" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f7c969]">
                      <FiUsers className="text-xl" />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold">
                      মানসম্মত প্রশ্নের টিপস
                    </h3>

                    <div className="mt-4 space-y-3">
                      {tips.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-white/75"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7c969]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.32 }}
                  className="rounded-[1.55rem] border border-[#e5ded0] bg-white p-5 shadow-[0_14px_40px_rgba(45,75,65,0.07)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e8] text-[#d9704b]">
                      <FiClock />
                    </span>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9704b]">
                        Update Status
                      </p>
                      <h3 className="mt-1 font-extrabold text-[#263c35]">
                        পরিবর্তন সংরক্ষণ
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.15rem] bg-[#f8faf7] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f4ee] text-[#16745f]">
                        <FiCheckCircle />
                      </span>

                      <div>
                        <p className="text-sm font-extrabold text-[#263c35]">
                          Ready to update
                        </p>
                        <p className="mt-0.5 text-xs text-[#71817b]">
                          Save করলে admin questions page-এ ফিরে যাবে।
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateQuestion;

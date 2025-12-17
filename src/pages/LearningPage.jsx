import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axios";
import toast from "react-hot-toast";

// Components
import VideoPlayer from "../components/LearningPage/VideoPlayer";
import Sidebar from "../components/LearningPage/Sidebar";
import Header from "../components/LearningPage/Header";
import MobileBottomBar from "../components/LearningPage/MobileBottomBar";
import LectureControls from "../components/LearningPage/LectureControls";
import ResourcesSection from "../components/LearningPage/ResourcesSection";
import LoadingState from "../components/LearningPage/LoadingState";
import ErrorState from "../components/LearningPage/ErrorState";
import { useAuth } from "../hooks/useAuth";
import CourseReview from "../components/LearningPage/CourseReview";

const LearningPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [lastActivity, setLastActivity] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseRes, lecturesRes, enrollmentRes] = await Promise.all([
        api.get(`/courses/courseDetails/${courseId}`),
        api.get(`/courses/${courseId}/lectures`),
        api.get(`/enrollment/course/${courseId}`),
      ]);

      if (courseRes.data?.success) {
        setCourse(courseRes.data.course);
      }

      if (lecturesRes.data) {
        const lecturesData = lecturesRes.data.lectures || lecturesRes.data;
        setLectures(lecturesData);

        if (lecturesData.length > 0) {
          const lastWatched = localStorage.getItem(`last_watched_${courseId}`);
          if (lastWatched) {
            const lecture = lecturesData.find((l) => l._id === lastWatched);
            if (lecture) {
              setCurrentLecture(lecture);
            } else {
              setCurrentLecture(lecturesData[0]);
            }
          } else {
            setCurrentLecture(lecturesData[0]);
          }
        }
      }

      if (enrollmentRes.data?.success) {
        const e = enrollmentRes.data.enrollment;
        setEnrollment(e);

        const completedIds = Array.isArray(e.completedLectures)
          ? e.completedLectures.map((l) => l._id || l)
          : [];

        setCompletedLectures(completedIds);
        setProgress(e.progress || 0);
        setLastActivity(e.lastActivity || e.updatedAt);

        localStorage.setItem(
          `enrollment_${courseId}`,
          JSON.stringify({
            completedIds,
            progress: e.progress,
          })
        );
      }
    } catch (err) {
      console.error("fetchCourseData error:", err.response || err);
      toast.error("Failed to load course data");
      navigate("/my-courses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchCourseData();
  };

  const markLectureComplete = async (lectureId) => {
    if (!enrollment?._id) {
      toast.error("Enrollment not found");
      return;
    }

    setMarkingComplete(true);
    try {
      const { data } = await api.post(
        `/enrollment/${enrollment._id}/complete-lecture`,
        { lectureId }
      );

      if (data?.success) {
        if (data.enrollment) {
          setEnrollment(data.enrollment);
          const completedIds = Array.isArray(data.enrollment.completedLectures)
            ? data.enrollment.completedLectures.map((l) => l._id || l)
            : [];
          setCompletedLectures(completedIds);
        }

        setProgress(data.progress);
        setLastActivity(
          data.enrollment?.lastActivity || data.enrollment?.updatedAt
        );

        toast.success(data.message || "Lecture marked as complete!");

        if (currentLecture) {
          localStorage.setItem(`last_watched_${courseId}`, currentLecture._id);
        }

        const idx = lectures.findIndex((l) => l._id === lectureId);
        const nextLecture = lectures[idx + 1];

        if (nextLecture && !completedLectures.includes(nextLecture._id)) {
          setTimeout(() => {
            setCurrentLecture(nextLecture);
            setVideoError(false);
            toast.info(`Moving to next lecture: ${nextLecture.title}`);
          }, 1500);
        }
      } else {
        toast.error(data?.message || "Failed to mark as complete");
      }
    } catch (err) {
      console.error("markLectureComplete error:", err.response || err);
      toast.error(
        err.response?.data?.message || "Failed to mark lecture as complete"
      );
    } finally {
      setMarkingComplete(false);
    }
  };

  const markLectureIncomplete = async (lectureId) => {
    if (!enrollment?._id) return;

    try {
      const { data } = await api.post(
        `/enrollment/${enrollment._id}/incomplete-lecture`,
        { lectureId }
      );

      if (data?.success) {
        if (data.enrollment) {
          setEnrollment(data.enrollment);
          const completedIds = Array.isArray(data.enrollment.completedLectures)
            ? data.enrollment.completedLectures.map((l) => l._id || l)
            : [];
          setCompletedLectures(completedIds);
        }

        setProgress(data.progress);
        toast.success(data.message || "Lecture marked as incomplete");
      } else {
        toast.error(data?.message || "Failed to update");
      }
    } catch (err) {
      console.error("markLectureIncomplete:", err);
      toast.error("Failed to update lecture status");
    }
  };

  const toggleLectureCompletion = async (lectureId) => {
    if (completedLectures.includes(lectureId)) {
      await markLectureIncomplete(lectureId);
    } else {
      await markLectureComplete(lectureId);
    }
  };

  const getCurrentLectureIndex = () =>
    lectures.findIndex((l) => l._id === currentLecture?._id);

  const goToNextLecture = () => {
    const idx = getCurrentLectureIndex();
    if (idx >= 0 && idx < lectures.length - 1) {
      const nextLecture = lectures[idx + 1];
      setCurrentLecture(nextLecture);
      localStorage.setItem(`last_watched_${courseId}`, nextLecture._id);
      setVideoError(false);
      if (!isDesktop) setSidebarOpen(false);
      scrollToTop();
    }
  };

  const goToPrevLecture = () => {
    const idx = getCurrentLectureIndex();
    if (idx > 0) {
      const prevLecture = lectures[idx - 1];
      setCurrentLecture(prevLecture);
      localStorage.setItem(`last_watched_${courseId}`, prevLecture._id);
      setVideoError(false);
      if (!isDesktop) setSidebarOpen(false);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openVideoInNewTab = () => {
    if (currentLecture?.videoUrl) {
      window.open(currentLecture.videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleVideoIframeError = () => {
    setVideoError(true);
    toast.error("Video failed to load");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isVideoPlayable = useCallback((videoUrl) => {
    if (!videoUrl) return false;
    const regex = /(?:v=|\/embed\/|\.be\/)([^#&?]{11})/;
    const match = String(videoUrl).match(regex);
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return !!match;
    }
    return true;
  }, []);

  const getYouTubeEmbedUrl = useCallback((videoUrl) => {
    if (!videoUrl) return null;
    const regex = /(?:v=|\/embed\/|\.be\/)([^#&?]{11})/;
    const match = String(videoUrl).match(regex);
    const id = match ? match[1] : null;
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&controls=1&enablejsapi=1`;
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (!course || !enrollment) {
    return <ErrorState navigate={navigate} />;
  }

  const currentIndex = getCurrentLectureIndex();
  const hasNextLecture =
    currentIndex >= 0 && currentIndex < lectures.length - 1;
  const hasPrevLecture = currentIndex > 0;
  const isCurrentLectureCompleted = currentLecture
    ? completedLectures.includes(currentLecture._id)
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16">
      <Header
        course={course}
        progress={progress}
        completedLectures={completedLectures}
        lectures={lectures}
        lastActivity={lastActivity}
        formatDate={formatDate}
        refreshing={refreshing}
        refreshData={refreshData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigate={navigate}
      />

      <main
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="lg:flex lg:items-start lg:gap-8">
          <AnimatePresence>
            {sidebarOpen && (
              <Sidebar
                course={course}
                lectures={lectures}
                currentLecture={currentLecture}
                completedLectures={completedLectures}
                progress={progress}
                lastActivity={lastActivity}
                isDesktop={isDesktop}
                isVideoPlayable={isVideoPlayable}
                setCurrentLecture={setCurrentLecture}
                setSidebarOpen={setSidebarOpen}
                setVideoError={setVideoError}
                courseId={courseId}
                formatDate={formatDate}
                refreshing={refreshing}
                refreshData={refreshData}
                navigate={navigate}
              />
            )}
          </AnimatePresence>

          <div className="flex-1 mt-6 lg:mt-0">
            <div className="space-y-4">
              <VideoPlayer
                lecture={currentLecture}
                getYouTubeEmbedUrl={getYouTubeEmbedUrl}
                videoError={videoError}
                setVideoError={setVideoError}
                openVideoInNewTab={openVideoInNewTab}
                videoRef={videoRef}
                handleVideoIframeError={handleVideoIframeError}
              />

              <LectureControls
                currentLecture={currentLecture}
                course={course}
                currentIndex={currentIndex}
                lectures={lectures}
                isCurrentLectureCompleted={isCurrentLectureCompleted}
                markingComplete={markingComplete}
                toggleLectureCompletion={toggleLectureCompletion}
                openVideoInNewTab={openVideoInNewTab}
                hasPrevLecture={hasPrevLecture}
                hasNextLecture={hasNextLecture}
                goToPrevLecture={goToPrevLecture}
                goToNextLecture={goToNextLecture}
                progress={progress}
                completedLectures={completedLectures}
                isVideoPlayable={isVideoPlayable}
              />

              {currentLecture?.resources &&
                currentLecture.resources.length > 0 && (
                  <ResourcesSection resources={currentLecture.resources} />
                )}

              <CourseReview
                courseId={courseId}
                userId={user?._id || "currentUserId"}
              />
            </div>
          </div>
        </div>
      </main>

      <MobileBottomBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        progress={progress}
        navigate={navigate}
      />
    </div>
  );
};

export default LearningPage;

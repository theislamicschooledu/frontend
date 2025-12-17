// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit3,
  FiSave,
  FiArrowLeft,
  FiLock,
  FiBookOpen,
  FiAward,
  FiBarChart2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
import api from "../../utils/axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    address: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get(`/auth/${user._id}`);
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(user);
    }
  }, [user]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Initialize editData when user data loads
  useEffect(() => {
    if (userData) {
      setEditData({
        name: userData.name || "",
        address: userData.address || "",
      });
      setPreviewImage(userData.avatar || null);
    }
  }, [userData]);

  

  const formattedDate = userData?.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const handleLogOut = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
      toast.success("Logged out successfully");
    } else {
      toast.error("Logout failed");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(userData?.avatar || null);
  };

  const handleSaveChanges = async () => {
    // Validate inputs
    if (!editData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', editData.name.trim());
      formData.append('address', editData.address?.trim() || '');
      
      // Append file if selected
      if (selectedFile) {
        formData.append('user', selectedFile);
      }

      const response = await api.put(
        `/auth/${userData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setUserData(prev => ({
          ...prev,
          name: editData.name,
          address: editData.address,
          ...(response.data.user?.avatar && { avatar: response.data.user.avatar })
        }));
        
        // Show success message
        toast.success(response.data.message || 'Profile updated successfully!');
        
        // Reset states
        setIsEditing(false);
        setSelectedFile(null);
        
        // Refresh user data
        fetchUserData();
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Enrollment",
      value: "12",
      icon: FiBookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Running Courses",
      value: "15 days",
      icon: FiAward,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Overall Progress",
      value: "78%",
      icon: FiBarChart2,
      color: "from-purple-500 to-pink-500",
    },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-green-50 text-gray-800 font-sans py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-green-600 hover:text-green-700 transition mr-6"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditToggle}
              disabled={loading}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <FiEdit3 className="mr-2" />
                  Edit Profile
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Profile Info */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white p-8">
                <div className="flex items-center">
                  {/* Profile Image Upload */}
                  <div className="relative mr-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-green-500 flex items-center justify-center">
                          <FiUser className="text-white text-4xl" />
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transition"
                        >
                          <FiUpload className="text-white text-xs" />
                        </button>
                        
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center cursor-pointer transition"
                          >
                            <FiX className="text-white text-xs" />
                          </button>
                        )}
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/*"
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="bg-white/20 rounded-lg px-3 py-1.5 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
                          placeholder="Enter your name"
                        />
                      ) : (
                        userData.name || "User Name"
                      )}
                    </h2>
                    <div className="flex items-center text-green-100 text-sm">
                      <FiCalendar className="mr-1" />
                      <span>Joined {formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-6">
                {/* Email */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <FiMail className="text-green-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-800 font-medium">{userData.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <FiPhone className="text-blue-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 font-medium">{userData.phone || "-"}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <FiMapPin className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {userData.address || "-"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  >
                    <FiLock className="mr-2 text-gray-600" />
                    <Link
                      to={"/change-password"}
                      className="text-gray-700 font-medium"
                    >
                      Change Password
                    </Link>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogOut}
                    className="w-full flex items-center justify-center py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                  >
                    <FiLock className="mr-2" />
                    <span className="font-medium">
                      Log Out
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Stats & Activities */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-2xl shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <stat.icon className="text-white text-xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: "courses", label: "My Courses" },
                    { id: "achievements", label: "Achievements" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition ${
                        activeTab === tab.id
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "courses" && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiBookOpen className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Enrolled Courses
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You are currently enrolled in 3 courses
                    </p>
                    <button 
                      onClick={() => navigate('/courses')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      View All Courses
                    </button>
                  </div>
                )}

                {activeTab === "achievements" && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiAward className="text-yellow-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Your Achievements
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You've earned 8 achievements so far!
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                      View Achievements
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
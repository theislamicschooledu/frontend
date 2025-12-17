import React, { createContext, useEffect, useState } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.warn("Invalid user in localStorage, resetting...", err);
      localStorage.removeItem("user");
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/auth/check");
        setUser(data || null);
        if (data) localStorage.setItem("user", JSON.stringify(data));
        
      } catch (err) {
        setUser(null);
        setError(err);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const { data } = await api.post("/auth/signup", payload);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", {
        emailOrPhone: identifier,
        password,
      });
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, code) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/verify", { email, code });

      if (data?.success) {
        setUser(data.user || null);
        setLoading(false);
      } else {
        setLoading(false);
      }
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "OTP verification failed";
      setError(errorMsg);
      setLoading(false);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOldPassword = async (oldPassword) => {
  try {
    const { data } = await api.post("/auth/verify-password", { oldPassword });
    if (data?.success) {
      return { success: true, message: data.message || "Verified" };
    } else {
      return { success: false, message: data?.message || "Verification failed" };
    }
  } catch (err) {
    const errorMsg =
      err.response?.data?.message || "Old password verification failed";
    return { success: false, message: errorMsg };
  }
};

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      setLoading(false);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Change password failed";
      setError(errorMsg);
      setLoading(false);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setLoading(false);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Forgot password failed";
      setError(errorMsg);
      setLoading(false);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setLoading(false);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Reset password failed";
      setError(errorMsg);
      setLoading(false);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        setUser,
        verifyOtp,
        verifyOldPassword,
        changePassword,
        forgotPassword,
        resetPassword,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

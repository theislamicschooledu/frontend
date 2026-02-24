// AdminEnrollments.jsx
import React, { useEffect, useState } from "react";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../../utils/axios";

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    try {
    //   const { data } = await api.get(`/enrollments/pending`);
      const { data } = await api.get(`/enrollments?status=${filter}`);
      setEnrollments(data.data);
    } catch (error) {
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId) => {
    try {
      const { data } = await api.put(`/enrollments/${enrollmentId}/approve`, {
        adminNotes: "Approved by admin"
      });
      if (data.success) {
        toast.success("Enrollment approved");
        fetchEnrollments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (enrollmentId) => {
    const reason = prompt("রিজেক্ট করার কারণ লিখুন:");
    if (!reason) return;

    try {
      const { data } = await api.put(`/enrollments/${enrollmentId}/reject`, {
        reason
      });
      if (data.success) {
        toast.success("Enrollment rejected");
        fetchEnrollments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Enrollment Management</h1>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["pending", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{enrollment.student?.name}</p>
                    <p className="text-sm text-gray-500">{enrollment.student?.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{enrollment.course?.title}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{enrollment.transactionId}</p>
                  <p className="text-xs text-gray-500">{enrollment.paymentMethod}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">৳{enrollment.amount}</p>
                  {enrollment.discountAmount > 0 && (
                    <p className="text-xs text-green-600">Saved ৳{enrollment.discountAmount}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(enrollment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {enrollment.paymentStatus === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(enrollment._id)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => handleReject(enrollment._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEnrollments;
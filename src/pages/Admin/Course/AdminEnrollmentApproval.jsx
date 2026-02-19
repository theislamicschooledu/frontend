import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEnrollmentApproval = () => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEnrollments();
  }, []);

  const fetchPendingEnrollments = async () => {
    try {
      const response = await axios.get('/api/enrollments/pending');
      setPendingEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching pending enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId) => {
    try {
      await axios.put(`/api/enrollments/${enrollmentId}/approve`, {
        adminNotes: 'Approved manually'
      });
      fetchPendingEnrollments();
    } catch (error) {
      console.error('Error approving enrollment:', error);
    }
  };

  const handleReject = async (enrollmentId, reason) => {
    const rejectionReason = prompt('রিজেক্ট করার কারণ লিখুন:');
    if (!rejectionReason) return;

    try {
      await axios.put(`/api/enrollments/${enrollmentId}/reject`, {
        reason: rejectionReason
      });
      fetchPendingEnrollments();
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-enrollment-approval">
      <h2>পেন্ডিং এনরোলমেন্ট রিকোয়েস্ট</h2>
      
      {pendingEnrollments.length === 0 ? (
        <p>কোনো পেন্ডিং রিকোয়েস্ট নেই</p>
      ) : (
        <div className="enrollments-list">
          {pendingEnrollments.map(enrollment => (
            <div key={enrollment._id} className="enrollment-card">
              <h3>{enrollment.course.title}</h3>
              <p><strong>নাম:</strong> {enrollment.student.name}</p>
              <p><strong>মোবাইল:</strong> {enrollment.student.phone}</p>
              <p><strong>ট্রানজেকশন আইডি:</strong> {enrollment.transactionId}</p>
              <p><strong>পেমেন্ট মেথড:</strong> {enrollment.paymentDetails.method}</p>
              <p><strong>অ্যামাউন্ট:</strong> ৳{enrollment.amount}</p>
              <p><strong>সাবমিটের সময়:</strong> {new Date(enrollment.createdAt).toLocaleString()}</p>
              
              <div className="action-buttons">
                <button 
                  onClick={() => handleApprove(enrollment._id)}
                  className="approve-btn"
                >
                  অ্যাপ্রুভ করুন
                </button>
                <button 
                  onClick={() => handleReject(enrollment._id)}
                  className="reject-btn"
                >
                  রিজেক্ট করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnrollmentApproval;
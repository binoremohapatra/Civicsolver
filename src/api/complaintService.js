import apiClient from './axiosConfig';

/**
 * 1. FETCH DASHBOARD DATA
 * Hits the /officer-view endpoint to see the full registry.
 */
export const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get('/complaints/officer-view'); 
    return response.data;
  } catch (error) {
    console.error("❌ Sync Failed:", error);
    throw error;
  }
};

/**
 * 2. OFFICER LOGIN
 */
export const loginOfficer = async (serviceId, password) => {
  try {
    const response = await apiClient.post('/auth/officer-login', {
      serviceId: serviceId,
      password: password
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'OFFICER'); 
    }
    return response.data;
    
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 3. TECHNICIAN DISPATCH (Manual Dispatch)
 */
export const assignTechnician = async (complaintId, technicianName) => {
  const response = await apiClient.post(`/complaints/${complaintId}/assign-technician`, {
    technicianName: technicianName
  });
  return response.data;
};

/**
 * 4. REQUEST OTP (Verification)
 */
export const requestClosureOTP = async (complaintId) => {
  const response = await apiClient.post(`/complaints/${complaintId}/request-otp`);
  return response.data;
};

/**
 * 5. VERIFY & CLOSE (Secure Closure)
 */
export const verifyAndCloseComplaint = async (complaintId, otp) => {
  const response = await apiClient.post(`/complaints/${complaintId}/close`, {
    otp: otp
  });
  return response.data;
};

/**
 * 6. ASSIGN MODERATOR (Appeals Tribunal)
 * ✅ FIXED: Changed to POST and added empty body `{}`
 * This prevents the 500 error by ensuring Content-Type is sent.
 */
export const assignModerator = async (complaintId) => {
  const response = await apiClient.post(
    `/complaints/${complaintId}/assign-moderator`, 
    {} // <--- Empty object is REQUIRED to prevent server crash
  );
  return response.data;
};

/**
 * 7. MODERATE APPEAL
 */
export const moderateAppeal = async (complaintId, action, feedback) => {
  const response = await apiClient.post(`/complaints/${complaintId}/moderate-appeal`, {
    complaintId: complaintId,
    // We don't send moderatorId here; Backend takes it from Token
    action: action === 'ACCEPT' ? 'APPROVE_APPEAL' : 'REJECT_APPEAL',
    feedback: feedback || "Moderated via Tribunal Console"
  });
  return response.data;
};

export const logoutOfficer = () => {
  localStorage.clear();
};
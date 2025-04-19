const apiConfig = {
  auth: process.env.NEXT_PUBLIC_AUTH_API_URL || "",
  attendance: process.env.NEXT_PUBLIC_ATTENDANCE_API_URL || "",
  admin: process.env.NEXT_PUBLIC_ADMIN_API_URL || "",
  face_ai: process.env.NEXT_PUBLIC_FACE_AI_API_URL || "",
};

export default apiConfig;

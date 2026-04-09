import axios from "axios";

const api = axios.create({
  baseURL: "https://carrental-backend-zxjd.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("carRentalToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("carRentalUser");
      localStorage.removeItem("carRentalToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

// ── Cars ──────────────────────────────────────────────────────────────
export const carsAPI = {
  getAll: () => api.get("/cars"),
  getAvailable: () => api.get("/cars/available"),
  getById: (id) => api.get(`/cars/${id}`),
  add: (data) => api.post("/admin/cars", data),
  update: (id, d) => api.put(`/admin/cars/${id}`, d),
  delete: (id) => api.delete(`/admin/cars/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────────────
export const bookingsAPI = {
  getAll: () => api.get("/bookings"),
  getMy: () => api.get("/bookings/my"),
  create: (data) => api.post("/bookings", data),
  updateStatus: (id, s) => api.put(`/bookings/${id}/status?status=${s}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// ── Admin ──────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getBookings: () => api.get("/bookings"),
  updateBookingStatus: (id, s) => api.put(`/bookings/${id}/status?status=${s}`),
  getCustomers: () => api.get("/admin/customers"),
  getCompanies: () => api.get("/admin/companies"),
  addCompany: (data) => api.post("/admin/companies", data),
  updateCompany: (id, d) => api.put(`/admin/companies/${id}`, d),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
  getLocations: () => api.get("/admin/locations"),
  addLocation: (data) => api.post("/admin/locations", data),
  updateLocation: (id, d) => api.put(`/admin/locations/${id}`, d),
  deleteLocation: (id) => api.delete(`/admin/locations/${id}`),
};

export default api;

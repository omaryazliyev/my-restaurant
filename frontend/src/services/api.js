// Base API URL configuration - points to NestJS backend at localhost:3000
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Universal fetch wrapper with Auth token and JSON handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'API so\'rovi xatoga uchradi');
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.warn(`API request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// Authentication & User Endpoints
// -------------------------------------------------------------
export const authApi = {
  login: async (credentials) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return await request('/auth/profile');
  },
};

// -------------------------------------------------------------
// Categories Endpoints
// -------------------------------------------------------------
export const categoriesApi = {
  getCategories: async () => {
    try {
      return await request('/categories');
    } catch {
      return [
        { id: 1, name: 'Birinchi taomlar' },
        { id: 2, name: 'Ikkinchi taomlar' },
        { id: 3, name: 'Salatlar' },
        { id: 4, name: 'Ichimliklar' },
        { id: 5, name: 'Fast-Food' }
      ];
    }
  },

  createCategory: async (name) => {
    return await request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  updateCategory: async (id, name) => {
    return await request(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  },

  deleteCategory: async (id) => {
    return await request(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// -------------------------------------------------------------
// Menu & Foods Endpoints
// -------------------------------------------------------------
export const menuApi = {
  getMenuItems: async (category = 'all', search = '') => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await request(`/menu${queryStr}`);
    } catch {
      return null;
    }
  },

  getMenuItemById: async (id) => {
    return await request(`/menu/${id}`);
  },

  getCategories: async () => {
    return categoriesApi.getCategories();
  },

  createMenuItem: async (itemData) => {
    return await request('/admin/menu', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  updateMenuItem: async (id, itemData) => {
    return await request(`/admin/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(itemData),
    });
  },

  deleteMenuItem: async (id) => {
    return await request(`/admin/menu/${id}`, {
      method: 'DELETE',
    });
  },
};

// -------------------------------------------------------------
// Reservations (Stol band qilish) Endpoints
// -------------------------------------------------------------
export const reservationApi = {
  createReservation: async (reservationData) => {
    return await request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  getMyReservations: async () => {
    return await request('/reservations/me');
  },

  getAllReservations: async () => {
    return await request('/admin/reservations');
  },

  updateReservationStatus: async (id, status) => {
    return await request(`/admin/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// -------------------------------------------------------------
// Tables Endpoints
// -------------------------------------------------------------
export const tablesApi = {
  getAvailability: async (date, time) => {
    return await request(`/tables/availability?date=${date}&time=${time}`);
  },
  getAllTables: async () => {
    return await request('/tables');
  },
};

// -------------------------------------------------------------
// Orders (Buyurtmalar) Endpoints
// -------------------------------------------------------------
export const ordersApi = {
  createOrder: async (orderData) => {
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return await request('/orders/me');
  },

  getAllOrders: async () => {
    return await request('/admin/orders');
  },

  updateOrderStatus: async (id, status) => {
    return await request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getStats: async () => {
    return await request('/admin/dashboard/stats');
  },
};

// -------------------------------------------------------------
// Contact Messages Endpoints
// -------------------------------------------------------------
export const contactApi = {
  sendMessage: async (contactData) => {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  getAllMessages: async () => {
    return await request('/contact/admin/messages');
  },
};

// -------------------------------------------------------------
// Users Management Endpoints (Admin)
// -------------------------------------------------------------
export const usersApi = {
  getAllUsers: async () => {
    return await request('/admin/users');
  },

  deleteUser: async (id) => {
    return await request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

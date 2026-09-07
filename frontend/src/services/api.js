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
// Authentication Endpoints
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

  getCategories: async () => {
    try {
      return await request('/categories');
    } catch {
      return [{ id: 1, name: 'Первые' }, { id: 2, name: 'Вторые' }, { id: 3, name: 'Салаты' }, { id: 4, name: 'Напитки' }, { id: 5, name: 'Фаст-Фуд' }];
    }
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
};


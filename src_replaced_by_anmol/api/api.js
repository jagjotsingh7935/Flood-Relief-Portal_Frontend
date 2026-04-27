const API_BASE_URL = import.meta.env.VITE_API_URL; // Adjust to your backend URL

// Login API call
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/accounts/api/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Authentication failed');
  }

  const data = await response.json();
  // Store tokens in sessionStorage
  sessionStorage.setItem('accessToken', data.accessToken);
  sessionStorage.setItem('refreshToken', data.refreshToken);
  
  return data;
};

// Token refresh API call
export const refreshToken = async () => {
  const refreshToken = sessionStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/accounts/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  sessionStorage.setItem('accessToken', data.access);
  return data;
};

// Fetch with authentication (handles token refresh)
export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = sessionStorage.getItem('accessToken');
  
  if (!accessToken) {
    try {
      const { access } = await refreshToken();
      accessToken = access;
    } catch (err) {
      throw new Error('Authentication required');
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    try {
      const { access } = await refreshToken();
      sessionStorage.setItem('accessToken', access);
      return fetchWithAuth(url, options); // Retry with new token
    } catch (err) {
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Request failed');
  }

  return response.json();
};

// Fetch list of admins
export const getAdmins = async () => {
  return fetchWithAuth('/accounts/api/admin/');
};

// Fetch single admin details
export const getAdmin = async (id) => {
  return fetchWithAuth(`/accounts/api/admin/${id}/`);
};

// Create new admin
export const createAdmin = async (data) => {
  const response = await fetch(`${API_BASE_URL}/accounts/api/signup/admin/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create admin');
  }

  return await response.json();
};

// Update admin
export const updateAdmin = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/accounts/api/admin/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update admin');
  }

  return await response.json();
};

// Delete admin
export const deleteAdmin = async (id) => {
  const response = await fetch(`${API_BASE_URL}/accounts/api/admin/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete admin');
  }

  return true;
};
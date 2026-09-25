const API_BASE_URL = '/api';

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('fintrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch handler with error parsing
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

// Auth Services
export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// Transaction Services
export const fetchTransactions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/transactions${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const createTransaction = async (transactionData) => {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });
  return handleResponse(res);
};

export const updateTransaction = async (id, transactionData) => {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });
  return handleResponse(res);
};

export const deleteTransaction = async (id) => {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// Budget Services
export const fetchBudget = async (month, year) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  const res = await fetch(`${API_BASE_URL}/budget?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const saveBudget = async (budgetData) => {
  const res = await fetch(`${API_BASE_URL}/budget`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });
  return handleResponse(res);
};

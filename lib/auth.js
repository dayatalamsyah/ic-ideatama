// lib/auth.js

// Cek apakah user sudah login
export function isLoggedIn() {
  if (typeof window !== 'undefined') {
    const isAdminLocal = localStorage.getItem('isAdmin');
    const isAdminSession = sessionStorage.getItem('isAdmin');
    const isAdminCookie = document.cookie.includes('isAdmin=true');
    return isAdminLocal || isAdminSession || isAdminCookie;
  }
  return false;
}

// Login Admin
export function loginAdmin(remember = false) {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem('isAdmin', 'true');
      document.cookie = `isAdmin=true; path=/; max-age=${60 * 60 * 24 * 7}`; // Cookie 7 hari
    } else {
      sessionStorage.setItem('isAdmin', 'true');
      document.cookie = `isAdmin=true; path=/`;
    }
  }
}

// Logout Admin
export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
    document.cookie = 'isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}

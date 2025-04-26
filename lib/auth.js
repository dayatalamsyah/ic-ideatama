export function isLoggedIn() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('isAdmin');
  }
  return false;
}

export function loginAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAdmin', 'true');
  }
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAdmin');
  }
}

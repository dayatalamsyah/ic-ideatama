export function isLoggedIn() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('isAdmin');
  }
  return false;
}

export function loginAdmin(remember = false) {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem('isAdmin', 'true');
    } else {
      sessionStorage.setItem('isAdmin', 'true');
    }
  }
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
  }
}

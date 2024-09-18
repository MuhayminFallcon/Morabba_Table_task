// src/router/authGuard.js
export function authGuard(to, from, next) {
  const authToken = localStorage.getItem('auth_token');

  if (authToken) {
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' }); // Redirect to home if trying to access login or register
    } else {
      next(); // Allow access to other routes
    }
  } else {
    if (to.path === '/login' || to.path === '/register') {
      next(); // Allow access to login or register
    } else {
      next({ path: '/login' }); // Redirect to login if trying to access other routes
    }
  }
}
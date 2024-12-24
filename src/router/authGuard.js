export function authGuard(to, from, next) {
  const authToken = localStorage.getItem('auth_token');

  if (!authToken) {
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (to.path === '/login' || to.path === '/register') {
      next();
    } else {
      next({ path: '/login' });
    }
  }
}
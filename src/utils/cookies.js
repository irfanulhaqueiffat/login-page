// Simple cookie helper (no external deps)
export function setCookie(name, value, options = {}) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/;`;
  if (options.maxAge !== undefined) {
    cookie += ` Max-Age=${options.maxAge};`;
  }
  if (options.expires instanceof Date) {
    cookie += ` Expires=${options.expires.toUTCString()};`;
  }
  if (options.secure) cookie += ' Secure;';
  if (options.sameSite) cookie += ` SameSite=${options.sameSite};`;
  document.cookie = cookie;
}

export function getCookie(name) {
  if (!document.cookie) return null;
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const idx = cookie.indexOf('=');
    const key = decodeURIComponent(cookie.substring(0, idx));
    const val = decodeURIComponent(cookie.substring(idx + 1));
    if (key === name) return val;
  }
  return null;
}

export function deleteCookie(name) {
  // Set Max-Age=0 to remove
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0;`;
}

export default {
  setCookie,
  getCookie,
  deleteCookie,
};

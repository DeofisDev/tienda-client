/* export const API_BASE_URL        = 'https://api.deofisdev.online'; */
// export const API_BASE_URL        = 'http://192.168.0.83:8080';
// export const OAUTH2_REDIRECT_URI = 'https://wantfrom-tienda.web.app/oauth2/redirect';
export const API_BASE_URL        = 'http://192.168.0.83:5000';
export const OAUTH2_REDIRECT_URI = 'http://localhost:4200/oauth2/redirect';
export const GOOGLE_AUTH_URL     = `${API_BASE_URL}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`;
export const FACEBOOK_AUTH_URL   = `${API_BASE_URL}/oauth2/authorize/facebook?redirect_uri=${OAUTH2_REDIRECT_URI}`;
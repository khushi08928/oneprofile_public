import baseAxios from 'axios';

// Create axios instance with base URL from environment variable
const axiosInstance = baseAxios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || '',
    withCredentials: true,
});

// Debug: Log the configuration
// console.log('Axios Config:', {
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     hasBackendUrl: !!import.meta.env.VITE_BACKEND_URL
// });

// Add cache-busting headers to prevent caching of GET requests
axiosInstance.interceptors.request.use((config) => {
    // Prevent caching for GET requests (important for username validation)
    if (config.method === 'get') {
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';
    }

    // In production (when VITE_BACKEND_URL is set), rewrite /api to /api/v1
    // In development, the Vite proxy handles this rewrite
    if (import.meta.env.VITE_BACKEND_URL) {
        if (config.url && config.url.startsWith('/api')) {
            // const originalUrl = config.url;
            config.url = config.url.replace(/^\/api/, '/api/v1');
            // console.log('URL Rewrite:', originalUrl, '->', config.url);
        }
    }

    // console.log('Final Request URL:', (config.baseURL || '') + (config.url || ''));
    return config;
});

// Export the isAxiosError utility
export const isAxiosError = baseAxios.isAxiosError;

export default axiosInstance;

import baseAxios from 'axios';

// Create axios instance with base URL from environment variable
const axiosInstance = baseAxios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || '',
    withCredentials: true,
});

// Debug: Log the configuration
console.log('Axios Config:', {
    baseURL: import.meta.env.VITE_BACKEND_URL,
    hasBackendUrl: !!import.meta.env.VITE_BACKEND_URL
});

// In production (when VITE_BACKEND_URL is set), rewrite /api to /api/v1
// In development, the Vite proxy handles this rewrite
if (import.meta.env.VITE_BACKEND_URL) {
    axiosInstance.interceptors.request.use((config) => {
        if (config.url && config.url.startsWith('/api')) {
            const originalUrl = config.url;
            config.url = config.url.replace(/^\/api/, '/api/v1');
            // console.log('URL Rewrite:', originalUrl, '->', config.url);
        }
        // console.log('Final Request URL:', (config.baseURL || '') + (config.url || ''));
        return config;
    });
}

// Export the isAxiosError utility
export const isAxiosError = baseAxios.isAxiosError;

export default axiosInstance;

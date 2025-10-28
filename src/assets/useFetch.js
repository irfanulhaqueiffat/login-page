import { useState } from 'react';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';

const useFetch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Add authorization header if access token exists
            const accessToken = getCookie('accessToken');
            if (accessToken) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${accessToken}`
                };
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            // Handle token expiration
            if (response.status === 401) {
                const refreshToken = getCookie('refreshToken');
                if (refreshToken) {
                    try {
                        // Try to refresh the token - update endpoint as needed
                        const refreshResponse = await fetch('YOUR_REFRESH_TOKEN_ENDPOINT', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ refreshToken })
                        });

                        if (refreshResponse.ok) {
                            const body = await refreshResponse.json();
                            const newAccessToken = body.accessToken || body.token || body.data?.token;
                            if (newAccessToken) {
                                setCookie('accessToken', newAccessToken, { maxAge: 50, sameSite: 'Lax' });
                                // Retry the original request with new token
                                options.headers = {
                                    ...options.headers,
                                    'Authorization': `Bearer ${newAccessToken}`
                                };
                                return await fetch(url, options);
                            }
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // Clear cookies if refresh fails
                        deleteCookie('accessToken');
                        deleteCookie('refreshToken');
                        deleteCookie('loginExpiration');
                        window.location.href = '/login';
                        throw new Error('Session expired. Please login again.');
                    }
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        fetchData
    };
};

export default useFetch;
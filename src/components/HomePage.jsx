import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCookie, deleteCookie } from '../utils/cookies';

const HomePage = () => {
    const navigate = useNavigate();
    const [timeRemaining, setTimeRemaining] = useState(50);

    useEffect(() => {
        // Check if user is logged in and if login hasn't expired
        const checkLoginStatus = () => {
            const accessToken = getCookie('accessToken');
            const loginExpiration = getCookie('loginExpiration');

            if (!accessToken || !loginExpiration) {
                navigate('/login');
                return;
            }

            const currentTime = new Date().getTime();
            const expirationTime = parseInt(loginExpiration);
            const remainingTime = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));

            setTimeRemaining(remainingTime);

            if (currentTime > expirationTime) {
                // Login expired
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                deleteCookie('loginExpiration');
                toast.info('Session expired. Please login again.');
                navigate('/login');
            }
        };

        checkLoginStatus();
        // Check login status every second
        const interval = setInterval(checkLoginStatus, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        deleteCookie('loginExpiration');
        navigate('/login');
    };

    return (
        <div className="container flex justify-center items-center min-h-screen bg-gray-100 py-10 px">
        <div className="home-container">
            <h1>Welcome to Home Page</h1>
            <p>You are successfully logged in!</p>
            <p className="timer">Session expires in: {timeRemaining} seconds</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
        </div>
    );
};

export default HomePage;
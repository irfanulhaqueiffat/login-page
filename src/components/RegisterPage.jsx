import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from '../assets/useFetch';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { fetchData, loading } = useFetch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key].trim()) {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        });

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        try {
            const response = await fetchData('https://api.freeapi.app/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.data) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                toast.error(response.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Register</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="form-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
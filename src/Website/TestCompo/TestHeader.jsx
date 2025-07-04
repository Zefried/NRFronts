import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Components/Home/mainLogo.jpeg';
import { AuthAction } from '../../CustomStateManage/OrgUnits/AuthState';
import './TestHeader.css';

const TestHeader = () => {
    const [showAccount, setShowAccount] = useState(false);
    const [userData, setUserData] = useState(null);
    const dropdownRef = useRef(null);
    const isAuthenticated = AuthAction.getState('auth')?.isAuthenticated;
    const navigate = useNavigate();

    useEffect(() => {
        // Set user data if authenticated
        if (isAuthenticated) {
            setUserData({
                name: AuthAction.getState('auth')?.name || 'Account'
            });
        }

        // Handle click outside dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAccount(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAuthenticated]);

    const handleBookingsClick = () => {
        if (isAuthenticated) navigate('/bookings');
        else navigate('/login');
    };

    const handleLogOut = () => {
        AuthAction.updateState({ isAuthenticated: false });
        navigate('/');
        window.location.reload();
    };

    return (
        <header className="modern-header">
            <div className="header-container">
                {/* Logo Section */}
                <Link to="/" className="logo-wrapper">
                    <img src={logo} alt="Quick & Easy Logo" className="logo-img" />
                    <span className="logo-text">Quick & Easy Bookings</span>
                </Link>

                {/* Navigation Actions */}
                <div className="nav-actions" ref={dropdownRef}>
                    {/* Bookings Button */}
                    <button 
                        className="nav-btn bookings-btn" 
                        onClick={handleBookingsClick}
                        aria-label="My Bookings"
                    >
                        <i className="ri-calendar-line"></i>
                        <span>My Bookings</span>
                    </button>

                    {/* Account Dropdown */}
                    <div 
                        className={`account-dropdown-trigger ${showAccount ? 'active' : ''}`}
                        onClick={() => setShowAccount(!showAccount)}
                        aria-haspopup="true"
                        aria-expanded={showAccount}
                    >
                        <i className="ri-user-line"></i>
                        <span>{isAuthenticated ? userData?.name || 'Account' : 'Login'}</span>
                        <i className={`ri-arrow-down-s-line dropdown-arrow ${showAccount ? 'rotate' : ''}`}></i>
                    </div>

                    {/* Dropdown Menu */}
                    {showAccount && (
                        <div className="account-dropdown">
                            {!isAuthenticated ? (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="dropdown-item"
                                        onClick={() => setShowAccount(false)}
                                    >
                                        <i className="ri-login-box-line"></i>
                                        <span>Login</span>
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="dropdown-item highlight"
                                        onClick={() => setShowAccount(false)}
                                    >
                                        <i className="ri-user-add-line"></i>
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/account" 
                                        className="dropdown-item"
                                        onClick={() => setShowAccount(false)}
                                    >
                                        <i className="ri-account-circle-line"></i>
                                        <span>My Account</span>
                                    </Link>
                                    <button 
                                        className="dropdown-item logout-btn"
                                        onClick={handleLogOut}
                                    >
                                        <i className="ri-logout-box-r-line"></i>
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TestHeader;
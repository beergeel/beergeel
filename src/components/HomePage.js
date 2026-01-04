import React, { useState, useEffect, useCallback } from 'react';

function HomePage({ onLogin, db, redirectToPatient }) {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [notice, setNotice] = useState('');

    const updateHomePageNotice = useCallback(async () => {
        const notices = await db.getAll('notices');
        if (notices.length > 0) {
            setNotice(notices[0].content);
        } else {
            setNotice('No notice available. Please add a new notice.');
        }
    }, [db]);

    useEffect(() => {
        updateHomePageNotice();
    }, [updateHomePageNotice]);

    const handleLogin = async () => {
        // Trim inputs
        const trimmedLoginId = loginId.trim();
        const trimmedPassword = password.trim();
        
        if (!trimmedLoginId || !trimmedPassword) {
            alert('Please enter your phone number and password');
            return;
        }

        try {
            // Patient-only login
            const patient = await db.findPatientByMobile(trimmedLoginId);
            const patientPassword = (patient?.password || '').toString().trim();
            
            if (patient && patientPassword === trimmedPassword) {
                onLogin(patient, 'patient');
            } else {
                alert('Invalid credentials. Please check your phone number and password, or contact the clinic for assistance.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(`Login error: ${error.message}. Please try again or contact the clinic.`);
        }
    };

    return (
        <div className="home-page">
            <div className="home-container">
                <div className="clinic-header">
                    <img 
                        src="/logo.png" 
                        alt="Beergeel Clinic Logo" 
                        className="home-logo" 
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/120x120/1e3c72/ffffff?text=OBGYN";
                        }}
                    />
                    <h1 className="clinic-title">Beergeel Obstetrics and Gynecology Clinic</h1>
                    <p className="clinic-subtitle">Takhasusuka sare ee xanuunada dumarka</p>
                    <div className="clinic-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</span>
                    </div>
                    <p><i className="fas fa-phone"></i> Contact: 0634026635 (Mobile/WhatsApp)</p>
                </div>
                
                <div className="home-content">
                    <div className="notice-section">
                        <h3 className="notice-title">
                            <i className="fas fa-bell"></i> Clinic Notices
                        </h3>
                        <div className="notice-content">
                            {notice}
                        </div>
                    </div>
                    
                    <div className="login-section">
                        <h3 className="login-title">Patient Portal Login</h3>
                        <div className="alert alert-info mb-3">
                            <i className="fas fa-info-circle"></i> Please login with your phone number and password to access your medical information.
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button className="btn btn-primary w-100" onClick={handleLogin}>
                            <i className="fas fa-sign-in-alt"></i> Login to Patient Portal
                        </button>
                    </div>
                </div>
                
                <div className="footer-info">
                    <p>© 2024 Beergeel Obstetrics and Gynecology Clinic. All rights reserved. | Your Health is Our Priority</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;


import React, { useState, useEffect } from 'react';

function HomePage({ onLogin, db }) {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('1234');
    const [role, setRole] = useState('patient');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        updateHomePageNotice();
    }, []);

    const updateHomePageNotice = () => {
        const notices = db.getAll('notices');
        if (notices.length > 0) {
            setNotice(notices[0].content);
        } else {
            setNotice('No notice available. Please add a new notice.');
        }
    };

    const handleLogin = () => {
        if (!loginId || !password) {
            alert('Please enter login ID and password');
            return;
        }

        if (role === 'patient') {
            const patient = db.findPatientByMobile(loginId);
            if (patient && patient.password === password) {
                onLogin(patient, 'patient');
            } else {
                alert('Invalid patient credentials. Please check mobile number and password.');
            }
        } else {
            const users = db.getAll('users');
            const user = users.find(u => 
                u.username === loginId && 
                u.password === password && 
                u.role === role
            );
            
            if (user) {
                onLogin(user, role);
            } else {
                alert('Invalid credentials. Please check login details.');
            }
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
                        <h3 className="login-title">System Login</h3>
                        
                        <div className="mb-3">
                            <label className="form-label">Login ID (Phone Number)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                placeholder="e.g., 4026635"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Login As</label>
                            <select 
                                className="form-select" 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="patient">Patient</option>
                                <option value="reception">Reception</option>
                                <option value="doctor">Doctor</option>
                                <option value="pharmacy">Pharmacy</option>
                                <option value="lab">Laboratory</option>
                            </select>
                        </div>
                        
                        <button className="btn btn-primary w-100" onClick={handleLogin}>
                            <i className="fas fa-sign-in-alt"></i> Login to System
                        </button>
                        
                        <div className="text-center mt-3">
                            <small className="text-muted">Default password: 1234</small>
                        </div>
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


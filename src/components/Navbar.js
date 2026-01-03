import React, { useState } from 'react';

function Navbar({ currentUser, onLogout, db, onToggleSidebar }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const changePassword = () => {
        const currentPassword = prompt('Enter current password:');
        if (!currentPassword) return;
        
        // Check current password
        const user = db.getUserByUsername(currentUser.username);
        if (!user || user.password !== currentPassword) {
            // Check if patient
            if (currentUser.password !== currentPassword) {
                alert('Current password is incorrect');
                return;
            }
        }
        
        const newPassword = prompt('Enter new password:');
        if (!newPassword) return;
        
        const confirmPassword = prompt('Confirm new password:');
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Update password
        if (currentUser.role === 'patient') {
            db.update('patients', currentUser.id, { password: newPassword });
        } else {
            db.update('users', currentUser.id, { password: newPassword });
        }
        
        alert('Password changed successfully!');
        setShowDropdown(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
                {/* Mobile Menu Toggle */}
                <button 
                    className="btn btn-outline-light btn-sm d-lg-none me-2" 
                    onClick={onToggleSidebar}
                    style={{ border: 'none' }}
                >
                    <i className="fas fa-bars"></i>
                </button>
                
                <div className="logo-container">
                    <img 
                        src="/logo.png" 
                        alt="Clinic Logo" 
                        className="logo-img" 
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60x60/2c3e50/ffffff?text=OBGYN";
                        }}
                    />
                    <span className="clinic-name">Beergeel Obstetrics & Gynecology Clinic</span>
                </div>
                
                <div className="d-flex align-items-center">
                    <div className="dropdown">
                        <button 
                            className="btn btn-outline-light btn-sm dropdown-toggle" 
                            type="button" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <i className="fas fa-user"></i> {currentUser?.name || currentUser?.username}
                        </button>
                        {showDropdown && (
                            <ul className="dropdown-menu dropdown-menu-end show" style={{ display: 'block' }}>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changePassword(); }}>
                                        <i className="fas fa-key"></i> Change Password
                                    </a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;


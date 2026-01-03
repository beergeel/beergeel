import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import MainApp from './components/MainApp';
import ClinicDB from './utils/clinicDB';

const db = new ClinicDB();

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (user, role) => {
        setCurrentUser(user);
        setCurrentRole(role);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentRole(null);
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            {!isLoggedIn ? (
                <HomePage onLogin={handleLogin} db={db} />
            ) : (
                <MainApp 
                    currentUser={currentUser} 
                    currentRole={currentRole} 
                    onLogout={handleLogout}
                    db={db}
                />
            )}
        </div>
    );
}

export default App;


import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import MainApp from './components/MainApp';
import PublicTicketView from './components/PublicTicketView';
import PublicPatientView from './components/PublicPatientView';
import SupabaseDB from './utils/supabaseDB';

const db = new SupabaseDB();

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ticketCode, setTicketCode] = useState(null);
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        // Check if URL contains a ticket code or patient ID
        const path = window.location.pathname;
        const ticketMatch = path.match(/\/ticket\/([A-Z0-9]+)/i);
        const patientMatch = path.match(/\/patient\/(\d+)/i);
        
        if (ticketMatch) {
            setTicketCode(ticketMatch[1].toUpperCase());
        } else if (patientMatch) {
            setPatientId(parseInt(patientMatch[1]));
        }
    }, []);

    const handleLogin = (user, role) => {
        setCurrentUser(user);
        setCurrentRole(role);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentRole(null);
        setIsLoggedIn(false);
        // Redirect to home page if on a patient view
        if (patientId) {
            window.history.pushState({}, '', '/');
            setPatientId(null);
        }
    };

    // If viewing a ticket, show PublicTicketView
    if (ticketCode) {
        return (
            <div className="App">
                <PublicTicketView ticketCode={ticketCode} db={db} />
            </div>
        );
    }

    // If viewing a patient, require login first
    if (patientId) {
        if (!isLoggedIn) {
            return (
                <div className="App">
                    <HomePage 
                        onLogin={handleLogin} 
                        db={db}
                        redirectToPatient={patientId}
                    />
                </div>
            );
        }
        return (
            <div className="App">
                <PublicPatientView 
                    patientId={patientId} 
                    db={db}
                    currentUser={currentUser}
                    currentRole={currentRole}
                    onLogout={handleLogout}
                />
            </div>
        );
    }

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


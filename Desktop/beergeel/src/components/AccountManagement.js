import React, { useState, useEffect } from 'react';

function AccountManagement({ currentUser, db, setActiveView }) {
    const [activeTab, setActiveTab] = useState('staff');
    const [users, setUsers] = useState(db.getAll('users'));
    const [patients, setPatients] = useState(db.getAll('patients'));
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'patients') {
            filterPatients();
        }
    }, [searchTerm, activeTab]);

    const filterPatients = () => {
        const filtered = db.searchPatients(searchTerm);
        setPatients(filtered);
    };

    const resetPassword = (type, id) => {
        const newPassword = prompt('Enter new password (default: 1234):', '1234');
        if (!newPassword) return;
        
        if (type === 'staff') {
            const user = db.getById('users', id);
            if (user) {
                db.update('users', id, { password: newPassword });
                alert(`Password reset for ${user.name}. New password: ${newPassword}`);
                setUsers(db.getAll('users'));
            }
        } else if (type === 'patient') {
            const patient = db.getById('patients', id);
            if (patient) {
                db.update('patients', id, { password: newPassword });
                alert(`Password reset for ${patient.name}. New password: ${newPassword}`);
                setPatients(db.getAll('patients'));
            }
        }
    };

    if (currentUser.role !== 'reception') {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-danger">
                        Access denied. Only reception can manage accounts.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-users-cog"></i> Account Management
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === 'staff' ? 'active' : ''}`}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActiveTab('staff'); }}
                        >
                            Staff Accounts
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActiveTab('patients'); }}
                        >
                            Patient Accounts
                        </a>
                    </li>
                </ul>
                
                <div className="tab-content mt-3">
                    {activeTab === 'staff' && (
                        <div className="tab-pane fade show active">
                            <h5>Staff Accounts ({users.length})</h5>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>Mobile</th>
                                            <th>Password</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.username}</td>
                                                <td><span className="badge bg-info">{user.role}</span></td>
                                                <td>{user.mobile}</td>
                                                <td>{user.password}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-warning" 
                                                        onClick={() => resetPassword('staff', user.id)}
                                                    >
                                                        <i className="fas fa-key"></i> Reset Password
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'patients' && (
                        <div className="tab-pane fade show active">
                            <h5>Patient Accounts ({patients.length})</h5>
                            <div className="mb-3">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or mobile"
                                />
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Age/Sex</th>
                                            <th>Password</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map(patient => (
                                            <tr key={patient.id}>
                                                <td>{patient.id}</td>
                                                <td>{patient.name}</td>
                                                <td>{patient.mobile}</td>
                                                <td>{patient.age} yrs / {patient.sex}</td>
                                                <td>{patient.password}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-warning" 
                                                        onClick={() => resetPassword('patient', patient.id)}
                                                    >
                                                        <i className="fas fa-key"></i> Reset Password
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountManagement;


import React, { useState, useEffect } from 'react';

function PatientList({ currentUser, currentRole, db, setActiveView }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        filterPatients();
    }, [searchTerm]);

    const filterPatients = () => {
        const filtered = db.searchPatients(searchTerm);
        setPatients(filtered);
    };

    const createVisitForPatient = (patientId) => {
        setActiveView('createVisit');
        // Store patient ID in sessionStorage for CreateVisit component
        sessionStorage.setItem('selectedPatientId', patientId);
    };

    const recordPaymentForPatient = (patientId) => {
        setActiveView('financial');
        sessionStorage.setItem('selectedPatientId', patientId);
    };

    const editConsultationFromPatientList = (visitId, patientId) => {
        setActiveView('doctorQueue');
        sessionStorage.setItem('selectedVisitId', visitId);
        sessionStorage.setItem('selectedPatientId', patientId);
    };

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <i className="fas fa-list"></i> Patient List
                    <span className="badge bg-primary ms-2">{patients.length} Patients</span>
                </div>
                <div className="d-flex gap-2">
                    <input 
                        type="text" 
                        className="form-control" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or mobile" 
                        style={{ width: '250px' }}
                    />
                    {currentRole === 'reception' && (
                        <button className="btn btn-primary" onClick={() => setActiveView('registerPatient')}>
                            <i className="fas fa-user-plus"></i> Add Patient
                        </button>
                    )}
                </div>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Age/Sex</th>
                                <th>Registered Date</th>
                                <th>Visits</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(patient => {
                                const visits = db.getPatientVisits(patient.id);
                                const latestVisit = visits[visits.length - 1];
                                
                                return (
                                    <tr key={patient.id}>
                                        <td>{patient.id}</td>
                                        <td>{patient.name}</td>
                                        <td>{patient.mobile}</td>
                                        <td>{patient.age} yrs / {patient.sex}</td>
                                        <td>{new Date(patient.created_date).toLocaleDateString()}</td>
                                        <td><span className="badge bg-info">{visits.length}</span></td>
                                        <td>
                                            <div className="btn-group">
                                                {currentRole === 'reception' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm btn-primary" 
                                                            onClick={() => createVisitForPatient(patient.id)}
                                                        >
                                                            <i className="fas fa-stethoscope"></i> Visit
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-success" 
                                                            onClick={() => recordPaymentForPatient(patient.id)}
                                                        >
                                                            <i className="fas fa-money-bill"></i> Payment
                                                        </button>
                                                    </>
                                                )}
                                                {currentRole === 'doctor' && latestVisit && (
                                                    <button 
                                                        className="btn btn-sm btn-warning" 
                                                        onClick={() => editConsultationFromPatientList(latestVisit.id, patient.id)}
                                                    >
                                                        <i className="fas fa-edit"></i> Edit Consultation
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PatientList;


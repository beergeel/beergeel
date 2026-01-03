import React, { useState } from 'react';

function LabTests({ currentUser, db, setActiveView }) {
    const [labRequests, setLabRequests] = useState(db.getAll('lab_requests'));

    const visits = db.getAll('visits');
    const patients = db.getAll('patients');

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-flask"></i> All Lab Tests
                <span className="badge bg-primary ms-2">{labRequests.length} Total</span>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Tests</th>
                                <th>Results</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labRequests.map(request => {
                                const visit = visits.find(v => v.id == request.visit_id);
                                const patient = patients.find(p => p.id == visit?.patient_id);
                                
                                return (
                                    <tr key={request.id}>
                                        <td>{patient?.name || 'Unknown'}</td>
                                        <td>{new Date(request.created_date).toLocaleDateString()}</td>
                                        <td>{request.tests}</td>
                                        <td>{request.results || 'Pending'}</td>
                                        <td>
                                            <span className={`badge ${request.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                {request.status || 'pending'}
                                            </span>
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

export default LabTests;


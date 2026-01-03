import React, { useState } from 'react';

function Prescriptions({ currentUser, db, setActiveView }) {
    const [prescriptions, setPrescriptions] = useState(db.getAll('prescriptions'));

    const dispensePrescription = (visitId) => {
        const prescription = prescriptions.find(p => p.visit_id == visitId);
        
        if (prescription) {
            db.update('prescriptions', prescription.id, { 
                status: 'dispensed',
                dispensed_by: currentUser.id,
                dispensed_date: new Date().toISOString()
            });
            
            const queueItems = db.getAll('queue').filter(q => 
                q.visit_id == visitId && q.department === 'pharmacy'
            );
            queueItems.forEach(item => {
                db.update('queue', item.id, { status: 'completed' });
            });
            
            alert('Prescription dispensed successfully!');
            setPrescriptions(db.getAll('prescriptions'));
        }
    };

    const visits = db.getAll('visits');
    const patients = db.getAll('patients');

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-prescription"></i> All Prescriptions
                <span className="badge bg-primary ms-2">{prescriptions.length} Total</span>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Drugs</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map(prescription => {
                                const visit = visits.find(v => v.id == prescription.visit_id);
                                const patient = patients.find(p => p.id == visit?.patient_id);
                                
                                return (
                                    <tr key={prescription.id}>
                                        <td>{patient?.name || 'Unknown'}</td>
                                        <td>{new Date(prescription.created_date).toLocaleDateString()}</td>
                                        <td>{prescription.drugs}</td>
                                        <td>
                                            <span className={`badge ${prescription.status === 'dispensed' ? 'bg-success' : 'bg-warning'}`}>
                                                {prescription.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>
                                            {prescription.status !== 'dispensed' ? (
                                                <button 
                                                    className="btn btn-sm btn-success" 
                                                    onClick={() => dispensePrescription(prescription.visit_id)}
                                                >
                                                    <i className="fas fa-check-circle"></i> Dispense
                                                </button>
                                            ) : (
                                                'Completed'
                                            )}
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

export default Prescriptions;


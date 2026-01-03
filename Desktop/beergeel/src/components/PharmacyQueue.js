import React, { useState, useEffect } from 'react';

function PharmacyQueue({ currentUser, db, setActiveView }) {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        loadQueue();
    }, []);

    const loadQueue = () => {
        const queueData = db.getQueueForDepartment('pharmacy');
        setQueue(queueData);
    };

    const dispensePrescription = (visitId) => {
        const prescriptions = db.getAll('prescriptions');
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
            loadQueue();
        } else {
            alert('Prescription not found!');
        }
    };

    const dispensedToday = db.getAll('prescriptions').filter(p => p.status === 'dispensed').length;

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">
                        <i className="fas fa-users"></i> Pharmacy Queue
                        <span className="badge bg-danger ms-2">{queue.length} Waiting</span>
                    </div>
                    <div className="card-body">
                        {queue.length === 0 ? (
                            <p className="text-muted">No prescriptions in queue.</p>
                        ) : (
                            queue.map(item => {
                                const patient = item.patient;
                                const visit = item.visit;
                                const prescription = db.getAll('prescriptions').find(p => p.visit_id == visit.id);
                                
                                return (
                                    <div key={visit.id} className="patient-queue">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5>{patient?.name || 'Unknown Patient'}</h5>
                                                <p className="mb-1">
                                                    <i className="fas fa-phone"></i> {patient?.mobile || 'N/A'} | 
                                                    <i className="fas fa-user"></i> {patient?.sex || 'N/A'}, {patient?.age || 'N/A'} yrs
                                                </p>
                                                <div className="mt-2">
                                                    <strong>Prescription:</strong>
                                                    <p className="mb-0 text-muted">{prescription?.drugs || 'No prescription found'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button 
                                                    className="btn btn-success" 
                                                    onClick={() => dispensePrescription(visit.id)}
                                                >
                                                    <i className="fas fa-check-circle"></i> Dispense
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card">
                    <div className="card-header">
                        <i className="fas fa-chart-bar"></i> Pharmacy Statistics
                    </div>
                    <div className="card-body">
                        <div className="stat-card">
                            <i className="fas fa-prescription-bottle fa-2x text-primary"></i>
                            <div className="stat-number">{queue.length}</div>
                            <div className="stat-label">Pending Prescriptions</div>
                        </div>
                        <div className="stat-card mt-3">
                            <i className="fas fa-check-circle fa-2x text-success"></i>
                            <div className="stat-number">{dispensedToday}</div>
                            <div className="stat-label">Dispensed Today</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PharmacyQueue;


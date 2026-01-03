import React, { useState, useEffect } from 'react';

function LabQueue({ currentUser, db, setActiveView }) {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        loadQueue();
    }, []);

    const loadQueue = () => {
        const queueData = db.getQueueForDepartment('lab');
        setQueue(queueData);
    };

    const recordLabResults = (visitId) => {
        const labRequest = db.getAll('lab_requests').find(l => l.visit_id == visitId);
        const visit = db.getById('visits', visitId);
        const patient = db.getById('patients', visit?.patient_id);
        
        if (!labRequest) {
            alert('No lab request found for this visit');
            return;
        }
        
        const results = prompt(`Enter lab results for ${patient?.name || 'the patient'}:\n\nTests: ${labRequest.tests}\n\nEnter results:`);
        
        if (results !== null && results.trim()) {
            db.update('lab_requests', labRequest.id, { 
                results: results.trim(),
                status: 'completed',
                completed_by: currentUser.id,
                completed_date: new Date().toISOString()
            });
            
            const queueItems = db.getAll('queue').filter(q => 
                q.visit_id == visitId && q.department === 'lab'
            );
            queueItems.forEach(item => {
                db.update('queue', item.id, { status: 'completed' });
            });
            
            alert('Lab results recorded successfully!');
            loadQueue();
        }
    };

    const completedToday = db.getAll('lab_requests').filter(l => l.status === 'completed').length;

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">
                        <i className="fas fa-users"></i> Laboratory Queue
                        <span className="badge bg-danger ms-2">{queue.length} Waiting</span>
                    </div>
                    <div className="card-body">
                        {queue.length === 0 ? (
                            <p className="text-muted">No lab tests in queue.</p>
                        ) : (
                            queue.map(item => {
                                const patient = item.patient;
                                const visit = item.visit;
                                const labRequest = db.getAll('lab_requests').find(l => l.visit_id == visit.id);
                                
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
                                                    <strong>Tests Requested:</strong>
                                                    <p className="mb-0 text-muted">{labRequest?.tests || 'No tests specified'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button 
                                                    className="btn btn-primary" 
                                                    onClick={() => recordLabResults(visit.id)}
                                                >
                                                    <i className="fas fa-flask"></i> Record Results
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
                        <i className="fas fa-chart-bar"></i> Lab Statistics
                    </div>
                    <div className="card-body">
                        <div className="stat-card">
                            <i className="fas fa-flask fa-2x text-primary"></i>
                            <div className="stat-number">{queue.length}</div>
                            <div className="stat-label">Pending Tests</div>
                        </div>
                        <div className="stat-card mt-3">
                            <i className="fas fa-check-circle fa-2x text-success"></i>
                            <div className="stat-number">{completedToday}</div>
                            <div className="stat-label">Completed Today</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LabQueue;


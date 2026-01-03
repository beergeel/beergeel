import React, { useState, useEffect } from 'react';
import Consultation from './Consultation';

function DoctorQueue({ currentUser, db, setActiveView }) {
    const [queue, setQueue] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        loadQueue();
        const selectedVisitId = sessionStorage.getItem('selectedVisitId');
        const selectedPatientId = sessionStorage.getItem('selectedPatientId');
        if (selectedVisitId && selectedPatientId) {
            const visit = db.getById('visits', parseInt(selectedVisitId));
            const patient = db.getById('patients', parseInt(selectedPatientId));
            if (visit && patient) {
                startConsultation(visit.id, patient.id);
            }
            sessionStorage.removeItem('selectedVisitId');
            sessionStorage.removeItem('selectedPatientId');
        }
    }, []);

    const loadQueue = () => {
        const queueData = db.getQueueForDepartment('doctor');
        setQueue(queueData);
    };

    const startConsultation = (visitId, patientId) => {
        setSelectedVisit(visitId);
        setSelectedPatient(patientId);
    };

    const continueConsultation = (visitId, patientId) => {
        setSelectedVisit(visitId);
        setSelectedPatient(patientId);
    };

    const checkLabResults = (visitId) => {
        const labRequest = db.getAll('lab_requests').find(l => l.visit_id == visitId);
        
        if (labRequest?.results) {
            alert(`Laboratory Results:\n\n${labRequest.results}\n\nYou can now continue consultation and complete it.`);
        } else {
            alert('Laboratory results are not available yet.');
        }
    };

    const handleBackToQueue = () => {
        setSelectedVisit(null);
        setSelectedPatient(null);
        loadQueue();
    };

    if (selectedVisit && selectedPatient) {
        return (
            <Consultation 
                visitId={selectedVisit}
                patientId={selectedPatient}
                currentUser={currentUser}
                db={db}
                onBack={handleBackToQueue}
            />
        );
    }

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <i className="fas fa-users"></i> Doctor Queue
                    <span className="badge bg-danger ms-2">{queue.length} Waiting</span>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => setActiveView('patientList')}>
                        <i className="fas fa-list"></i> Select from Patient List
                    </button>
                </div>
            </div>
            <div className="card-body">
                {queue.length === 0 ? (
                    <p className="text-muted">No patients in queue.</p>
                ) : (
                    queue.map(item => {
                        const patient = item.patient;
                        const visit = item.visit;
                        const consultation = item.consultation;
                        const queueItem = db.getAll('queue').find(q => q.visit_id == visit?.id && q.department === 'doctor');
                        
                        let statusText = 'New';
                        let statusClass = 'status-waiting';
                        
                        if (consultation) {
                            if (queueItem?.status === 'waiting_results') {
                                statusText = 'Awaiting Results';
                                statusClass = 'status-results';
                            } else {
                                statusText = 'In Progress';
                                statusClass = 'status-inprogress';
                            }
                        }
                        
                        return (
                            <div key={visit?.id} className="patient-queue">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div style={{ flexGrow: 1 }}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h5>{patient?.name || 'Unknown Patient'}</h5>
                                                <p className="mb-1">
                                                    <i className="fas fa-phone"></i> {patient?.mobile || 'N/A'} | 
                                                    <i className="fas fa-user"></i> {patient?.sex || 'N/A'}, {patient?.age || 'N/A'} yrs
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Vitals:</strong> BP: {visit?.bp || 'N/A'}, 
                                                    PR: {visit?.pr || 'N/A'}, 
                                                    Temp: {visit?.temperature || 'N/A'}°C
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`queue-status ${statusClass}`}>{statusText}</span>
                                            </div>
                                        </div>
                                        {consultation && (
                                            <div className="mt-2">
                                                <p className="mb-1"><strong>Previous Consultation:</strong></p>
                                                <p className="mb-0 text-muted">
                                                    {consultation.chief_complaint.substring(0, 100)}
                                                    {consultation.chief_complaint.length > 100 ? '...' : ''}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ms-3">
                                        {!consultation ? (
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={() => startConsultation(visit.id, patient.id)}
                                            >
                                                <i className="fas fa-stethoscope"></i> Start Consultation
                                            </button>
                                        ) : (
                                            <div className="d-flex flex-column gap-2">
                                                <button 
                                                    className="btn btn-success" 
                                                    onClick={() => continueConsultation(visit.id, patient.id)}
                                                >
                                                    <i className="fas fa-edit"></i> Continue
                                                </button>
                                                {queueItem?.status === 'waiting_results' && (
                                                    <button 
                                                        className="btn btn-info" 
                                                        onClick={() => checkLabResults(visit.id)}
                                                    >
                                                        <i className="fas fa-flask"></i> Check Results
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default DoctorQueue;


import React, { useState, useEffect } from 'react';
import Consultation from './Consultation';

function DoctorQueue({ currentUser, db, setActiveView }) {
    const [queue, setQueue] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [queueData, setQueueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLabResultsModal, setShowLabResultsModal] = useState(false);
    const [labResultsData, setLabResultsData] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            await loadQueue();
            
            const selectedVisitId = sessionStorage.getItem('selectedVisitId');
            const selectedPatientId = sessionStorage.getItem('selectedPatientId');
            if (selectedVisitId && selectedPatientId) {
                try {
                    const [visit, patient] = await Promise.all([
                        db.getById('visits', parseInt(selectedVisitId)),
                        db.getById('patients', parseInt(selectedPatientId))
                    ]);
                    if (visit && patient) {
                        startConsultation(visit.id, patient.id);
                    }
                    sessionStorage.removeItem('selectedVisitId');
                    sessionStorage.removeItem('selectedPatientId');
                } catch (err) {
                    console.error('Error loading selected visit/patient:', err);
                }
            }
        };
        loadInitialData();
    }, []);

    const loadQueue = async () => {
        try {
            setLoading(true);
            const queueItems = await db.getQueueForDepartment('doctor');
            setQueue(queueItems);
            
            // Also load all queue data for status checking
            const allQueue = await db.getAll('queue');
            setQueueData(allQueue);
        } catch (err) {
            console.error('Error loading queue:', err);
        } finally {
            setLoading(false);
        }
    };

    const startConsultation = (visitId, patientId) => {
        setSelectedVisit(visitId);
        setSelectedPatient(patientId);
    };

    const continueConsultation = (visitId, patientId) => {
        setSelectedVisit(visitId);
        setSelectedPatient(patientId);
    };

    const checkLabResults = async (visitId) => {
        try {
            const allLabRequests = await db.getAll('lab_requests');
            const labRequest = allLabRequests.find(l => l.visit_id == visitId);
            
            if (labRequest?.results) {
                setLabResultsData(labRequest);
                setShowLabResultsModal(true);
            } else {
                alert('Laboratory results are not available yet.');
            }
        } catch (err) {
            console.error('Error checking lab results:', err);
            alert('Error checking lab results. Please try again.');
        }
    };

    const handleBackToQueue = async () => {
        setSelectedVisit(null);
        setSelectedPatient(null);
        await loadQueue();
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <i className="fas fa-users"></i> Doctor Queue
                </div>
                <div className="card-body text-center p-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

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
                        const queueItem = queueData.find(q => q.visit_id == visit?.id && q.department === 'doctor');
                        
                        let statusText = 'New';
                        let statusClass = 'status-waiting';
                        
                        if (consultation) {
                            if (queueItem?.status === 'pending') {
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
                                                    <i className="fas fa-key"></i> <code>{patient?.password || 'N/A'}</code> | 
                                                    <i className="fas fa-user"></i> {patient?.sex || 'N/A'}, {patient?.age || 'N/A'} yrs
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Vitals:</strong> BP: {visit?.bp || 'N/A'}, 
                                                    PR: {visit?.pulse || 'N/A'}, 
                                                    Temp: {visit?.temp || 'N/A'}°C
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
                                                    {(consultation.notes || consultation.diagnosis || '').substring(0, 100)}
                                                    {(consultation.notes || consultation.diagnosis || '').length > 100 ? '...' : ''}
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
                                                {queueItem?.status === 'pending' && (
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

            {/* Lab Results Modal */}
            {showLabResultsModal && labResultsData && (
                <div 
                    className="modal show d-block" 
                    tabIndex="-1" 
                    style={{ 
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowLabResultsModal(false);
                            setLabResultsData(null);
                        }
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div className="modal-content" style={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}>
                            <div className="modal-header border-0 pb-0" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px 12px 0 0',
                                padding: '20px 24px'
                            }}>
                                <h5 className="modal-title text-white mb-0">
                                    <i className="fas fa-flask me-2"></i>
                                    Laboratory Results
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => {
                                        setShowLabResultsModal(false);
                                        setLabResultsData(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                                {labResultsData.test_name && (
                                    <div className="mb-3">
                                        <strong>Test Name:</strong> {labResultsData.test_name}
                                    </div>
                                )}
                                {labResultsData.results && (
                                    <div>
                                        <strong className="mb-2 d-block">Results:</strong>
                                        {labResultsData.results.split('\n').map((line, index) => {
                                            if (!line.trim()) return null;
                                            
                                            const imageMatch = line.match(/^(.+?)\s*=\s*\[IMAGE:(.+)\]$/);
                                            if (imageMatch) {
                                                const testName = imageMatch[1].trim();
                                                const imageData = imageMatch[2];
                                                return (
                                                    <div key={index} className="mb-4">
                                                        <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '10px' }}>
                                                            {testName}:
                                                        </strong>
                                                        <img 
                                                            src={imageData} 
                                                            alt={`${testName} result`}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '400px',
                                                                borderRadius: '8px',
                                                                border: '2px solid #ddd',
                                                                objectFit: 'contain',
                                                                cursor: 'pointer',
                                                                display: 'block'
                                                            }}
                                                            onClick={() => {
                                                                const newWindow = window.open();
                                                                newWindow.document.write(`
                                                                    <html>
                                                                        <head><title>${testName} - Lab Result</title></head>
                                                                        <body style="margin:0;padding:20px;text-align:center;background:#f5f5f5;">
                                                                            <h2>${testName}</h2>
                                                                            <img src="${imageData}" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);" />
                                                                        </body>
                                                                    </html>
                                                                `);
                                                            }}
                                                        />
                                                        <small className="text-muted d-block mt-2">
                                                            <i className="fas fa-info-circle"></i> Click image to view full size
                                                        </small>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <p key={index} style={{ 
                                                        marginBottom: '10px',
                                                        color: '#2c3e50',
                                                        fontSize: '0.95rem',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        {line}
                                                    </p>
                                                );
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-0" style={{ padding: '0 24px 24px' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-primary px-4"
                                    onClick={() => {
                                        setShowLabResultsModal(false);
                                        setLabResultsData(null);
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 30px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorQueue;

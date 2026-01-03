import React, { useState, useEffect } from 'react';

function Consultation({ visitId, patientId, currentUser, db, onBack }) {
    const [patient, setPatient] = useState(null);
    const [visit, setVisit] = useState(null);
    const [consultation, setConsultation] = useState(null);
    const [labRequest, setLabRequest] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [formData, setFormData] = useState({
        chiefComplaint: '',
        history: '',
        physicalExam: '',
        diagnosis: '',
        plan: '',
        prescription: ''
    });
    const [selectedTests, setSelectedTests] = useState([]);
    const [otherTests, setOtherTests] = useState('');

    const labTests = [
        'CBC', 'Urinalysis', 'Pregnancy Test', 'Blood Glucose', 'HIV Test', 'Ultrasound',
        'FSH', 'LH', 'E2 (Estradiol)', 'PROLACTIN', 'TSH', 'T3', 'T4', 
        'BHCG (Pregnancy)', 'sCr (Creatinine)', 'BUN'
    ];

    useEffect(() => {
        const patientData = db.getById('patients', patientId);
        const visitData = db.getById('visits', visitId);
        const consultationData = db.getConsultationForVisit(visitId);
        const labRequestData = db.getAll('lab_requests').find(l => l.visit_id == visitId);
        const prescriptionData = db.getAll('prescriptions').find(p => p.visit_id == visitId);
        const labResults = labRequestData?.results || '';

        setPatient(patientData);
        setVisit(visitData);
        setConsultation(consultationData);
        setLabRequest(labRequestData);
        setPrescription(prescriptionData);

        if (consultationData) {
            setFormData({
                chiefComplaint: consultationData.chief_complaint || '',
                history: consultationData.history || '',
                physicalExam: consultationData.physical_exam || '',
                diagnosis: consultationData.diagnosis || '',
                plan: consultationData.plan || '',
                prescription: prescriptionData?.drugs || ''
            });
        }
    }, [visitId, patientId, db]);

    const handleTestChange = (test) => {
        setSelectedTests(prev => 
            prev.includes(test) 
                ? prev.filter(t => t !== test)
                : [...prev, test]
        );
    };

    const saveConsultation = (complete = false) => {
        if (!formData.chiefComplaint.trim()) {
            alert('Please enter chief complaint');
            return;
        }

        let consultationData = consultation;
        
        if (consultationData) {
            db.update('consultations', consultationData.id, {
                chief_complaint: formData.chiefComplaint,
                history: formData.history,
                physical_exam: formData.physicalExam,
                diagnosis: formData.diagnosis,
                plan: formData.plan
            });
        } else {
            consultationData = db.add('consultations', {
                visit_id: visitId,
                doctor_id: currentUser.id,
                chief_complaint: formData.chiefComplaint,
                history: formData.history,
                physical_exam: formData.physicalExam,
                diagnosis: formData.diagnosis,
                plan: formData.plan
            });
        }

        const allTests = [...selectedTests, ...(otherTests ? [otherTests] : [])];
        
        if (allTests.length > 0) {
            const existingLabRequest = db.getAll('lab_requests').find(l => l.visit_id == visitId);
            if (existingLabRequest) {
                db.update('lab_requests', existingLabRequest.id, {
                    tests: allTests.join(', '),
                    status: 'pending'
                });
            } else {
                db.add('lab_requests', {
                    visit_id: visitId,
                    tests: allTests.join(', '),
                    status: 'pending'
                });
            }
            
            const existingLabQueue = db.getAll('queue').find(q => q.visit_id == visitId && q.department === 'lab');
            if (!existingLabQueue) {
                db.add('queue', {
                    visit_id: visitId,
                    department: 'lab',
                    status: 'waiting'
                });
            }
            
            const doctorQueueItem = db.getAll('queue').find(q => q.visit_id == visitId && q.department === 'doctor');
            if (doctorQueueItem) {
                db.update('queue', doctorQueueItem.id, { status: 'waiting_results' });
            }
        }

        if (formData.prescription.trim()) {
            const existingPrescription = db.getAll('prescriptions').find(p => p.visit_id == visitId);
            if (existingPrescription) {
                db.update('prescriptions', existingPrescription.id, {
                    drugs: formData.prescription,
                    status: 'pending'
                });
            } else {
                db.add('prescriptions', {
                    visit_id: visitId,
                    drugs: formData.prescription,
                    status: 'pending'
                });
            }
            
            const existingPharmacyQueue = db.getAll('queue').find(q => q.visit_id == visitId && q.department === 'pharmacy');
            if (!existingPharmacyQueue) {
                db.add('queue', {
                    visit_id: visitId,
                    department: 'pharmacy',
                    status: 'waiting'
                });
            }
        }

        if (complete) {
            db.update('visits', visitId, { status: 'completed' });
            const queueItems = db.getAll('queue').filter(q => 
                q.visit_id == visitId && q.department === 'doctor'
            );
            queueItems.forEach(item => {
                db.update('queue', item.id, { status: 'completed' });
            });
            alert('Consultation completed! Patient removed from queue.');
        } else {
            alert('Consultation saved successfully! Patient will remain in queue awaiting results.');
        }
        
        onBack();
    };

    if (!patient || !visit) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-stethoscope"></i> Consultation for {patient.name}
            </div>
            <div className="card-body">
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h5>Patient Information</h5>
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Age/Sex:</strong> {patient.age} years, {patient.sex}</p>
                        <p><strong>Mobile:</strong> {patient.mobile}</p>
                    </div>
                    <div className="col-md-6">
                        <h5>Vital Signs</h5>
                        <p><strong>BP:</strong> {visit.bp || 'N/A'}</p>
                        <p><strong>PR:</strong> {visit.pr || 'N/A'} bpm</p>
                        <p><strong>Temperature:</strong> {visit.temperature || 'N/A'}°C</p>
                        <p><strong>Weight/BMI:</strong> {visit.weight || 'N/A'} kg / {visit.bmi || 'N/A'}</p>
                    </div>
                </div>
                
                {labRequest?.results && (
                    <div className="alert alert-info mb-4">
                        <h5><i className="fas fa-flask"></i> Laboratory Results</h5>
                        <p>{labRequest.results}</p>
                    </div>
                )}
                
                <form>
                    <div className="mb-3">
                        <label className="form-label">Chief Complaint *</label>
                        <textarea 
                            className="form-control" 
                            rows="2" 
                            value={formData.chiefComplaint}
                            onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">History of Present Illness</label>
                        <textarea 
                            className="form-control" 
                            rows="3"
                            value={formData.history}
                            onChange={(e) => setFormData({...formData, history: e.target.value})}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Physical Examination</label>
                        <textarea 
                            className="form-control" 
                            rows="3"
                            value={formData.physicalExam}
                            onChange={(e) => setFormData({...formData, physicalExam: e.target.value})}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Diagnosis</label>
                        <textarea 
                            className="form-control" 
                            rows="2"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Treatment Plan</label>
                        <textarea 
                            className="form-control" 
                            rows="2"
                            value={formData.plan}
                            onChange={(e) => setFormData({...formData, plan: e.target.value})}
                        />
                    </div>
                    
                    <div className="card mb-3">
                        <div className="card-header">Laboratory Requests</div>
                        <div className="card-body">
                            <div className="row">
                                {labTests.map(test => (
                                    <div key={test} className="col-md-4 mb-2">
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                value={test}
                                                checked={selectedTests.includes(test)}
                                                onChange={() => handleTestChange(test)}
                                            />
                                            <label className="form-check-label">{test}</label>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-md-12 mt-2">
                                    <label className="form-label">Other Tests</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={otherTests}
                                        onChange={(e) => setOtherTests(e.target.value)}
                                        placeholder="Specify other tests"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card mb-3">
                        <div className="card-header">Prescription</div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Prescribed Drugs</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3"
                                    value={formData.prescription}
                                    onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                                    placeholder="Enter prescribed drugs and dosage"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={() => saveConsultation(false)}>
                            <i className="fas fa-save"></i> Save & Wait for Results
                        </button>
                        <button type="button" className="btn btn-success" onClick={() => saveConsultation(true)}>
                            <i className="fas fa-check-circle"></i> Complete Consultation
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onBack}>
                            <i className="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Consultation;


import React, { useState, useEffect } from 'react';

function Consultation({ visitId, patientId, currentUser, db, onBack }) {
    const [patient, setPatient] = useState(null);
    const [visit, setVisit] = useState(null);
    const [consultation, setConsultation] = useState(null);
    const [labRequest, setLabRequest] = useState(null);
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
        const loadData = async () => {
            try {
                const [patientData, visitData, consultationData, allLabRequests, allPrescriptions] = await Promise.all([
                    db.getById('patients', patientId),
                    db.getById('visits', visitId),
                    db.getConsultationForVisit(visitId),
                    db.getAll('lab_requests'),
                    db.getAll('prescriptions')
                ]);
                
                const labRequestData = allLabRequests.find(l => l.visit_id === visitId);
                const prescriptionData = allPrescriptions.find(p => p.visit_id === visitId);
                const labResults = labRequestData?.results || '';

                setPatient(patientData);
                setVisit(visitData);
                setConsultation(consultationData);
                setLabRequest(labRequestData);

                if (consultationData) {
                    // Parse notes back into form fields (notes contains all the data)
                    const notes = consultationData.notes || '';
                    const chiefComplaintMatch = notes.match(/Chief Complaint:\s*(.+?)(?:\n|$)/);
                    const historyMatch = notes.match(/History:\s*(.+?)(?:\n|$)/);
                    const physicalExamMatch = notes.match(/Physical Exam:\s*(.+?)(?:\n|$)/);
                    const planMatch = notes.match(/Plan:\s*(.+?)(?:\n|$)/);
                    
                    setFormData({
                        chiefComplaint: chiefComplaintMatch ? chiefComplaintMatch[1].trim() : '',
                        history: historyMatch ? historyMatch[1].trim() : '',
                        physicalExam: physicalExamMatch ? physicalExamMatch[1].trim() : '',
                        diagnosis: consultationData.diagnosis || '',
                        plan: planMatch ? planMatch[1].trim() : '',
                        prescription: prescriptionData?.medication || ''
                    });
                }
            } catch (err) {
                console.error('Error loading consultation data:', err);
            }
        };
        
        loadData();
    }, [visitId, patientId, db]);

    const handleTestChange = (test) => {
        setSelectedTests(prev => 
            prev.includes(test) 
                ? prev.filter(t => t !== test)
                : [...prev, test]
        );
    };

    const saveConsultation = async (complete = false) => {
        if (!formData.chiefComplaint.trim()) {
            alert('Please enter chief complaint');
            return;
        }

        try {
            let consultationData = consultation;
            
            // Map form data to database columns (table only has diagnosis and notes)
            const consultationNotes = [
                formData.chiefComplaint && `Chief Complaint: ${formData.chiefComplaint}`,
                formData.history && `History: ${formData.history}`,
                formData.physicalExam && `Physical Exam: ${formData.physicalExam}`,
                formData.plan && `Plan: ${formData.plan}`
            ].filter(Boolean).join('\n\n');
            
            if (consultationData) {
                console.log('Updating existing consultation:', consultationData.id);
                const updateResult = await db.update('consultations', consultationData.id, {
                    diagnosis: formData.diagnosis || consultationData.diagnosis || '',
                    notes: consultationNotes || consultationData.notes || ''
                });
                console.log('Update result:', updateResult);
            } else {
                console.log('Creating new consultation for visit:', visitId);
                consultationData = await db.add('consultations', {
                    visit_id: visitId,
                    doctor_id: currentUser.id,
                    diagnosis: formData.diagnosis || '',
                    notes: consultationNotes
                });
                console.log('New consultation created:', consultationData);
            }

            const allTests = [...selectedTests, ...(otherTests ? [otherTests] : [])];
            
            if (allTests.length > 0) {
                console.log('Lab tests selected:', allTests);
                const [allLabRequests, allQueue] = await Promise.all([
                    db.getAll('lab_requests'),
                    db.getAll('queue')
                ]);
                
                const existingLabRequest = allLabRequests.find(l => l.visit_id === visitId);
                const testName = allTests.join(', ');
                
                if (existingLabRequest) {
                    console.log('Updating existing lab request:', existingLabRequest.id);
                    await db.update('lab_requests', existingLabRequest.id, {
                        test_name: testName,
                        status: 'pending'
                    });
                } else {
                    console.log('Creating new lab request for visit:', visitId);
                    const newLabRequest = await db.add('lab_requests', {
                        visit_id: visitId,
                        test_name: testName,
                        status: 'pending'
                    });
                    console.log('Lab request created:', newLabRequest);
                }
                
                const existingLabQueue = allQueue.find(q => q.visit_id == visitId && q.department === 'lab');
                if (!existingLabQueue) {
                    console.log('Adding patient to lab queue');
                    const queueResult = await db.add('queue', {
                        visit_id: visitId,
                        department: 'lab',
                        status: 'pending'
                    });
                    console.log('Lab queue item created:', queueResult);
                } else {
                    console.log('Lab queue item already exists');
                }
                
                const doctorQueueItem = allQueue.find(q => q.visit_id == visitId && q.department === 'doctor');
                if (doctorQueueItem) {
                    console.log('Updating doctor queue status - waiting for lab results');
                    await db.update('queue', doctorQueueItem.id, { status: 'pending' });
                }
            }

            if (formData.prescription.trim()) {
                const [allPrescriptions, allQueue] = await Promise.all([
                    db.getAll('prescriptions'),
                    db.getAll('queue')
                ]);
                
                const existingPrescription = allPrescriptions.find(p => p.visit_id === visitId);
                if (existingPrescription) {
                    console.log('Updating existing prescription:', existingPrescription.id);
                    await db.update('prescriptions', existingPrescription.id, {
                        medication: formData.prescription,
                        status: 'pending'
                    });
                } else {
                    console.log('Creating new prescription for visit:', visitId);
                    const newPrescription = await db.add('prescriptions', {
                        visit_id: visitId,
                        medication: formData.prescription,
                        status: 'pending'
                    });
                    console.log('Prescription created:', newPrescription);
                }
                
                const existingPharmacyQueue = allQueue.find(q => q.visit_id == visitId && q.department === 'pharmacy');
                if (!existingPharmacyQueue) {
                    console.log('Adding patient to pharmacy queue');
                    const queueResult = await db.add('queue', {
                        visit_id: visitId,
                        department: 'pharmacy',
                        status: 'pending'
                    });
                    console.log('Pharmacy queue item created:', queueResult);
                } else {
                    console.log('Pharmacy queue item already exists');
                }
            }

            if (complete) {
                await db.update('visits', visitId, { status: 'completed' });
                const allQueue = await db.getAll('queue');
                const queueItems = allQueue.filter(q => 
                    q.visit_id === visitId && q.department === 'doctor'
                );
                for (const item of queueItems) {
                    await db.update('queue', item.id, { status: 'completed' });
                }
                alert('Consultation completed! Patient removed from queue.');
            } else {
                alert('Consultation saved successfully! Patient will remain in queue awaiting results.');
            }
            
            onBack();
        } catch (err) {
            console.error('Error saving consultation:', err);
            alert('Error saving consultation. Please try again.');
        }
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
                        <div>
                            {labRequest.results.split('\n').map((line, index) => {
                                if (!line.trim()) return null;
                                
                                // Check if line contains image
                                const imageMatch = line.match(/^(.+?)\s*=\s*\[IMAGE:(.+)\]$/);
                                if (imageMatch) {
                                    const testName = imageMatch[1].trim();
                                    const imageData = imageMatch[2];
                                    return (
                                        <div key={index} className="mb-3">
                                            <strong>{testName}:</strong>
                                            <div className="mt-2">
                                                <img 
                                                    src={imageData} 
                                                    alt={`${testName} result`}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '400px',
                                                        borderRadius: '8px',
                                                        border: '2px solid #ddd',
                                                        objectFit: 'contain',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        // Open image in new window for full view
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
                                                <small className="text-muted d-block mt-1">
                                                    <i className="fas fa-info-circle"></i> Click image to view full size
                                                </small>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // Regular text result
                                    return (
                                        <p key={index} style={{ marginBottom: '8px' }}>
                                            {line}
                                        </p>
                                    );
                                }
                            })}
                        </div>
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


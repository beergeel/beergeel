import React, { useState } from 'react';
import Consultation from './Consultation';

function Consultations({ currentUser, db, setActiveView }) {
    const [consultations, setConsultations] = useState(db.getAll('consultations'));
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const viewConsultationDetails = (consultationId) => {
        const consultation = db.getById('consultations', consultationId);
        const visit = db.getById('visits', consultation.visit_id);
        const patient = db.getById('patients', visit.patient_id);
        const labRequest = db.getAll('lab_requests').find(l => l.visit_id == visit.id);
        const prescription = db.getAll('prescriptions').find(p => p.visit_id == visit.id);
        
        let details = `Consultation Details:\n\nPatient: ${patient.name}\nDate: ${new Date(consultation.created_date).toLocaleDateString()}\nChief Complaint: ${consultation.chief_complaint}\nDiagnosis: ${consultation.diagnosis || 'N/A'}\nTreatment Plan: ${consultation.plan || 'N/A'}`;
        
        if (labRequest) {
            details += `\n\nLab Tests: ${labRequest.tests}`;
            if (labRequest.results) {
                details += `\nLab Results: ${labRequest.results}`;
            }
        }
        
        if (prescription) {
            details += `\n\nPrescription: ${prescription.drugs}`;
        }
        
        alert(details);
    };

    const editConsultation = (visitId, patientId) => {
        setSelectedVisit(visitId);
        setSelectedPatient(patientId);
    };

    const handleBack = () => {
        setSelectedVisit(null);
        setSelectedPatient(null);
        setConsultations(db.getAll('consultations'));
    };

    if (selectedVisit && selectedPatient) {
        return (
            <Consultation 
                visitId={selectedVisit}
                patientId={selectedPatient}
                currentUser={currentUser}
                db={db}
                onBack={handleBack}
            />
        );
    }

    const visits = db.getAll('visits');
    const patients = db.getAll('patients');

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-clipboard"></i> All Consultations
                <span className="badge bg-primary ms-2">{consultations.length} Total</span>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Chief Complaint</th>
                                <th>Diagnosis</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultations.map(consultation => {
                                const visit = visits.find(v => v.id == consultation.visit_id);
                                const patient = patients.find(p => p.id == visit?.patient_id);
                                const queueItem = db.getAll('queue').find(q => q.visit_id == consultation.visit_id && q.department === 'doctor');
                                const status = queueItem?.status === 'completed' ? 'Completed' : 
                                             queueItem?.status === 'waiting_results' ? 'Awaiting Results' : 'In Progress';
                                
                                return (
                                    <tr key={consultation.id}>
                                        <td>{patient?.name || 'Unknown'}</td>
                                        <td>{new Date(consultation.created_date).toLocaleDateString()}</td>
                                        <td>
                                            {consultation.chief_complaint.substring(0, 50)}
                                            {consultation.chief_complaint.length > 50 ? '...' : ''}
                                        </td>
                                        <td>
                                            {consultation.diagnosis?.substring(0, 30) || 'Not specified'}
                                            {consultation.diagnosis && consultation.diagnosis.length > 30 ? '...' : ''}
                                        </td>
                                        <td>
                                            <span className={`badge ${status === 'Completed' ? 'bg-success' : status === 'Awaiting Results' ? 'bg-warning' : 'bg-info'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-info" 
                                                onClick={() => viewConsultationDetails(consultation.id)}
                                            >
                                                <i className="fas fa-eye"></i> View
                                            </button>
                                            {status !== 'Completed' && (
                                                <button 
                                                    className="btn btn-sm btn-warning ms-2" 
                                                    onClick={() => editConsultation(consultation.visit_id, patient.id)}
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
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

export default Consultations;


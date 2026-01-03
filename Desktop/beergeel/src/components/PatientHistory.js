import React, { useState } from 'react';

function PatientHistory({ currentUser, db, setActiveView }) {
    const [visits] = useState(db.getPatientVisits(currentUser.id));

    const printSingleVisitReport = (visitId) => {
        const visit = db.getById('visits', visitId);
        const patient = currentUser;
        const consultation = db.getAll('consultations').find(c => c.visit_id == visitId);
        const labRequest = db.getAll('lab_requests').find(l => l.visit_id == visitId);
        const prescription = db.getAll('prescriptions').find(p => p.visit_id == visitId);

        const reportContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Medical Report - ${patient.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { color: #2c3e50; margin: 0; }
                    .section { margin-bottom: 30px; }
                    .section h2 { color: #3498db; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .footer { margin-top: 50px; text-align: center; font-size: 0.9em; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Beergeel Obstetrics and Gynecology Clinic</h1>
                    <p>Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</p>
                    <p>Contact: 0634026635 (Mobile/WhatsApp)</p>
                </div>
                
                <div class="section">
                    <h2>Patient Information</h2>
                    <table>
                        <tr><th>Name:</th><td>${patient.name}</td></tr>
                        <tr><th>Age/Sex:</th><td>${patient.age} years / ${patient.sex}</td></tr>
                        <tr><th>Mobile:</th><td>${patient.mobile}</td></tr>
                        <tr><th>Visit Date:</th><td>${new Date(visit.created_date).toLocaleDateString()}</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Vital Signs</h2>
                    <table>
                        <tr>
                            <th>Blood Pressure</th>
                            <th>Pulse Rate</th>
                            <th>Temperature</th>
                            <th>Weight</th>
                            <th>BMI</th>
                            <th>SPO₂</th>
                        </tr>
                        <tr>
                            <td>${visit.bp || 'N/A'}</td>
                            <td>${visit.pr || 'N/A'}</td>
                            <td>${visit.temperature || 'N/A'}°C</td>
                            <td>${visit.weight || 'N/A'} kg</td>
                            <td>${visit.bmi || 'N/A'}</td>
                            <td>${visit.spo || 'N/A'}%</td>
                        </tr>
                    </table>
                </div>
                
                ${consultation ? `
                <div class="section">
                    <h2>Consultation</h2>
                    <table>
                        <tr><th>Chief Complaint:</th><td>${consultation.chief_complaint}</td></tr>
                        <tr><th>History:</th><td>${consultation.history || 'N/A'}</td></tr>
                        <tr><th>Physical Examination:</th><td>${consultation.physical_exam || 'N/A'}</td></tr>
                        <tr><th>Diagnosis:</th><td>${consultation.diagnosis || 'N/A'}</td></tr>
                        <tr><th>Treatment Plan:</th><td>${consultation.plan || 'N/A'}</td></tr>
                    </table>
                </div>
                ` : ''}
                
                ${labRequest ? `
                <div class="section">
                    <h2>Laboratory Tests</h2>
                    <p><strong>Requested Tests:</strong> ${labRequest.tests}</p>
                    ${labRequest.results ? `<p><strong>Results:</strong> ${labRequest.results}</p>` : ''}
                </div>
                ` : ''}
                
                ${prescription ? `
                <div class="section">
                    <h2>Prescription</h2>
                    <p>${prescription.drugs}</p>
                </div>
                ` : ''}
                
                <div class="footer">
                    <p>This report was generated on ${new Date().toLocaleDateString()}</p>
                    <p>Beergeel Obstetrics and Gynecology Clinic - Your Health is Our Priority</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(reportContent);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-history"></i> Visit History for {currentUser.name}
                <span className="badge bg-primary ms-2">{visits.length} Visits</span>
            </div>
            <div className="card-body">
                {visits.length === 0 ? (
                    <p className="text-muted">No visit history found.</p>
                ) : (
                    visits.map(visit => {
                        const consultation = db.getAll('consultations').find(c => c.visit_id == visit.id);
                        const labRequest = db.getAll('lab_requests').find(l => l.visit_id == visit.id);
                        const prescription = db.getAll('prescriptions').find(p => p.visit_id == visit.id);
                        
                        return (
                            <div key={visit.id} className="patient-queue">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>Visit on {new Date(visit.created_date).toLocaleDateString()}</h5>
                                        <p><strong>Vitals:</strong> BP: {visit.bp || 'N/A'}, PR: {visit.pr || 'N/A'}, Temp: {visit.temperature || 'N/A'}°C</p>
                                        {consultation && <p><strong>Diagnosis:</strong> {consultation.diagnosis || 'N/A'}</p>}
                                        {labRequest && <p><strong>Lab Tests:</strong> {labRequest.tests}</p>}
                                        {prescription && <p><strong>Prescription:</strong> {prescription.drugs}</p>}
                                    </div>
                                    <div>
                                        <button 
                                            className="btn btn-sm btn-primary" 
                                            onClick={() => printSingleVisitReport(visit.id)}
                                        >
                                            <i className="fas fa-print"></i> Print Report
                                        </button>
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

export default PatientHistory;


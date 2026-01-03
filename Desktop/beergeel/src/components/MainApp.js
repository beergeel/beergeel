import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import RegisterPatient from './RegisterPatient';
import CreateVisit from './CreateVisit';
import PatientList from './PatientList';
import Financial from './Financial';
import AccountManagement from './AccountManagement';
import NoticeBoard from './NoticeBoard';
import Reports from './Reports';
import DoctorQueue from './DoctorQueue';
import Consultations from './Consultations';
import FinancialView from './FinancialView';
import PharmacyQueue from './PharmacyQueue';
import Prescriptions from './Prescriptions';
import LabQueue from './LabQueue';
import LabTests from './LabTests';
import PatientHistory from './PatientHistory';

function MainApp({ currentUser, currentRole, onLogout, db }) {
    const [activeView, setActiveView] = useState('dashboard');

    const printPatientReport = () => {
        const patient = currentUser;
        const visits = db.getPatientVisits(patient.id);
        
        if (visits.length === 0) {
            alert('No visit history found');
            return;
        }

        const latestVisit = visits[visits.length - 1];
        const consultation = db.getAll('consultations').find(c => c.visit_id == latestVisit.id);
        const labRequest = db.getAll('lab_requests').find(l => l.visit_id == latestVisit.id);
        const prescription = db.getAll('prescriptions').find(p => p.visit_id == latestVisit.id);

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
                        <tr><th>Visit Date:</th><td>${new Date(latestVisit.created_date).toLocaleDateString()}</td></tr>
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
                            <td>${latestVisit.bp || 'N/A'}</td>
                            <td>${latestVisit.pr || 'N/A'}</td>
                            <td>${latestVisit.temperature || 'N/A'}°C</td>
                            <td>${latestVisit.weight || 'N/A'} kg</td>
                            <td>${latestVisit.bmi || 'N/A'}</td>
                            <td>${latestVisit.spo || 'N/A'}%</td>
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

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard currentUser={currentUser} currentRole={currentRole} db={db} setActiveView={setActiveView} />;
            case 'registerPatient':
                return <RegisterPatient currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'createVisit':
                return <CreateVisit currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'patientList':
                return <PatientList currentUser={currentUser} currentRole={currentRole} db={db} setActiveView={setActiveView} />;
            case 'financial':
                return <Financial currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'accountManagement':
                return <AccountManagement currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'noticeBoard':
                return <NoticeBoard currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'reports':
                return <Reports currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'doctorQueue':
                return <DoctorQueue currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'consultations':
                return <Consultations currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'financialView':
                return <FinancialView currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'pharmacyQueue':
                return <PharmacyQueue currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'prescriptions':
                return <Prescriptions currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'labQueue':
                return <LabQueue currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'labTests':
                return <LabTests currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'patientHistory':
                return <PatientHistory currentUser={currentUser} db={db} setActiveView={setActiveView} />;
            case 'printReport':
                printPatientReport();
                setActiveView('dashboard');
                return null;
            default:
                return <Dashboard currentUser={currentUser} currentRole={currentRole} db={db} setActiveView={setActiveView} />;
        }
    };

    return (
        <div id="mainApp">
            <Navbar currentUser={currentUser} onLogout={onLogout} db={db} />
            <div className="d-flex">
                <Sidebar currentRole={currentRole} activeView={activeView} setActiveView={setActiveView} />
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default MainApp;


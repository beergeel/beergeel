import React, { useState, useEffect } from 'react';

function Dashboard({ currentUser, currentRole, db, setActiveView }) {
    const [notice, setNotice] = useState('');

    useEffect(() => {
        const notices = db.getAll('notices');
        if (notices.length > 0) {
            setNotice(notices[0].content);
        } else {
            setNotice('No notice available. Click Edit to add one.');
        }
    }, [db]);

    const editNotice = () => {
        setActiveView('noticeBoard');
    };

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

    const renderDashboard = () => {
        const todayVisits = db.getTodayVisits().length;
        const totalPatients = db.getAll('patients').length;
        const today = new Date().toDateString();
        const todayPayments = db.getAll('payments').filter(p => 
            new Date(p.created_date).toDateString() === today
        ).reduce((sum, p) => sum + (p.amount || 0), 0);

        switch(currentRole) {
            case 'reception':
                return (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-hospital"></i> Clinic Information
                                    </div>
                                    <div className="card-body">
                                        <h5>Beergeel Obstetrics and Gynecology Clinic</h5>
                                        <p className="mb-1"><i className="fas fa-map-marker-alt"></i> Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</p>
                                        <p className="mb-0"><i className="fas fa-phone"></i> Contact: 0634026635 (Mobile/WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="card stat-card">
                                    <i className="fas fa-users fa-2x text-primary"></i>
                                    <div className="stat-number">{todayVisits}</div>
                                    <div className="stat-label">Today's Visits</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card stat-card">
                                    <i className="fas fa-user-injured fa-2x text-success"></i>
                                    <div className="stat-number">{totalPatients}</div>
                                    <div className="stat-label">Total Patients</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card stat-card">
                                    <i className="fas fa-money-bill-wave fa-2x text-warning"></i>
                                    <div className="stat-number">${todayPayments.toFixed(2)}</div>
                                    <div className="stat-label">Today's Income</div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-bell"></i> Notice Board
                                    </div>
                                    <div className="card-body notice-board">
                                        <div className="notice-header">
                                            <span>Clinic Notice</span>
                                            <button className="btn btn-sm btn-primary" onClick={editNotice}>
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                        </div>
                                        <div>{notice}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-list"></i> Quick Actions
                                    </div>
                                    <div className="card-body">
                                        <button className="btn btn-primary mb-2 w-100" onClick={() => setActiveView('registerPatient')}>
                                            <i className="fas fa-user-plus"></i> Register New Patient
                                        </button>
                                        <button className="btn btn-success mb-2 w-100" onClick={() => setActiveView('createVisit')}>
                                            <i className="fas fa-stethoscope"></i> Create New Visit
                                        </button>
                                        <button className="btn btn-warning mb-2 w-100" onClick={() => setActiveView('financial')}>
                                            <i className="fas fa-money-bill"></i> Record Payment
                                        </button>
                                        <button className="btn btn-info mb-2 w-100" onClick={() => setActiveView('patientList')}>
                                            <i className="fas fa-list"></i> View Patient List
                                        </button>
                                        <button className="btn btn-dark mb-2 w-100" onClick={() => setActiveView('accountManagement')}>
                                            <i className="fas fa-users-cog"></i> Account Management
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'doctor':
                const queueCount = db.getQueueForDepartment('doctor').length;
                return (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-hospital"></i> Clinic Information
                                    </div>
                                    <div className="card-body">
                                        <h5>Beergeel Obstetrics and Gynecology Clinic</h5>
                                        <p className="mb-1"><i className="fas fa-map-marker-alt"></i> Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</p>
                                        <p className="mb-0"><i className="fas fa-phone"></i> Contact: 0634026635 (Mobile/WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-user-md"></i> Doctor Dashboard
                                    </div>
                                    <div className="card-body">
                                        <h4>Welcome Dr. {currentUser.name?.split(' ')[1] || currentUser.name}</h4>
                                        <p>You have <span className="badge bg-danger">{queueCount}</span> patients waiting for consultation.</p>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-primary" onClick={() => setActiveView('doctorQueue')}>
                                                <i className="fas fa-users"></i> View Patient Queue
                                            </button>
                                            <button className="btn btn-success" onClick={() => setActiveView('patientList')}>
                                                <i className="fas fa-list"></i> View Patient List
                                            </button>
                                            <button className="btn btn-warning" onClick={() => setActiveView('financialView')}>
                                                <i className="fas fa-money-bill"></i> View Financial
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'pharmacy':
                const pharmacyQueue = db.getQueueForDepartment('pharmacy').length;
                return (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-hospital"></i> Clinic Information
                                    </div>
                                    <div className="card-body">
                                        <h5>Beergeel Obstetrics and Gynecology Clinic</h5>
                                        <p className="mb-1"><i className="fas fa-map-marker-alt"></i> Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</p>
                                        <p className="mb-0"><i className="fas fa-phone"></i> Contact: 0634026635 (Mobile/WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-pills"></i> Pharmacy Dashboard
                                    </div>
                                    <div className="card-body">
                                        <h4>Welcome {currentUser.name}</h4>
                                        <p>You have <span className="badge bg-danger">{pharmacyQueue}</span> prescriptions waiting.</p>
                                        <button className="btn btn-primary" onClick={() => setActiveView('pharmacyQueue')}>
                                            <i className="fas fa-users"></i> View Pharmacy Queue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'lab':
                const labQueue = db.getQueueForDepartment('lab').length;
                return (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-hospital"></i> Clinic Information
                                    </div>
                                    <div className="card-body">
                                        <h5>Beergeel Obstetrics and Gynecology Clinic</h5>
                                        <p className="mb-1"><i className="fas fa-map-marker-alt"></i> Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</p>
                                        <p className="mb-0"><i className="fas fa-phone"></i> Contact: 0634026635 (Mobile/WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-flask"></i> Laboratory Dashboard
                                    </div>
                                    <div className="card-body">
                                        <h4>Welcome {currentUser.name}</h4>
                                        <p>You have <span className="badge bg-danger">{labQueue}</span> lab tests pending.</p>
                                        <button className="btn btn-primary" onClick={() => setActiveView('labQueue')}>
                                            <i className="fas fa-users"></i> View Lab Queue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'patient':
                const patientVisits = db.getPatientVisits(currentUser.id);
                const lastVisit = patientVisits[patientVisits.length - 1];
                const prescriptionsCount = db.getAll('prescriptions').filter(p => {
                    const visit = db.getById('visits', p.visit_id);
                    return visit && visit.patient_id == currentUser.id;
                }).length;
                const labTestsCount = db.getAll('lab_requests').filter(l => {
                    const visit = db.getById('visits', l.visit_id);
                    return visit && visit.patient_id == currentUser.id;
                }).length;
                
                return (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-hospital"></i> Clinic Information
                                    </div>
                                    <div className="card-body">
                                        <h5>Beergeel Obstetrics and Gynecology Clinic</h5>
                                        <p className="mb-1"><i className="fas fa-map-marker-alt"></i> Xero awr kasoo horjeedka Ayuub Restaurant inyar ka xiga dhanka Masjid Nuur</p>
                                        <p className="mb-0"><i className="fas fa-phone"></i> Contact: 0634026635 (Mobile/WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fas fa-user"></i> Patient Dashboard
                                    </div>
                                    <div className="card-body">
                                        <h4>Welcome {currentUser.name}</h4>
                                        <div className="row mt-4">
                                            <div className="col-md-4">
                                                <div className="card stat-card">
                                                    <i className="fas fa-calendar-check fa-2x text-primary"></i>
                                                    <div className="stat-number">{patientVisits.length}</div>
                                                    <div className="stat-label">Total Visits</div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card stat-card">
                                                    <i className="fas fa-file-medical fa-2x text-success"></i>
                                                    <div className="stat-number">{prescriptionsCount}</div>
                                                    <div className="stat-label">Prescriptions</div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card stat-card">
                                                    <i className="fas fa-flask fa-2x text-warning"></i>
                                                    <div className="stat-number">{labTestsCount}</div>
                                                    <div className="stat-label">Lab Tests</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {lastVisit ? (
                                            <div className="alert alert-info mt-4">
                                                <h5>Last Visit Summary</h5>
                                                <p><strong>Date:</strong> {new Date(lastVisit.created_date).toLocaleDateString()}</p>
                                                <p><strong>Vitals:</strong> BP: {lastVisit.bp || 'N/A'}, PR: {lastVisit.pr || 'N/A'}, Temp: {lastVisit.temperature || 'N/A'}°C</p>
                                            </div>
                                        ) : (
                                            <div className="alert alert-warning mt-4">No previous visits found.</div>
                                        )}
                                        
                                        <button className="btn btn-primary" onClick={printPatientReport}>
                                            <i className="fas fa-file-pdf"></i> Download Medical Report
                                        </button>
                                        <button className="btn btn-success ms-2" onClick={() => setActiveView('patientHistory')}>
                                            <i className="fas fa-history"></i> View Visit History
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return <div>{renderDashboard()}</div>;
}

export default Dashboard;


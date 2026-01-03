import React from 'react';

function Reports({ currentUser, db, setActiveView }) {
    const today = new Date().toDateString();
    
    const todayVisits = db.getTodayVisits().length;
    const totalPatients = db.getAll('patients').length;
    const todayPayments = db.getAll('payments').filter(p => 
        new Date(p.created_date).toDateString() === today
    ).reduce((sum, p) => sum + (p.amount || 0), 0);
    const todayExpenses = db.getAll('expenses').filter(e => 
        new Date(e.created_date).toDateString() === today
    ).reduce((sum, e) => sum + (e.amount || 0), 0);

    const exportTodayReport = () => {
        alert('Report export functionality would be implemented here. In a real system, this would generate an Excel/PDF file.');
    };

    const exportPatientList = () => {
        alert('Patient list export functionality would be implemented here.');
    };

    const exportFinancialReport = () => {
        alert('Financial report export functionality would be implemented here.');
    };

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-chart-bar"></i> Clinic Reports
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <i className="fas fa-calendar-day"></i> Today's Summary
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>Visits Today</td>
                                            <td className="text-end"><strong>{todayVisits}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Total Income</td>
                                            <td className="text-end text-success"><strong>${todayPayments.toFixed(2)}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Total Expenses</td>
                                            <td className="text-end text-danger"><strong>${todayExpenses.toFixed(2)}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Net Income</td>
                                            <td className={`text-end ${(todayPayments - todayExpenses) >= 0 ? 'text-success' : 'text-danger'}`}>
                                                <strong>${(todayPayments - todayExpenses).toFixed(2)}</strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <i className="fas fa-database"></i> Overall Statistics
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>Total Patients</td>
                                            <td className="text-end"><strong>{totalPatients}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Total Visits</td>
                                            <td className="text-end"><strong>{db.getAll('visits').length}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Total Consultations</td>
                                            <td className="text-end"><strong>{db.getAll('consultations').length}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Total Prescriptions</td>
                                            <td className="text-end"><strong>{db.getAll('prescriptions').length}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4">
                    <h5>Export Reports</h5>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" onClick={exportTodayReport}>
                            <i className="fas fa-file-excel"></i> Export Today's Report
                        </button>
                        <button className="btn btn-success" onClick={exportPatientList}>
                            <i className="fas fa-file-csv"></i> Export Patient List
                        </button>
                        <button className="btn btn-warning" onClick={exportFinancialReport}>
                            <i className="fas fa-file-invoice-dollar"></i> Export Financial Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;


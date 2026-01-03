import React from 'react';

function FinancialView({ currentUser, db, setActiveView }) {
    const today = new Date().toDateString();
    
    const todayPayments = db.getAll('payments').filter(p => 
        new Date(p.created_date).toDateString() === today
    ).reduce((sum, p) => sum + (p.amount || 0), 0);
    const todayExpenses = db.getAll('expenses').filter(e => 
        new Date(e.created_date).toDateString() === today
    ).reduce((sum, e) => sum + (e.amount || 0), 0);

    const payments = db.getAll('payments');
    const expenses = db.getAll('expenses');
    const patients = db.getAll('patients');
    
    const transactions = [
        ...payments.map(p => ({
            ...p, 
            type: 'Payment',
            patient_name: patients.find(pat => pat.id == p.patient_id)?.name || 'Unknown'
        })),
        ...expenses.map(e => ({
            ...e, 
            type: 'Expense',
            patient_name: 'N/A'
        }))
    ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 10);

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-money-bill-wave"></i> Financial Overview
            </div>
            <div className="card-body">
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <i className="fas fa-calendar-day"></i> Today's Financial Summary
                            </div>
                            <div className="card-body">
                                <div className="text-center mb-4">
                                    <h3>${todayPayments.toFixed(2)}</h3>
                                    <p className="text-muted">Today's Income</p>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Total Payments:</span>
                                    <span className="text-success">${todayPayments.toFixed(2)}</span>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Total Expenses:</span>
                                    <span className="text-danger">${todayExpenses.toFixed(2)}</span>
                                </div>
                                
                                <hr />
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <strong>Net Income:</strong>
                                    <strong className={(todayPayments - todayExpenses) >= 0 ? 'text-success' : 'text-danger'}>
                                        ${(todayPayments - todayExpenses).toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <i className="fas fa-list"></i> Recent Transactions
                            </div>
                            <div className="card-body">
                                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((t, idx) => (
                                                <tr key={idx} className={t.type === 'Payment' ? 'table-success' : 'table-danger'}>
                                                    <td>{new Date(t.created_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                                    <td>{t.type}</td>
                                                    <td>${t.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="alert alert-info">
                    <i className="fas fa-info-circle"></i> 
                    Doctor's view only shows financial summaries. For detailed management, please contact reception.
                </div>
            </div>
        </div>
    );
}

export default FinancialView;


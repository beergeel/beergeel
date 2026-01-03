import React, { useState, useEffect } from 'react';

function CreateVisit({ currentUser, db, setActiveView }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({
        bp: '',
        pr: '',
        temperature: '',
        weight: '',
        height: '',
        bmi: '',
        spo: '',
        addToDoctorQueue: true
    });
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const selectedPatientId = sessionStorage.getItem('selectedPatientId');
        if (selectedPatientId) {
            const patient = db.getById('patients', parseInt(selectedPatientId));
            if (patient) {
                setSelectedPatient(patient);
                sessionStorage.removeItem('selectedPatientId');
            }
        }
        searchPatients();
    }, []);

    useEffect(() => {
        searchPatients();
    }, [searchTerm]);

    const searchPatients = () => {
        const patients = db.getAll('patients');
        const filtered = patients.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.mobile.includes(searchTerm)
        ).slice(0, 10);
        setSearchResults(filtered);
    };

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setSearchTerm('');
    };

    const calculateBMI = () => {
        const weight = parseFloat(formData.weight);
        const height = parseFloat(formData.height);
        
        if (weight && height && height > 0) {
            const heightM = height / 100;
            const bmi = weight / (heightM * heightM);
            setFormData({ ...formData, bmi: bmi.toFixed(2) });
        } else {
            setFormData({ ...formData, bmi: '' });
        }
    };

    useEffect(() => {
        calculateBMI();
    }, [formData.weight, formData.height]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = () => {
        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }

        const visit = db.add('visits', {
            patient_id: selectedPatient.id,
            bp: formData.bp,
            pr: formData.pr,
            temperature: formData.temperature,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            bmi: formData.bmi ? parseFloat(formData.bmi) : null,
            spo: formData.spo,
            status: 'in_progress',
            created_by: currentUser.id
        });

        if (formData.addToDoctorQueue) {
            db.add('queue', {
                visit_id: visit.id,
                department: 'doctor',
                status: 'waiting'
            });
            alert('Visit created and patient added to doctor queue!');
        } else {
            alert('Visit created successfully!');
        }

        setActiveView('dashboard');
    };

    const handleSaveAndAddPayment = () => {
        handleSave();
        setActiveView('financial');
    };

    return (
        <div className="row">
            <div className="col-md-4">
                <div className="card">
                    <div className="card-header">
                        <i className="fas fa-search"></i> Search Patient
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or mobile"
                            />
                        </div>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {searchResults.length === 0 ? (
                                <p className="text-muted">No patients found</p>
                            ) : (
                                searchResults.map(patient => (
                                    <div 
                                        key={patient.id}
                                        className="patient-queue" 
                                        onClick={() => selectPatient(patient)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{patient.name}</h6>
                                                <p className="mb-0 text-muted">
                                                    <i className="fas fa-phone"></i> {patient.mobile} | 
                                                    <i className="fas fa-user"></i> {patient.sex}, {patient.age} yrs
                                                </p>
                                            </div>
                                            <button className="btn btn-sm btn-primary">
                                                <i className="fas fa-plus"></i> Visit
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">
                        <i className="fas fa-stethoscope"></i> Create Visit
                    </div>
                    <div className="card-body">
                        {selectedPatient ? (
                            <>
                                <h5>Creating Visit for: {selectedPatient.name}</h5>
                                <form>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Blood Pressure</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="bp"
                                                    value={formData.bp}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 120/80"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Pulse Rate</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    name="pr"
                                                    value={formData.pr}
                                                    onChange={handleChange}
                                                    placeholder="bpm"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Temperature (°C)</label>
                                                <input 
                                                    type="number" 
                                                    step="0.1" 
                                                    className="form-control" 
                                                    name="temperature"
                                                    value={formData.temperature}
                                                    onChange={handleChange}
                                                    placeholder="36.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Weight (kg)</label>
                                                <input 
                                                    type="number" 
                                                    step="0.1" 
                                                    className="form-control" 
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleChange}
                                                    placeholder="kg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">SPO₂</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    name="spo"
                                                    value={formData.spo}
                                                    onChange={handleChange}
                                                    placeholder="%" 
                                                    min="0" 
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Height (cm) - Optional</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={handleChange}
                                                    placeholder="cm"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">BMI</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={formData.bmi}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                name="addToDoctorQueue"
                                                checked={formData.addToDoctorQueue}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="addToDoctorQueue">
                                                Add to Doctor Queue
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex gap-2">
                                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                                            <i className="fas fa-save"></i> Save Visit
                                        </button>
                                        <button type="button" className="btn btn-success" onClick={handleSaveAndAddPayment}>
                                            <i className="fas fa-money-bill"></i> Save & Add Payment
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setActiveView('createVisit')}>
                                            <i className="fas fa-times"></i> Cancel
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <p className="text-muted">Select a patient to create visit</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateVisit;


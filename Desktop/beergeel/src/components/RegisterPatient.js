import React, { useState } from 'react';

function RegisterPatient({ currentUser, db, setActiveView }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: '',
        mobile: '',
        password: '1234'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, age, sex, mobile, password } = formData;

        if (!name || !age || !sex || !mobile) {
            alert('Please fill all required fields');
            return;
        }

        if (db.findPatientByMobile(mobile)) {
            alert('Patient with this mobile number already exists');
            return;
        }

        const patient = db.add('patients', {
            name,
            age: parseInt(age),
            sex,
            mobile,
            password,
            registered_by: currentUser.id
        });

        alert(`Patient registered successfully!\n\nPatient ID: ${mobile}\nPassword: ${password}\n\nPlease provide this information to the patient.`);
        setActiveView('dashboard');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-user-plus"></i> Register New Patient
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Full Name *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Age *</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required 
                                    min="0" 
                                    max="150"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label className="form-label">Sex *</label>
                                <select 
                                    className="form-select" 
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Mobile Number *</label>
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required 
                                    placeholder="7-10 digits"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Password (Default: 1234)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="alert alert-info">
                        <i className="fas fa-info-circle"></i> 
                        Patient ID will be their mobile number. They can login with mobile and password.
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save"></i> Register Patient
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setActiveView('dashboard')}>
                        <i className="fas fa-times"></i> Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPatient;


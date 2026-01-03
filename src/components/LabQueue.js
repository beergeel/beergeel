import React, { useState, useEffect } from 'react';

function LabQueue({ currentUser, db, setActiveView }) {
    const [queue, setQueue] = useState([]);
    const [completedToday, setCompletedToday] = useState(0);
    const [labRequests, setLabRequests] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [currentLabRequest, setCurrentLabRequest] = useState(null);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [testResults, setTestResults] = useState({});
    const [testImages, setTestImages] = useState({});
    const [imagePreviews, setImagePreviews] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([
            loadQueue(),
            updateStats(),
            loadLabRequests()
        ]);
    };

    const loadQueue = async () => {
        try {
            const queueData = await db.getQueueForDepartment('lab');
            setQueue(queueData);
        } catch (err) {
            console.error('Error loading queue:', err);
        }
    };

    const loadLabRequests = async () => {
        try {
            const requests = await db.getAll('lab_requests');
            setLabRequests(requests);
        } catch (err) {
            console.error('Error loading lab requests:', err);
        }
    };

    const updateStats = async () => {
        try {
            const today = new Date().toDateString();
            const allLabRequests = await db.getAll('lab_requests');
            const completed = allLabRequests.filter(l => {
                if (l.status === 'completed' && l.completed_date) {
                    return new Date(l.completed_date).toDateString() === today;
                }
                return false;
            }).length;
            setCompletedToday(completed);
        } catch (err) {
            console.error('Error updating stats:', err);
        }
    };

    const recordLabResults = async (visitId) => {
        try {
            const [allLabRequests, visit] = await Promise.all([
                db.getAll('lab_requests'),
                db.getById('visits', visitId)
            ]);
            
            const labRequest = allLabRequests.find(l => l.visit_id == visitId);
            const patient = visit ? await db.getById('patients', visit.patient_id) : null;
            
            if (!labRequest) {
                setErrorMessage('No lab request found for this visit');
                setIsSuccessMessage(false);
                setShowErrorModal(true);
                return;
            }
            
            // Parse tests from test_name (comma-separated)
            const tests = labRequest.test_name 
                ? labRequest.test_name.split(',').map(t => t.trim()).filter(t => t)
                : [];
            
            // Initialize test results
            const initialResults = {};
            const initialImages = {};
            const initialPreviews = {};
            tests.forEach(test => {
                initialResults[test] = '';
                initialImages[test] = null;
                initialPreviews[test] = null;
            });
            
            setCurrentLabRequest(labRequest);
            setCurrentPatient(patient);
            setTestResults(initialResults);
            setTestImages(initialImages);
            setImagePreviews(initialPreviews);
            setShowResultsModal(true);
        } catch (err) {
            console.error('Error opening results modal:', err);
            setErrorMessage('Error opening results form. Please try again.');
            setIsSuccessMessage(false);
            setShowErrorModal(true);
        }
    };

    const handleSaveResults = async () => {
        try {
            if (!currentLabRequest) return;
            
            // Format results as "test1 = result1\n test2 = result2" or "test1 = [IMAGE]"
            const tests = Object.keys(testResults);
            const formattedResults = tests
                .map(test => {
                    const result = testResults[test].trim();
                    const image = testImages[test];
                    
                    if (requiresImageUpload(test) && image) {
                        // For image tests, store as "test = [IMAGE:base64data]"
                        return `${test} = [IMAGE:${image}]`;
                    } else if (!requiresImageUpload(test) && result) {
                        // For text tests, store as "test = result"
                        return `${test} = ${result}`;
                    } else if (requiresImageUpload(test) && !image && !result) {
                        // Image test without image or text
                        return null;
                    } else if (!requiresImageUpload(test) && !result) {
                        // Text test without result
                        return null;
                    }
                    return null;
                })
                .filter(line => line !== null)
                .join('\n');
            
            if (!formattedResults.trim()) {
                setErrorMessage('Please enter at least one test result or upload an image');
                setIsSuccessMessage(false);
                setShowErrorModal(true);
                return;
            }
            
            await db.update('lab_requests', currentLabRequest.id, { 
                results: formattedResults,
                status: 'completed',
                completed_date: new Date().toISOString()
            });
            
            const allQueue = await db.getAll('queue');
            const queueItems = allQueue.filter(q => 
                q.visit_id == currentLabRequest.visit_id && q.department === 'lab'
            );
            
            await Promise.all(
                queueItems.map(item => db.update('queue', item.id, { status: 'completed' }))
            );
            
            setShowResultsModal(false);
            setCurrentLabRequest(null);
            setCurrentPatient(null);
            setTestResults({});
            setTestImages({});
            setImagePreviews({});
            await loadData();
            
            // Show success message
            setErrorMessage('Lab results recorded successfully!');
            setIsSuccessMessage(true);
            setShowErrorModal(true);
        } catch (err) {
            console.error('Error recording lab results:', err);
            setErrorMessage('Error recording lab results. Please try again.');
            setIsSuccessMessage(false);
            setShowErrorModal(true);
        }
    };

    const handleCancelResults = () => {
        setShowResultsModal(false);
        setCurrentLabRequest(null);
        setCurrentPatient(null);
        setTestResults({});
        setTestImages({});
        setImagePreviews({});
    };

    // Check if a test requires image upload
    const requiresImageUpload = (testName) => {
        const testLower = testName.toLowerCase();
        return testLower.includes('urinalysis') || testLower.includes('cbc') || testLower.includes('urine');
    };

    // Handle image upload for a specific test
    const handleImageUpload = (test, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select a valid image file');
            setIsSuccessMessage(false);
            setShowErrorModal(true);
            e.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Image size should be less than 5MB');
            setIsSuccessMessage(false);
            setShowErrorModal(true);
            e.target.value = '';
            return;
        }

        // Read file as base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64DataUrl = event.target.result;
            setTestImages({
                ...testImages,
                [test]: base64DataUrl
            });
            setImagePreviews({
                ...imagePreviews,
                [test]: base64DataUrl
            });
        };
        reader.onerror = () => {
            setErrorMessage('Error reading image file. Please try again.');
            setIsSuccessMessage(false);
            setShowErrorModal(true);
            e.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    // Remove image for a specific test
    const handleRemoveImage = (test) => {
        setTestImages({
            ...testImages,
            [test]: null
        });
        setImagePreviews({
            ...imagePreviews,
            [test]: null
        });
    };

    return (
        <div className="row g-4">
            <div className="col-lg-7">
                <div className="card lab-queue-card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="header-icon-wrapper">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div>
                                    <h5 className="mb-0">Laboratory Queue</h5>
                                    <small className="text-white-50">Manage lab test results</small>
                                </div>
                            </div>
                            <span className="queue-badge-large">
                                <i className="fas fa-clock me-1"></i>
                                {queue.length} Waiting
                            </span>
                        </div>
                    </div>
                    <div className="card-body">
                        {queue.length === 0 ? (
                            <div className="empty-queue-state">
                                <div className="empty-queue-icon">
                                    <i className="fas fa-flask"></i>
                                </div>
                                <h4 className="mt-4 mb-2">No Lab Tests in Queue</h4>
                                <p className="text-muted mb-4">All lab tests have been processed</p>
                                <div className="empty-queue-features">
                                    <div className="feature-badge">
                                        <i className="fas fa-check-circle"></i>
                                        <span>All caught up!</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="lab-test-queue-list">
                                {queue.map(item => {
                                    const patient = item.patient;
                                    const visit = item.visit;
                                    const labRequest = labRequests.find(l => l.visit_id == visit.id);
                                    
                                    return (
                                        <div key={visit.id} className="lab-test-item">
                                            <div className="lab-test-item-header">
                                                <div className="patient-info-section">
                                                    <div className="patient-avatar-lab">
                                                        <i className={`fas ${patient?.sex === 'Female' ? 'fa-venus' : 'fa-mars'}`}></i>
                                                    </div>
                                                    <div className="patient-details-lab">
                                                        <h5 className="patient-name-lab">{patient?.name || 'Unknown Patient'}</h5>
                                                        <div className="patient-meta-lab">
                                                            <span className="meta-item">
                                                                <i className="fas fa-phone"></i>
                                                                {patient?.mobile || 'N/A'}
                                                            </span>
                                                            <span className="meta-divider">•</span>
                                                            <span className="meta-item">
                                                                <i className="fas fa-key"></i>
                                                                <code>{patient?.password || 'N/A'}</code>
                                                            </span>
                                                            <span className="meta-divider">•</span>
                                                            <span className="meta-item">
                                                                <i className="fas fa-user"></i>
                                                                {patient?.sex || 'N/A'}, {patient?.age || 'N/A'} yrs
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="lab-test-action">
                                                    <button 
                                                        className="btn btn-primary btn-record-results" 
                                                        onClick={() => recordLabResults(visit.id)}
                                                    >
                                                        <i className="fas fa-flask me-2"></i>
                                                        Record Results
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="lab-test-content">
                                                <div className="lab-test-label">
                                                    <i className="fas fa-vial me-2"></i>
                                                    Tests Requested:
                                                </div>
                                                <div className="lab-test-text">
                                                    {labRequest?.test_name || 'No tests specified'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="col-lg-5">
                <div className="card lab-stats-card">
                    <div className="card-header">
                        <div className="d-flex align-items-center gap-3">
                            <div className="header-icon-wrapper">
                                <i className="fas fa-chart-bar"></i>
                            </div>
                            <div>
                                <h5 className="mb-0">Lab Statistics</h5>
                                <small className="text-white-50">Today's overview</small>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="stat-card-enhanced">
                            <div className="stat-icon-wrapper pending-lab">
                                <i className="fas fa-flask"></i>
                            </div>
                            <div className="stat-content">
                                <div className="stat-number-enhanced">{queue.length}</div>
                                <div className="stat-label-enhanced">Pending Tests</div>
                            </div>
                        </div>
                        
                        <div className="stat-divider"></div>
                        
                        <div className="stat-card-enhanced">
                            <div className="stat-icon-wrapper completed-lab">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-content">
                                <div className="stat-number-enhanced">{completedToday}</div>
                                <div className="stat-label-enhanced">Completed Today</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Entry Modal */}
            {showResultsModal && currentLabRequest && currentPatient && (
                <div 
                    className="modal show d-block" 
                    tabIndex="-1" 
                    style={{ 
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCancelResults();
                        }
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div className="modal-content" style={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}>
                            <div className="modal-header border-0 pb-0" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px 12px 0 0',
                                padding: '20px 24px'
                            }}>
                                <h5 className="modal-title text-white mb-0">
                                    <i className="fas fa-flask me-2"></i>
                                    Enter Lab Results
                                </h5>
                            </div>
                            <div className="modal-body" style={{ padding: '24px' }}>
                                <div className="mb-4">
                                    <p className="mb-2" style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                                        Enter lab results for <strong>{currentPatient.name}</strong>:
                                    </p>
                                    <div className="p-3 bg-light rounded" style={{ fontSize: '14px', color: '#666' }}>
                                        <strong>Tests:</strong> {currentLabRequest.test_name || 'N/A'}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: '#333', marginBottom: '16px' }}>
                                        Enter results:
                                    </label>
                                    {Object.keys(testResults).length > 0 ? (
                                        Object.keys(testResults).map((test, index) => {
                                            const needsImage = requiresImageUpload(test);
                                            const hasImage = imagePreviews[test];
                                            
                                            return (
                                                <div key={index} className="mb-4">
                                                    <label className="form-label mb-2" style={{ color: '#555', fontWeight: '500' }}>
                                                        {test}:
                                                    </label>
                                                    
                                                    {needsImage ? (
                                                        <div>
                                                            {hasImage ? (
                                                                <div className="mb-3">
                                                                    <div className="position-relative" style={{ maxWidth: '100%', marginBottom: '10px' }}>
                                                                        <img 
                                                                            src={hasImage} 
                                                                            alt={`${test} result`}
                                                                            style={{
                                                                                maxWidth: '100%',
                                                                                maxHeight: '300px',
                                                                                borderRadius: '8px',
                                                                                border: '2px solid #ddd',
                                                                                objectFit: 'contain'
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-danger position-absolute"
                                                                            onClick={() => handleRemoveImage(test)}
                                                                            style={{
                                                                                top: '10px',
                                                                                right: '10px',
                                                                                borderRadius: '50%',
                                                                                width: '30px',
                                                                                height: '30px',
                                                                                padding: '0',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-times"></i>
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-primary btn-sm"
                                                                        onClick={() => document.getElementById(`image-input-${index}`).click()}
                                                                    >
                                                                        <i className="fas fa-camera me-2"></i>
                                                                        Change Image
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <input
                                                                        type="file"
                                                                        id={`image-input-${index}`}
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageUpload(test, e)}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                    <label
                                                                        htmlFor={`image-input-${index}`}
                                                                        className="btn btn-outline-primary w-100"
                                                                        style={{
                                                                            borderRadius: '8px',
                                                                            padding: '40px 20px',
                                                                            border: '2px dashed #667eea',
                                                                            cursor: 'pointer',
                                                                            textAlign: 'center',
                                                                            display: 'block'
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-camera fa-2x mb-2" style={{ color: '#667eea' }}></i>
                                                                        <div style={{ color: '#667eea', fontWeight: '500' }}>
                                                                            Click to upload image
                                                                        </div>
                                                                        <small className="text-muted d-block mt-2">
                                                                            Take a photo or select an image file
                                                                        </small>
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={`Enter result for ${test}`}
                                                            value={testResults[test]}
                                                            onChange={(e) => {
                                                                setTestResults({
                                                                    ...testResults,
                                                                    [test]: e.target.value
                                                                });
                                                            }}
                                                            style={{
                                                                borderRadius: '8px',
                                                                border: '1px solid #ddd',
                                                                padding: '10px 15px'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                placeholder="Enter lab results..."
                                                value={testResults['general'] || ''}
                                                onChange={(e) => {
                                                    setTestResults({ 'general': e.target.value });
                                                }}
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                    padding: '10px 15px'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer border-0" style={{ padding: '0 24px 24px' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary px-4"
                                    onClick={handleCancelResults}
                                    style={{
                                        borderRadius: '8px',
                                        padding: '10px 20px',
                                        fontWeight: '500',
                                        border: 'none'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary px-4"
                                    onClick={handleSaveResults}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 30px',
                                        fontWeight: '500'
                                    }}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div 
                    className="modal show d-block" 
                    tabIndex="-1" 
                    style={{ 
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowErrorModal(false);
                        }
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div className="modal-content" style={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                        }}>
                            <div className="modal-header border-0 pb-0" style={{
                                background: isSuccessMessage 
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px 12px 0 0',
                                padding: '20px 24px'
                            }}>
                                <h5 className="modal-title text-white mb-0">
                                    <i className={`fas ${isSuccessMessage ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                    {isSuccessMessage ? 'Success' : 'Alert'}
                                </h5>
                            </div>
                            <div className="modal-body text-center py-4" style={{ padding: '24px' }}>
                                <div className="mb-3">
                                    <i className={`fas ${isSuccessMessage ? 'fa-check-circle' : 'fa-info-circle'}`} style={{ 
                                        fontSize: '48px', 
                                        color: isSuccessMessage ? '#10b981' : '#667eea' 
                                    }}></i>
                                </div>
                                <p className="mb-0" style={{ fontSize: '16px', color: '#333' }}>
                                    {errorMessage}
                                </p>
                            </div>
                            <div className="modal-footer border-0 justify-content-center pt-0" style={{ padding: '0 24px 24px' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-primary px-5"
                                    onClick={() => {
                                        setShowErrorModal(false);
                                        setIsSuccessMessage(false);
                                    }}
                                    style={{
                                        background: isSuccessMessage
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 30px',
                                        fontWeight: '500'
                                    }}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LabQueue;

import React, { useState, useEffect } from 'react';

function NoticeBoard({ currentUser, db, setActiveView }) {
    const [noticeContent, setNoticeContent] = useState('');

    useEffect(() => {
        const notices = db.getAll('notices');
        if (notices.length > 0) {
            setNoticeContent(notices[0].content);
        }
    }, [db]);

    const handleSave = () => {
        if (!noticeContent.trim()) {
            alert('Please enter notice content');
            return;
        }
        
        const notices = db.getAll('notices');
        
        if (notices.length > 0) {
            const success = db.update('notices', notices[0].id, {
                content: noticeContent.trim(),
                updated_by: currentUser.name || currentUser.username
            });
            
            if (success) {
                alert('Notice updated successfully!');
            } else {
                alert('Failed to update notice');
            }
        } else {
            db.add('notices', {
                content: noticeContent.trim(),
                updated_by: currentUser.name || currentUser.username
            });
            alert('Notice created successfully!');
        }
        
        setActiveView('dashboard');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete the notice? This cannot be undone.')) {
            const notices = db.getAll('notices');
            if (notices.length > 0) {
                db.delete('notices', notices[0].id);
                alert('Notice deleted successfully!');
                setNoticeContent('');
                setActiveView('dashboard');
            }
        }
    };

    const notices = db.getAll('notices');
    const hasNotice = notices.length > 0;

    return (
        <div className="card">
            <div className="card-header">
                <i className="fas fa-bell"></i> Notice Board Management
            </div>
            <div className="card-body">
                <div className="alert alert-info">
                    <i className="fas fa-info-circle"></i> 
                    This notice will appear on the home page and reception dashboard.
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Notice Content *</label>
                    <textarea 
                        className="form-control" 
                        rows="6" 
                        placeholder="Enter notice content..." 
                        value={noticeContent}
                        onChange={(e) => setNoticeContent(e.target.value)}
                        required
                    />
                </div>
                
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className="fas fa-save"></i> Save Notice
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveView('dashboard')}>
                        <i className="fas fa-times"></i> Cancel
                    </button>
                    {hasNotice && (
                        <button className="btn btn-danger" onClick={handleDelete}>
                            <i className="fas fa-trash"></i> Delete Notice
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoticeBoard;


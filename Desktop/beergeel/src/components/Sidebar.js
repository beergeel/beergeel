import React from 'react';

function Sidebar({ currentRole, activeView, setActiveView }) {
    const getMenuItems = () => {
        switch(currentRole) {
            case 'reception':
                return [
                    { icon: 'fa-home', text: 'Dashboard', view: 'dashboard' },
                    { icon: 'fa-user-plus', text: 'Register Patient', view: 'registerPatient' },
                    { icon: 'fa-stethoscope', text: 'Create Visit', view: 'createVisit' },
                    { icon: 'fa-list', text: 'Patient List', view: 'patientList' },
                    { icon: 'fa-money-bill', text: 'Financial', view: 'financial' },
                    { icon: 'fa-users-cog', text: 'Account Management', view: 'accountManagement' },
                    { icon: 'fa-bell', text: 'Notice Board', view: 'noticeBoard' },
                    { icon: 'fa-chart-bar', text: 'Reports', view: 'reports' }
                ];
            case 'doctor':
                return [
                    { icon: 'fa-home', text: 'Dashboard', view: 'dashboard' },
                    { icon: 'fa-users', text: 'Patient Queue', view: 'doctorQueue' },
                    { icon: 'fa-list', text: 'Patient List', view: 'patientList' },
                    { icon: 'fa-clipboard', text: 'Consultations', view: 'consultations' },
                    { icon: 'fa-money-bill', text: 'Financial View', view: 'financialView' }
                ];
            case 'pharmacy':
                return [
                    { icon: 'fa-home', text: 'Dashboard', view: 'dashboard' },
                    { icon: 'fa-users', text: 'Pharmacy Queue', view: 'pharmacyQueue' },
                    { icon: 'fa-prescription', text: 'Prescriptions', view: 'prescriptions' }
                ];
            case 'lab':
                return [
                    { icon: 'fa-home', text: 'Dashboard', view: 'dashboard' },
                    { icon: 'fa-users', text: 'Lab Queue', view: 'labQueue' },
                    { icon: 'fa-flask', text: 'Lab Tests', view: 'labTests' }
                ];
            case 'patient':
                return [
                    { icon: 'fa-home', text: 'Dashboard', view: 'dashboard' },
                    { icon: 'fa-history', text: 'Visit History', view: 'patientHistory' },
                    { icon: 'fa-file-pdf', text: 'Print Report', view: 'printReport' }
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <div className="sidebar">
            <nav className="nav flex-column">
                {menuItems.map((item, index) => (
                    <a 
                        key={index}
                        className={`nav-link ${activeView === item.view ? 'active' : ''}`}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveView(item.view);
                        }}
                    >
                        <i className={`fas ${item.icon}`}></i> {item.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;


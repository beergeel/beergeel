# Beergeel Obstetrics and Gynecology Clinic System

A comprehensive clinic management system built with React.js, converted from the original HTML/JavaScript version while maintaining the exact same design.

## Features

- **Multi-role System**: Supports Patient, Reception, Doctor, Pharmacy, and Laboratory roles
- **Patient Management**: Register, search, and manage patient records
- **Visit Management**: Create visits with vital signs tracking
- **Consultation System**: Doctor consultations with lab requests and prescriptions
- **Queue Management**: Separate queues for Doctor, Pharmacy, and Laboratory
- **Financial Management**: Track payments and expenses
- **Reports**: Generate reports and statistics
- **Account Management**: Manage user accounts and passwords
- **Notice Board**: Display clinic notices on home page

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Default Login Credentials

### Staff Accounts:
- **Reception**: ID: `4026635`, Password: `1234`
- **Doctor**: ID: `4696972`, Password: `1234`
- **Pharmacy**: ID: `4730530`, Password: `1234`
- **Laboratory**: ID: `8144099`, Password: `1234`

### Patient Accounts:
- Sample patients are created with mobile numbers as IDs and default password `1234`

## Technology Stack

- React 18.2.0
- Bootstrap 5.1.3
- Font Awesome 6.0.0
- LocalStorage for data persistence

## Project Structure

```
src/
├── components/
│   ├── HomePage.js          # Login page
│   ├── MainApp.js           # Main application container
│   ├── Navbar.js            # Navigation bar
│   ├── Sidebar.js           # Sidebar menu
│   ├── Dashboard.js         # Dashboard for each role
│   ├── RegisterPatient.js   # Patient registration
│   ├── CreateVisit.js       # Create new visit
│   ├── PatientList.js       # Patient list and search
│   ├── Financial.js         # Financial management
│   ├── AccountManagement.js # Account management
│   ├── NoticeBoard.js       # Notice board management
│   ├── Reports.js           # Reports and statistics
│   ├── DoctorQueue.js       # Doctor queue
│   ├── Consultations.js     # Consultation management
│   ├── FinancialView.js     # Financial view for doctors
│   ├── PharmacyQueue.js    # Pharmacy queue
│   ├── Prescriptions.js    # Prescription management
│   ├── LabQueue.js         # Laboratory queue
│   ├── LabTests.js         # Lab test management
│   └── PatientHistory.js   # Patient visit history
├── utils/
│   └── clinicDB.js          # Database utility (localStorage)
├── App.js                    # Main app component
├── index.js                  # Entry point
└── index.css                 # Global styles
```

## Data Storage

All data is stored in the browser's localStorage. This means:
- Data persists between sessions
- Data is specific to each browser/device
- To reset data, clear browser localStorage

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Notes

- The design and styling have been preserved exactly as in the original HTML version
- All functionality from the original system has been converted to React components
- The system uses localStorage for data persistence (no backend required)
- Default sample data is created on first load


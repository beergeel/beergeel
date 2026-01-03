// Database simulation using localStorage
class ClinicDB {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        const tables = [
            'patients', 'visits', 'users', 'consultations', 
            'lab_requests', 'prescriptions', 'payments', 
            'expenses', 'notices', 'appointments', 'messages', 'queue'
        ];

        tables.forEach(table => {
            if (!localStorage.getItem(table)) {
                localStorage.setItem(table, JSON.stringify([]));
            }
        });

        if (JSON.parse(localStorage.getItem('users')).length === 0) {
            this.setupDefaultUsers();
        }
        
        if (JSON.parse(localStorage.getItem('notices')).length === 0) {
            this.setupDefaultNotice();
        }
    }

    setupDefaultUsers() {
        const users = [
            { 
                id: 1, 
                username: '4026635', 
                password: '1234', 
                role: 'reception',
                name: 'Reception Staff',
                mobile: '4026635'
            },
            { 
                id: 2, 
                username: '4696972', 
                password: '1234', 
                role: 'doctor',
                name: 'Dr. Ahmed',
                mobile: '4696972'
            },
            { 
                id: 3, 
                username: '4730530', 
                password: '1234', 
                role: 'pharmacy',
                name: 'Pharmacy Staff',
                mobile: '4730530'
            },
            { 
                id: 4, 
                username: '8144099', 
                password: '1234', 
                role: 'lab',
                name: 'Lab Technician',
                mobile: '8144099'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
        
        // Add some sample patients
        if (JSON.parse(localStorage.getItem('patients')).length === 0) {
            const patients = [
                {
                    id: 1,
                    name: "Ali Hassan",
                    age: 35,
                    sex: "Male",
                    mobile: "1234567",
                    password: "1234",
                    registered_by: 1,
                    created_date: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Fatima Ahmed",
                    age: 28,
                    sex: "Female",
                    mobile: "2345678",
                    password: "1234",
                    registered_by: 1,
                    created_date: new Date().toISOString()
                }
            ];
            localStorage.setItem('patients', JSON.stringify(patients));
        }
        
        // Add some sample notice
        if (JSON.parse(localStorage.getItem('notices')).length === 0) {
            const notice = {
                id: 1,
                content: 'Welcome to Beergeel Obstetrics and Gynecology Clinic. Clinic hours: 8:00 AM - 10:00 PM. Emergency services available 24/7.',
                updated_by: 'System',
                updated_date: new Date().toISOString()
            };
            localStorage.setItem('notices', JSON.stringify([notice]));
        }
    }

    setupDefaultNotice() {
        const notice = {
            id: 1,
            content: 'Welcome to Beergeel Obstetrics and Gynecology Clinic. Please update this notice with important information.',
            updated_by: 'System',
            updated_date: new Date().toISOString()
        };
        localStorage.setItem('notices', JSON.stringify([notice]));
    }

    getAll(table) {
        return JSON.parse(localStorage.getItem(table) || '[]');
    }

    getById(table, id) {
        const items = this.getAll(table);
        return items.find(item => item.id == id);
    }

    add(table, data) {
        const items = this.getAll(table);
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        const newItem = { id: newId, ...data, created_date: new Date().toISOString() };
        items.push(newItem);
        localStorage.setItem(table, JSON.stringify(items));
        return newItem;
    }

    update(table, id, data) {
        const items = this.getAll(table);
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = { ...items[index], ...data, updated_date: new Date().toISOString() };
            localStorage.setItem(table, JSON.stringify(items));
            return true;
        }
        return false;
    }

    delete(table, id) {
        const items = this.getAll(table);
        const filtered = items.filter(item => item.id != id);
        localStorage.setItem(table, JSON.stringify(filtered));
        return items.length !== filtered.length;
    }

    findPatientByMobile(mobile) {
        const patients = this.getAll('patients');
        return patients.find(p => p.mobile === mobile);
    }

    getTodayVisits() {
        const visits = this.getAll('visits');
        const today = new Date().toDateString();
        return visits.filter(v => new Date(v.created_date).toDateString() === today);
    }

    getPatientVisits(patientId) {
        const visits = this.getAll('visits');
        return visits.filter(v => v.patient_id == patientId);
    }

    getQueueForDepartment(dept) {
        const queue = this.getAll('queue');
        const visits = this.getAll('visits');
        const patients = this.getAll('patients');
        
        return queue.filter(q => q.department === dept && q.status !== 'completed').map(q => {
            const visit = visits.find(v => v.id == q.visit_id);
            const patient = patients.find(p => p.id == visit?.patient_id);
            const consultation = this.getAll('consultations').find(c => c.visit_id == visit?.id);
            return {
                ...q,
                visit: visit,
                patient: patient,
                consultation: consultation
            };
        });
    }

    searchPatients(searchTerm) {
        const patients = this.getAll('patients');
        if (!searchTerm) return patients.slice(0, 50);
        
        return patients.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.mobile.includes(searchTerm)
        );
    }

    getUserByUsername(username) {
        const users = this.getAll('users');
        return users.find(u => u.username === username);
    }

    getConsultationForVisit(visitId) {
        const consultations = this.getAll('consultations');
        return consultations.find(c => c.visit_id == visitId);
    }
}

export default ClinicDB;


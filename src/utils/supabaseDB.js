// Supabase database class - replaces localStorage ClinicDB
import { supabase } from '../config/supabase';

class SupabaseDB {
    // No constructor needed - Supabase handles initialization

    // Generic methods that work with any table
    async getAll(table) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order('id', { ascending: true });
            
            if (error) {
                // If table doesn't exist, error code is PGRST116
                if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
                    console.warn(`Table "${table}" does not exist in Supabase. Please create it first.`);
                    return [];
                }
                console.error(`Error fetching ${table}:`, error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error(`Error in getAll(${table}):`, err);
            return [];
        }
    }

    async getById(table, id) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('id', id)
                .maybeSingle(); // Use maybeSingle instead of single to avoid error when no rows found
            
            if (error) {
                // Only log if it's not a "no rows" error
                if (error.code !== 'PGRST116') {
                    console.error(`Error fetching ${table} by id:`, error);
                }
                return null;
            }
            return data;
        } catch (err) {
            console.error(`Error in getById(${table}, ${id}):`, err);
            return null;
        }
    }

    async add(table, data) {
        try {
            // Ensure created_date is set correctly
            const now = new Date();
            const recordData = {
                ...data,
                created_date: now.toISOString(),
                updated_date: now.toISOString()
            };
            
            console.log(`Adding to ${table}:`, recordData);
            
            const { data: result, error } = await supabase
                .from(table)
                .insert([recordData])
                .select()
                .single();
            
            if (error) {
                console.error(`❌ Error adding to ${table}:`, error);
                console.error('📋 Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                    fullError: JSON.stringify(error, null, 2)
                });
                
                // Show user-friendly error
                alert(`Database Error: ${error.message || 'Failed to add item'}\n\nDetails: ${error.details || error.hint || 'Unknown error'}\n\nPlease check the console for more information.`);
                return null;
            }
            
            console.log(`Successfully added to ${table}:`, result);
            return result;
        } catch (err) {
            console.error(`Error in add(${table}):`, err);
            return null;
        }
    }

    async update(table, id, data) {
        try {
            const { error } = await supabase
                .from(table)
                .update({
                    ...data,
                    updated_date: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                console.error(`Error updating ${table}:`, error);
                return false;
            }
            return true;
        } catch (err) {
            console.error(`Error in update(${table}, ${id}):`, err);
            return false;
        }
    }

    async delete(table, id) {
        try {
            console.log(`Deleting from ${table} with id:`, id);
            
            const { data, error } = await supabase
                .from(table)
                .delete()
                .eq('id', id)
                .select();
            
            if (error) {
                console.error(`❌ Error deleting from ${table}:`, error);
                console.error('📋 Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                    fullError: JSON.stringify(error, null, 2)
                });
                
                // Throw error with details so component can handle it
                throw new Error(error.message || `Failed to delete from ${table}`);
            }
            
            console.log(`✅ Successfully deleted from ${table}:`, data);
            return true;
        } catch (err) {
            console.error(`Error in delete(${table}, ${id}):`, err);
            throw err; // Re-throw so component can catch and display error
        }
    }

    // Specific methods for clinic operations
    async findPatientByMobile(mobile) {
        if (!mobile) return null;
        
        try {
            const normalizeMobile = (num) => {
                if (!num) return '';
                return num.toString().trim().replace(/^0+/, '');
            };
            
            const searchMobile = normalizeMobile(mobile);
            
            const { data, error } = await supabase
                .from('patients')
                .select('*');
            
            if (error) {
                console.error('Error finding patient:', error);
                return null;
            }
            
            // Try exact match first
            let patient = data.find(p => {
                const patientMobile = normalizeMobile(p.mobile);
                return patientMobile === searchMobile;
            });
            
            // If not found, try partial match
            if (!patient) {
                patient = data.find(p => {
                    const patientMobile = normalizeMobile(p.mobile);
                    return patientMobile.includes(searchMobile) || searchMobile.includes(patientMobile);
                });
            }
            
            return patient || null;
        } catch (err) {
            console.error('Error in findPatientByMobile:', err);
            return null;
        }
    }

    async getTodayVisits() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('visits')
                .select('*')
                .gte('created_date', `${today}T00:00:00`)
                .lte('created_date', `${today}T23:59:59`);
            
            if (error) {
                console.error('Error fetching today visits:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in getTodayVisits:', err);
            return [];
        }
    }

    async getPatientVisits(patientId) {
        try {
            const { data, error } = await supabase
                .from('visits')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_date', { ascending: false });
            
            if (error) {
                console.error('Error fetching patient visits:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in getPatientVisits:', err);
            return [];
        }
    }

    async getQueueForDepartment(dept) {
        try {
            const { data: queueData, error: queueError } = await supabase
                .from('queue')
                .select('*')
                .eq('department', dept)
                .neq('status', 'completed');
            
            if (queueError) {
                console.error('Error fetching queue:', queueError);
                return [];
            }
            
            if (!queueData || queueData.length === 0) {
                return [];
            }
            
            // Fetch related data - handle missing records gracefully
            const result = await Promise.all(
                queueData.map(async (q) => {
                    try {
                        const visit = await this.getById('visits', q.visit_id);
                        const patient = visit ? await this.getById('patients', visit.patient_id) : null;
                        
                        // Use getConsultationForVisit which handles missing consultations properly
                        const consultation = visit ? await this.getConsultationForVisit(visit.id) : null;
                        
                        return {
                            ...q,
                            visit: visit,
                            patient: patient,
                            consultation: consultation
                        };
                    } catch (err) {
                        console.error(`Error processing queue item ${q.id}:`, err);
                        // Return queue item without related data rather than failing completely
                        return {
                            ...q,
                            visit: null,
                            patient: null,
                            consultation: null
                        };
                    }
                })
            );
            
            return result;
        } catch (err) {
            console.error('Error in getQueueForDepartment:', err);
            return [];
        }
    }

    async searchPatients(searchTerm) {
        try {
            if (!searchTerm) {
                const { data, error } = await supabase
                    .from('patients')
                    .select('*')
                    .limit(50)
                    .order('id', { ascending: true });
                
                if (error) {
                    console.error('Error fetching patients:', error);
                    return [];
                }
                return data || [];
            }
            
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,mobile.ilike.%${searchTerm}%`)
                .limit(50);
            
            if (error) {
                console.error('Error searching patients:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in searchPatients:', err);
            return [];
        }
    }

    async getUserByUsername(username) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .maybeSingle(); // Use maybeSingle to avoid error if user doesn't exist
            
            if (error) {
                console.error('Error fetching user:', error);
                return null;
            }
            return data;
        } catch (err) {
            console.error('Error in getUserByUsername:', err);
            return null;
        }
    }

    async getConsultationForVisit(visitId) {
        try {
            const { data, error } = await supabase
                .from('consultations')
                .select('*')
                .eq('visit_id', visitId)
                .maybeSingle(); // Use maybeSingle instead of single to avoid error if no result
            
            if (error) {
                console.error('Error fetching consultation:', error);
                return null;
            }
            return data;
        } catch (err) {
            console.error('Error in getConsultationForVisit:', err);
            return null;
        }
    }

    // Patient Ticket Methods
    async createTicket(ticketData) {
        try {
            console.log('Creating ticket with data:', ticketData);
            
            const { data: result, error } = await supabase
                .from('patient_tickets')
                .insert([{
                    ...ticketData,
                    status: 'active',
                    created_date: new Date().toISOString()
                }])
                .select()
                .single();
            
            if (error) {
                console.error('Error creating ticket:', error);
                
                // Check if table doesn't exist
                if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
                    throw new Error('DATABASE_TABLE_MISSING: The patient_tickets table does not exist. Please run CREATE_PATIENT_TICKETS_TABLE.sql in Supabase first.');
                }
                
                // Other errors
                throw new Error(error.message || 'Unknown database error');
            }
            
            console.log('Ticket created successfully:', result);
            return result;
        } catch (err) {
            console.error('Error in createTicket:', err);
            throw err; // Re-throw to handle in component
        }
    }

    async getTicketByCode(ticketCode) {
        try {
            const { data, error } = await supabase
                .from('patient_tickets')
                .select('*')
                .eq('ticket_code', ticketCode.toUpperCase())
                .single();
            
            if (error) {
                console.error('Error fetching ticket by code:', error);
                return null;
            }
            return data;
        } catch (err) {
            console.error('Error in getTicketByCode:', err);
            return null;
        }
    }

    async getTicketByNumber(ticketNumber) {
        try {
            const { data, error } = await supabase
                .from('patient_tickets')
                .select('*')
                .eq('ticket_number', ticketNumber)
                .single();
            
            if (error) {
                console.error('Error fetching ticket by number:', error);
                return null;
            }
            return data;
        } catch (err) {
            console.error('Error in getTicketByNumber:', err);
            return null;
        }
    }

    async getPatientTickets(patientId) {
        try {
            const { data, error } = await supabase
                .from('patient_tickets')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_date', { ascending: false });
            
            if (error) {
                console.error('Error fetching patient tickets:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in getPatientTickets:', err);
            return [];
        }
    }

    async getAllTickets() {
        try {
            const { data, error } = await supabase
                .from('patient_tickets')
                .select('*')
                .order('created_date', { ascending: false });
            
            if (error) {
                console.error('Error fetching all tickets:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('Error in getAllTickets:', err);
            return [];
        }
    }

    async updateTicketStatus(ticketId, status, usedDate = null) {
        try {
            const updateData = {
                status: status,
                updated_date: new Date().toISOString()
            };
            
            if (usedDate) {
                updateData.used_date = usedDate;
            }

            const { error } = await supabase
                .from('patient_tickets')
                .update(updateData)
                .eq('id', ticketId);
            
            if (error) {
                console.error('Error updating ticket status:', error);
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error in updateTicketStatus:', err);
            return false;
        }
    }

    async getTicketWithPatient(ticketCode) {
        try {
            const ticket = await this.getTicketByCode(ticketCode);
            if (!ticket) return null;
            
            const patient = await this.getById('patients', ticket.patient_id);
            
            return {
                ...ticket,
                patient: patient
            };
        } catch (err) {
            console.error('Error in getTicketWithPatient:', err);
            return null;
        }
    }

    async getPatientWithVisits(patientId) {
        try {
            const patient = await this.getById('patients', patientId);
            if (!patient) return null;

            const visits = await this.getPatientVisits(patientId);
            
            // Get related data for all visits
            const [allConsultations, allLabRequests, allPrescriptions] = await Promise.all([
                this.getAll('consultations'),
                this.getAll('lab_requests'),
                this.getAll('prescriptions')
            ]);

            // Filter related data by visit IDs
            const consultations = allConsultations.filter(c => visits.some(v => v.id === c.visit_id));
            const labRequests = allLabRequests.filter(l => visits.some(v => v.id === l.visit_id));
            const prescriptions = allPrescriptions.filter(p => visits.some(v => v.id === p.visit_id));

            return {
                patient: patient,
                visits: visits,
                consultations: consultations,
                labRequests: labRequests,
                prescriptions: prescriptions
            };
        } catch (err) {
            console.error('Error in getPatientWithVisits:', err);
            return null;
        }
    }
}

export default SupabaseDB;


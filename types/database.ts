export interface Service {
    id: string;
    name: string;
    description: string | null;
    duration_min: number;
    price: number;
    is_active: boolean;
    created_at?: string;
}

export interface Appointment {
    id?: string;
    service_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    appointment_date: string; // Formato YYYY-MM-DD
    start_time: string;       // Formato HH:MM
    end_time: string;         // Formato HH:MM
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface BusinessSchedule {
    id: string;
    day_of_week: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    open_time: string;
    close_time: string;
    is_day_off: boolean;
}
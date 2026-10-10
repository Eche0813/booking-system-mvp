import { supabase } from '@/lib/supabaseClient';
import { Service, Appointment } from '@/types/database';

/**
 * Servicio para consultar el catálogo de servicios activos en la base de datos.
 */
export async function getActiveServices(): Promise<Service[]> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

    if (error) {
        console.error('[Services API Error] Error fetching active services:', error.message);
        throw new Error('No se pudieron cargar los servicios activos.');
    }

    return data || [];
}

/**
 * Servicio para registrar una nueva reserva en la tabla de citas.
 */
export async function createAppointment(
    appointmentData: Omit<Appointment, 'id' | 'created_at' | 'status'>
): Promise<Appointment> {
    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                ...appointmentData,
                status: 'confirmed',
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('[Appointments API Error] Error creating appointment:', error.message);
        throw new Error('Ocurrió un error al registrar la cita.');
    }

    return data;
}
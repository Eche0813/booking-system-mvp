'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface AppointmentWithService {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    services: {
        name: string;
        price: number;
    } | null;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentWithService[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Verificar sesión activa del usuario
    useEffect(() => {
        async function checkAuthAndFetchData() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/admin/login');
                return;
            }

            setUserEmail(session.user.email || null);
            await fetchAppointments();
        }

        checkAuthAndFetchData();
    }, [router]);

    // Cargar lista de citas con el nombre del servicio
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
          id,
          customer_name,
          customer_email,
          customer_phone,
          appointment_date,
          start_time,
          end_time,
          status,
          services ( name, price )
        `)
                .order('appointment_date', { ascending: false });

            if (error) {
                console.error('Error obteniendo citas:', error);
            } else {
                setAppointments((data as unknown as AppointmentWithService[]) || []);
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cambiar estado de una cita
    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) {
                console.error('Error actualizando estado:', error);
            } else {
                // Actualizar estado localmente
                setAppointments((prev) =>
                    prev.map((app) =>
                        app.id === id ? { ...app, status: newStatus as AppointmentWithService['status'] } : app
                    )
                );
            }
        } catch (err) {
            console.error('Error inesperado actualizando estado:', err);
        }
    };

    // Cerrar Sesión
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Barra Superior */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800 p-6 rounded-xl border border-slate-700 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestión de Citas</h1>
                        <p className="text-xs text-slate-400">
                            Sesión activa: <span className="text-blue-400">{userEmail}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200 rounded-lg transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </header>

                {/* Carga / Skeleton */}
                {loading ? (
                    <div className="text-center py-12 text-slate-400">
                        Cargando lista de citas...
                    </div>
                ) : (
                    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs border-b border-slate-700">
                                <tr>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Servicio</th>
                                    <th className="p-4">Fecha y Hora</th>
                                    <th className="p-4">Contacto</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400">
                                            No hay citas registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="p-4 font-medium text-white">
                                                {app.customer_name}
                                            </td>
                                            <td className="p-4">
                                                {app.services?.name || 'Servicio General'}
                                                {app.services?.price && (
                                                    <span className="block text-xs text-emerald-400 font-semibold">
                              ${app.services.price}
                            </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className="block text-white font-medium">{app.appointment_date}</span>
                                                <span className="text-xs text-slate-400">{app.start_time.slice(0, 5)} hs</span>
                                            </td>
                                            <td className="p-4 text-xs space-y-1">
                                                <p className="text-slate-300">{app.customer_email}</p>
                                                <p className="text-blue-400 font-medium">{app.customer_phone}</p>
                                            </td>
                                            <td className="p-4">
                          <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  app.status === 'confirmed'
                                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                      : app.status === 'completed'
                                          ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                                          : app.status === 'cancelled'
                                              ? 'bg-red-950/80 text-red-400 border border-red-800'
                                              : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                              }`}
                          >
                            {app.status}
                          </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="pending">Pendiente</option>
                                                    <option value="confirmed">Confirmada</option>
                                                    <option value="completed">Completada</option>
                                                    <option value="cancelled">Cancelada</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
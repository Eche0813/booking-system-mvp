'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Service } from '@/types/database';

interface CustomerFormProps {
    selectedService: Service;
    date: string;
    time: string;
    onBack: () => void;
    onSuccess: () => void;
}

export default function CustomerForm({
                                         selectedService,
                                         date,
                                         time,
                                         onBack,
                                         onSuccess,
                                     }: CustomerFormProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        // Calcular hora de fin aproximada basada en la duración del servicio
        const [hours, minutes] = time.split(':').map(Number);
        const endDateObj = new Date();
        endDateObj.setHours(hours, minutes + selectedService.duration_min);
        const endTimeStr = `${String(endDateObj.getHours()).padStart(2, '0')}:${String(
            endDateObj.getMinutes()
        ).padStart(2, '0')}`;

        try {
            const { error } = await supabase.from('appointments').insert([
                {
                    service_id: selectedService.id,
                    customer_name: fullName,
                    customer_email: email,
                    customer_phone: phone,
                    appointment_date: date,
                    start_time: time,
                    end_time: endTimeStr,
                    status: 'confirmed',
                },
            ]);

            if (error) {
                console.error('Error insertando cita:', error);
                setErrorMsg('No se pudo completar la reserva. Inténtalo de nuevo.');
            } else {
                // Redirigir a pantalla de confirmación/éxito
                onSuccess();
            }
        } catch (err) {
            console.error('Error inesperado:', err);
            setErrorMsg('Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 bg-slate-800/80 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    ← Cambiar fecha u hora
                </button>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-1">
                    Ingresa tus Datos Personales
                </h2>
                <p className="text-sm text-slate-400">
                    Reserva para <strong>{selectedService.name}</strong> el día{' '}
                    <strong>{date}</strong> a las <strong>{time} hs</strong>.
                </p>
            </div>

            {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Ej. Juan Pérez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                        Correo Electrónico *
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                        Teléfono / WhatsApp *
                    </label>
                    <input
                        type="tel"
                        required
                        placeholder="+57 300 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Confirmando Cita...' : 'Confirmar Reserva'}
                    </button>
                </div>
            </form>
        </div>
    );
}
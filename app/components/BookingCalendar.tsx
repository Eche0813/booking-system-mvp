'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Service, Appointment } from '@/types/database';

interface BookingCalendarProps {
    selectedService: Service;
    onSelectSlot: (date: string, time: string) => void;
    onBack: () => void;
}

export default function BookingCalendar({
                                            selectedService,
                                            onSelectSlot,
                                            onBack,
                                        }: BookingCalendarProps) {
    // Fecha por defecto: Hoy (formato YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAvailableSlots() {
            if (!selectedDate) return;
            setLoading(true);
            setSelectedTime(null);

            try {
                // 1. Consultar citas ocupadas para la fecha elegida
                const { data: existingAppointments, error } = await supabase
                    .from('appointments')
                    .select('start_time')
                    .eq('appointment_date', selectedDate)
                    .neq('status', 'cancelled');

                if (error) {
                    console.error('Error al obtener citas:', error);
                    return;
                }

                const occupiedTimes = new Set(
                    existingAppointments?.map((app) => app.start_time.slice(0, 5)) || []
                );

                // 2. Generar slots simulados entre las 09:00 y las 18:00 cada 30 min
                const slots: string[] = [];
                let currentHour = 9;
                let currentMinute = 0;

                while (currentHour < 18) {
                    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(
                        currentMinute
                    ).padStart(2, '0')}`;

                    // Si el horario no está ocupado, se añade como disponible
                    if (!occupiedTimes.has(timeStr)) {
                        slots.push(timeStr);
                    }

                    currentMinute += 30;
                    if (currentMinute >= 60) {
                        currentMinute = 0;
                        currentHour += 1;
                    }
                }

                setAvailableSlots(slots);
            } catch (err) {
                console.error('Error calculando disponibilidad:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAvailableSlots();
    }, [selectedDate]);

    return (
        <div className="space-y-6 bg-slate-800/80 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    ← Volver a servicios
                </button>
                <span className="text-xs text-blue-400 font-medium bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
          {selectedService.name} ({selectedService.duration_min} min)
        </span>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-2">
                    Selecciona Fecha y Hora
                </h2>
                <p className="text-sm text-slate-400">
                    Elige el día que deseas agendar tu cita
                </p>
            </div>

            {/* Selector de Fecha */}
            <div className="flex flex-col space-y-2">
                <label className="text-xs text-slate-300 font-medium">Fecha:</label>
                <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
                />
            </div>

            {/* Horarios Disponibles */}
            <div>
                <label className="text-xs text-slate-300 font-medium block mb-3">
                    Horarios disponibles para el {selectedDate}:
                </label>

                {loading ? (
                    <p className="text-sm text-slate-400">Buscando horarios libres...</p>
                ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-amber-400">
                        No hay horarios disponibles para esta fecha.
                    </p>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {availableSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                                        isSelected
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                            : 'bg-slate-900/60 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-900'
                                    }`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Botón de Continuar */}
            {selectedTime && (
                <div className="pt-4 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={() => onSelectSlot(selectedDate, selectedTime)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Siguiente: Tus Datos
                    </button>
                </div>
            )}
        </div>
    );
}
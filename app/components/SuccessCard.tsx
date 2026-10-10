import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Service } from '@/types/database';

interface SuccessCardProps {
    selectedService: Service;
    bookingDetails: {
        date: string;
        time: string;
    };
    onReset: () => void;
}

/**
 * Componente de confirmación exitosa tras completar la reserva.
 */
export default function SuccessCard({
                                        selectedService,
                                        bookingDetails,
                                        onReset,
                                    }: SuccessCardProps) {
    return (
        <div className="bg-neutral-950 p-10 rounded-2xl border border-amber-500/30 text-center space-y-6 shadow-2xl max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-light text-white tracking-wide uppercase">
                    ¡Reserva Confirmada!
                </h2>
                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                    Su cita para{' '}
                    <strong className="text-white font-medium">
                        {selectedService.name}
                    </strong>{' '}
                    ha quedado agendada para el{' '}
                    <span className="text-amber-400 font-medium">
            {bookingDetails.date}
          </span>{' '}
                    a las{' '}
                    <span className="text-amber-400 font-medium">
            {bookingDetails.time} hs
          </span>
                    .
                </p>
            </div>

            <button
                onClick={onReset}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs uppercase tracking-widest font-medium rounded-lg transition-all border border-neutral-800"
            >
                Volver al Inicio
            </button>
        </div>
    );
}
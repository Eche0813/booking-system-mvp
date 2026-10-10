'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types/database';
import { getActiveServices } from '@/lib/services';
import { getServiceImage } from '@/data/mockData';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import BookingCalendar from './components/BookingCalendar';
import CustomerForm from './components/CustomerForm';
import SuccessCard from './components/SuccessCard';
import { Clock, CheckCircle2, ShieldCheck, ArrowRight, Award } from 'lucide-react';

export default function HomePage() {
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{ date: string; time: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const data = await getActiveServices();
        setServices(data);
      } catch (err) {
        console.error('Error cargando catálogo:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleSelectSlot = (date: string, time: string) => {
    setBookingDetails({ date, time });
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService(null);
    setBookingDetails(null);
  };

  return (
      <main className="min-h-screen bg-black text-neutral-100 font-sans relative selection:bg-amber-500 selection:text-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 space-y-12">
          <Header />
          <StepIndicator currentStep={step} />

          {/* Encabezado Dinámico */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-[10px] tracking-[0.25em] uppercase font-medium">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Reserva Exclusiva</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white uppercase">
              {step === 1 && 'Selección de Servicios'}
              {step === 2 && 'Agenda & Disponibilidad'}
              {step === 3 && 'Datos de la Cita'}
              {step === 4 && 'Confirmación Registrada'}
            </h1>
            <p className="text-neutral-400 text-xs md:text-sm font-light max-w-md mx-auto leading-relaxed tracking-wide">
              {step === 1 && 'Elija la atención requerida para coordinar su cita personalizada.'}
              {step === 2 && 'Consulte los bloques de horario disponibles en tiempo real.'}
              {step === 3 && 'Ingrese sus datos para finalizar el agendamiento.'}
            </p>
          </div>

          {/* Paso 1: Catálogo de Servicios */}
          {step === 1 && (
              <>
                {loading ? (
                    <div className="text-center py-20 text-neutral-500 text-xs uppercase tracking-widest font-light">
                      Cargando servicios disponibles...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {services.map((service) => {
                        const isSelected = selectedService?.id === service.id;
                        const imageUrl = getServiceImage(service.name);

                        return (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                                    isSelected
                                        ? 'bg-neutral-950 border-amber-500/80 shadow-2xl shadow-amber-500/5 ring-1 ring-amber-500/30'
                                        : 'bg-neutral-950/60 border-neutral-900 hover:border-amber-500/30 hover:bg-neutral-900/40'
                                }`}
                            >
                              <div className="h-44 w-full relative overflow-hidden bg-neutral-950">
                                <img
                                    src={imageUrl}
                                    alt={service.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 grayscale hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-amber-400 font-semibold px-3 py-1 rounded-full text-xs border border-amber-500/30 tracking-wider">
                                  ${service.price}
                                </div>
                              </div>

                              <div className="p-6 space-y-3">
                                <h3 className="text-base font-medium tracking-wide text-white group-hover:text-amber-300 transition-colors">
                                  {service.name}
                                </h3>
                                <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-2">
                                  {service.description || 'Atención personalizada y estándares de máxima calidad.'}
                                </p>
                                <div className="flex items-center text-[11px] text-neutral-500 pt-3 border-t border-neutral-900 tracking-wider uppercase">
                                  <Clock className="w-3.5 h-3.5 text-amber-500/70 mr-2" />
                                  <span>Duración: {service.duration_min} minutos</span>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}

                {selectedService && (
                    <div className="sticky bottom-6 p-5 bg-neutral-950/90 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-2xl flex justify-between items-center animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Seleccionado</p>
                          <p className="text-xs font-semibold text-white tracking-wide">
                            {selectedService.name} • <span className="text-amber-400">${selectedService.price}</span>
                          </p>
                        </div>
                      </div>
                      <button
                          onClick={() => setStep(2)}
                          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
                      >
                        <span>Siguiente</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                )}
              </>
          )}

          {/* Paso 2: Calendario */}
          {step === 2 && selectedService && (
              <BookingCalendar
                  selectedService={selectedService}
                  onSelectSlot={handleSelectSlot}
                  onBack={() => setStep(1)}
              />
          )}

          {/* Paso 3: Formulario */}
          {step === 3 && selectedService && bookingDetails && (
              <CustomerForm
                  selectedService={selectedService}
                  date={bookingDetails.date}
                  time={bookingDetails.time}
                  onBack={() => setStep(2)}
                  onSuccess={() => setStep(4)}
              />
          )}

          {/* Paso 4: Confirmación */}
          {step === 4 && selectedService && bookingDetails && (
              <SuccessCard
                  selectedService={selectedService}
                  bookingDetails={bookingDetails}
                  onReset={handleReset}
              />
          )}
        </div>
      </main>
  );
}
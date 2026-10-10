import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
}

export default function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="max-w-xs mx-auto space-y-3 text-center">
            <div className="flex justify-between text-[11px] tracking-widest uppercase text-neutral-500 font-medium">
                <span className={currentStep >= 1 ? 'text-amber-400' : ''}>01. Servicio</span>
                <span className={currentStep >= 2 ? 'text-amber-400' : ''}>02. Horario</span>
                <span className={currentStep >= 3 ? 'text-amber-400' : ''}>03. Confirmación</span>
            </div>
            <div className="h-[1px] w-full bg-neutral-900 relative">
                <div
                    className="h-[1px] bg-gradient-to-r from-amber-600 to-yellow-200 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
}
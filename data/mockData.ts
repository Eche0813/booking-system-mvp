export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
    default: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
    corte: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop',
    barba: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop',
};

/**
 * Devuelve una imagen temática basada en el nombre del servicio.
 */
export function getServiceImage(serviceName: string): string {
    const lower = serviceName.toLowerCase();
    if (lower.includes('barba')) return DEFAULT_SERVICE_IMAGES.barba;
    if (lower.includes('corte') || lower.includes('cabello')) return DEFAULT_SERVICE_IMAGES.corte;
    return DEFAULT_SERVICE_IMAGES.default;
}
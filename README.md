# Panel de Reservas & Gestión de Citas (SaaS / MVP)

![SEMISA Web Solutions](https://img.shields.io/badge/Developed%20by-SEMISA%20Web%20Solutions-amber?style=for-the-badge&logo=codefactor)
![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Un sistema web completo y minimalista diseñado para la gestión de citas y agendamiento en tiempo real para negocios locales (barberías, centros de estética, consultorios, spa, etc.).

Desarrollado como un ejemplo comercial y demostrativo por **SEMISA Web Solutions**.

---

##  Características Principales

###  Flujo del Cliente (Público)
* **Catálogo Dinámico de Servicios:** Visualización de servicios activos, precios y tiempos de duración extraídos en vivo desde Supabase.
* **Cálculo Dinámico de Horarios (*Slots*):** Selección de fecha mediante calendario interactivo con descarte automático de horarios ya reservados o cancelados.
* **Formulario de Confirmación Directa:** Registro inmediato de citas sin necesidad de logins complejos para el cliente final.
* **Diseño Minimalista & Elegante:** Interfaz estilizada en paleta clásica monocromática con acentos dorados/champán y efectos cristal (*glassmorphism*).

###  Módulo Administrativo Privado (`/admin`)
* **Autenticación Segura:** Inicio de sesión protegido con **Supabase Auth** (`email` + `password`).
* **Dashboard Interactivo:** Tabla en tiempo real con la lista completa de reservas.
* **Gestión de Estados:** Modificación del estado de cada cita (*Pendiente*, *Confirmada*, *Completada*, *Cancelada*).
* **Protección de Rutas:** Redirección automática y control de sesiones mediante tokens JWT de Supabase.

---

## ️ Stack Tecnológico

* **Frontend:** [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/)
* **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS Policies + Supabase Auth)
* **Despliegue & Hosting:** [Vercel](https://vercel.com/)

---

##  Estructura del Proyecto

```text
booking-system-mvp/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Dashboard privado con tabla de citas
│   │   └── login/
│   │       └── page.tsx       # Pantalla de inicio de sesión de Supabase Auth
│   ├── components/
│   │   ├── BookingCalendar.tsx# Componente de selector de fecha y bloques libres
│   │   └── CustomerForm.tsx   # Formulario de captura e inserción de citas
│   ├── layout.tsx             # Layout global con estilos Tailwind
│   └── page.tsx               # Vista pública principal del cliente
├── lib/
│   └── supabaseClient.ts      # Instancia inicializada del cliente de Supabase
├── types/
│   └── database.ts            # Interfaces TypeScript para tablas de la BD
└── public/                    # Recursos estáticos
```
## Configutación e instalación local
### 1. Clonar el repositorio
```bash
git clone [hhtps://github.com/Eche0813/booking-system-mvp.git](hhtps://github.com/Eche0813/booking-system-mvp.git)
```
### 2. Instalar dependencias
```bash
npm install
```
### 3. Configurar variables de entorno
```text
NEXT_PUBLIC_SUPABASE_URL=[https://tu-proyecto.supabase.co](https://tu-proyecto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-publica
```
### 4. Ejecutar servidor de desarrollo
```bash
npm run dev
```
```
Abre http://localhost:3000 en tu navegador para ver el resultado
```
---
## Estructura de la BD (Supabase SQL)
### El proyecto requiere de las siguientes  tablas estructuradas con Row Level Security (RLS)
```sql
-- Tabla de Servicios
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_min INT NOT NULL DEFAULT 30,
  price NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Citas / Reservas
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
## Desarrollado por
## Semisa Web Solutions
```text
- Github: Eche0813
```
# Asistente Clínico para Médico Rural (Primer Nivel)

Herramienta clínica de consulta rápida y alerta epidemiológica diseñada específicamente para médicos generales en Servicio Social Obligatorio (año rural) en hospitales y centros de salud de primer nivel en Colombia.

![Version](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-teal)
![Plataforma](https://img.shields.io/badge/Plataforma-Web%20Offline%20%2F%20PWA-blue)
![Normativa](https://img.shields.io/badge/Normativa-SIVIGILA%20%2F%20INS-red)

---

## 🩺 El Problema Clínico
En los centros de salud de primer nivel y zonas rurales dispersas, el médico general atiende frecuentemente en solitario turnos de urgencias y consulta externa, sin especialistas presenciales para interconsultas. Al enfrentar patologías tropicales, infecciosas o emergencias toxicológicas, necesita consultar de inmediato definiciones, signos de alarma, criterios diagnósticos, acciones críticas en el **"Minuto Cero"** y esquemas de tratamiento, además de recordar la obligatoriedad de notificación al **SIVIGILA** (Sistema de Vigilancia en Salud Pública de Colombia).

## 🚀 Características Principales
* **100% Offline-First (PWA):** Funciona sin conexión a internet en el navegador o instalada en teléfonos y computadores del puesto de salud.
* **Búsqueda Predictiva Instantánea:** Localiza patologías por nombre común, síntoma, tríada patognomónica o código SIVIGILA en milisegundos.
* **Ficha Clínica Estructurada:**
  * Definición y epidemiología colombiana.
  * Signos, síntomas y **Signos de Alarma (Red Flags)**.
  * **Tríadas y Tétradas patognomónicas** visualmente destacadas.
  * Criterios diagnósticos adaptados a recursos de primer nivel (laboratorio básico rural).
  * **Protocolo Minuto Cero (Acciones críticas iniciales y criterios de remisión)**.
  * Tratamiento farmacológico escalonado según guías INS/Minsalud.
* **Banners de Alerta SIVIGILA:** Diferenciación visual inmediata entre notificación obligatoria inmediata (<24h, rojo pulso) y semanal (azul).
* **Cuaderno de Notas Locales y Farmacia:** Guarda en cada ficha el stock de medicamentos disponibles en el centro de salud y los contactos de remisión/ambulancia con persistencia local (`localStorage`).
* **Directorio Normativo SIVIGILA:** Vista dedicada para auditar códigos de evento INS y periodicidades de reporte.
* **Modo Turno Nocturno (Dark Mode):** Interfaz ergonómica de alto contraste para turnos de urgencias nocturnos.

---

## 📋 Catálogo Curado Inicial (Guías INS / Minsalud)
1. **Dengue (Sin signos, con signos de alarma y Dengue Grave)** — Código INS 210 / 580.
2. **Malaria (P. vivax y P. falciparum)** — Código INS 465 / 470.
3. **Tuberculosis Pulmonar y Extrapulmonar** — Código INS 813 / 815.
4. **Accidente Ofídico (Bothrópico, Crotálico, Elapídico)** — Código INS 100.
5. **Varicela y Complicaciones** — Código INS 831.
6. **VIH / Profilaxis Post-Exposición (PEP Ocupacional y No Ocupacional)** — Código INS 850.
7. **Infección Respiratoria Aguda Grave (IRAG)** — Código INS 345 / 348.

---

## 🛠️ Estructura del Repositorio
```
├── index.html                   # Interfaz SPA interactiva y responsiva
├── manifest.json                # Manifiesto PWA para instalación offline
├── sw.js                        # Service Worker para funcionamiento sin internet
├── css/
│   ├── main.css                 # Variables de diseño, layout clínico y modo oscuro
│   ├── components.css           # Banners SIVIGILA, badges, tarjetas, modales y timeline
│   └── print.css                # Formato optimizado para impresión de fichas
├── js/
│   ├── app.js                   # Controlador principal de interfaz y navegación
│   ├── store.js                 # Persistencia en localStorage (Notas, Favoritos, Historial)
│   ├── search.js                # Motor de indexación y búsqueda predictiva
│   └── data/
│       ├── diseases.js          # Base de datos clínica estructurada
│       └── sivigila.js          # Directorio de eventos notificables INS
└── docs/
    └── PRD.md                   # Documento de Requisitos del Producto (PRD)
```

---

## 🖥️ Cómo Ejecutar la Aplicación

### Opción 1: Abrir directamente en el navegador
Simplemente abre el archivo `index.html` con cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).

### Opción 2: Servidor local ligero
Si dispones de Python o Node.js:
```bash
# Con Python
python -m http.server 8080

# Con Node (npx)
npx serve
```
Luego abre `http://localhost:8080` en tu navegador.

---

## ⚖️ Descargo de Responsabilidad y Límites Clínicos
* Esta aplicación es una herramienta de consulta y apoyo a la toma de decisiones clínicas para profesionales de la salud debidamente graduados.
* **No realiza diagnósticos automáticos** a partir de síntomas.
* **No calcula dosificaciones automáticas** de medicamentos; la dosificación debe ser verificada y prescrita por el médico tratante de acuerdo con el peso, función renal y estado clínico del paciente.
* **No transmite fichas epidemiológicas directamente al SIVIGILA**; funciona como guía de alerta y referencia para el diligenciamiento institucional.

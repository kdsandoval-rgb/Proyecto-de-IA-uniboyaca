# PRD - Asistente Clínico para Médico Rural (Primer Nivel)

## 1. El Problema
El médico general que realiza su año de Servicio Social Obligatorio (año rural) en un hospital o centro de salud de primer nivel atiende solo la mayoría de sus turnos (tanto en consulta externa como en el servicio de urgencias), sin especialistas presenciales para interconsultas inmediatas. 

Al atender a un paciente con un cuadro agudo o potencialmente grave, el médico debe consultar rápidamente diversas fuentes bibliográficas para corroborar definiciones, signos y síntomas cardinales, criterios diagnósticos, manejo inicial de emergencia ("Minuto Cero") y tratamiento farmacológico mientras el paciente espera en camilla o consultorio. Adicionalmente, ante la sobrecarga asistencial, es frecuente pasar por alto datos críticos como tríadas patognomónicas o la obligatoriedad y periodicidad de notificación epidemiológica al **SIVIGILA** (Sistema de Vigilancia en Salud Pública de Colombia / INS).

## 2. El Usuario Objetivo
* **Perfil:** Médico general recién graduado en Servicio Social Obligatorio (año rural) en instituciones prestadoras de salud (IPS) de primer nivel de atención en Colombia.
* **Contexto de uso:** Consulta rápida y de alta legibilidad durante consulta externa, triage o turnos nocturnos de urgencias, frecuentemente desde el computador del puesto de salud o su dispositivo móvil personal.
* **Entorno operativo:** Conectividad a internet deficiente, intermitente o inexistente en zonas rurales dispersas.

## 3. Funciones Clave

### 3.1. Búsqueda Rápida y Filtros Clínicos
* Buscador predictivo en tiempo real con indexación por:
  * Nombre común y técnico de la patología.
  * Signos, síntomas cardinales y hallazgos físicos.
  * Tríadas o tétradas diagnósticas.
  * Código de evento SIVIGILA (INS).
* Filtros rápidos con un clic:
  * *Todos*
  * *SIVIGILA Inmediato* (Eventos de reporte antes de 24 horas)
  * *Urgencias / Minuto Cero*
  * *Infecciosas / Tropicales*
  * *Zoonosis y Envenenamientos*
  * *Mis Favoritos* (Patologías frecuentes del turno)

### 3.2. Ficha Clínica Estructurada y Jerarquizada
Cada patología cuenta con una ficha clínica estandarizada en 5 módulos clave:
1. **Definición & Epidemiología:** Concepto conciso, períodos de incubación, distribución endémica en Colombia.
2. **Signos, Síntomas y Signos de Alarma (Red Flags):** Manifestaciones clínicas iniciales versus signos de deterioro hemodinámico o falla orgánica.
3. **Tríadas / Tétradas Patognomónicas:** Cajas visuales de alta prioridad que destacan combinaciones sindromáticas clave (ej. tríada de extravasación en dengue, tríada paroxística en malaria).
4. **Diagnóstico Rural:** Criterios clínicos aplicables con recursos de primer nivel (frotis de sangre periférica, gota gruesa, hematocrito, prueba de torniquete, coagulación en tubo).
5. **Manejo Inicial ("Minuto Cero"):** Protocolo de acción inmediata en urgencias (líquidos endovenosos, vía aérea, posicionamiento, criterios de remisión a segundo o tercer nivel).
6. **Tratamiento Escalonado:** Esquemas farmacológicos normativos de primera línea basados en guías del Ministerio de Salud y Protección Social de Colombia / INS.

### 3.3. Alerta y Badge Prioritario SIVIGILA
* Banner visual destacado en la cabecera de la ficha clínica:
  * **Notificación Inmediata:** Alerta roja con animación pulsante para eventos que requieren reporte telefónico o radial en menos de 24 horas (ej. Dengue Grave, Accidente Ofídico, Cólera).
  * **Notificación Semanal:** Badge informativo azul para eventos de reporte en archivo plano semanal (ej. Dengue sin signos, Varicela individual, Tuberculosis).
* Código oficial de evento INS y descripción de la periodicidad y acciones epidemiológicas requeridas.

### 3.4. Cuaderno de Notas Locales y Farmacia Rural
* Editor persistente en el dispositivo (`localStorage`) asociado a cada ficha clínica:
  * **Disponibilidad de medicamentos e insumos:** Registro de fármacos en existencia en la farmacia del centro de salud rural.
  * **Directorio de remisión local:** Nombres y teléfonos de ambulancias, red de referencia departamental y hospital de segundo nivel.
  * Notas clínicas personalizadas del médico para su turno.

### 3.5. Directorio SIVIGILA y Eventos Notificables
* Módulo independiente para auditar rápidamente todos los eventos de notificación obligatoria en Colombia.
* Vista tabular con filtro inmediato vs. semanal, códigos INS y enlaces directos a las fichas correspondientes.

---

## 4. Límites Clínicos y Principios de Seguridad (Lo que NO hace)
1. **No es un motor de diagnóstico automatizado:** La aplicación no procesa listas de síntomas para emitir probabilidades diagnósticas automáticas, evitando inducir sesgos o errores en la práctica clínica.
2. **No calcula dosis pediátricas o complejas de forma automática:** No reemplaza la prescripción y verificación manual del médico tratante con el peso del paciente.
3. **No realiza transmisión electrónica directa al SIVIGILA:** Funciona como guía de alerta normativa y referencia de códigos INS; el médico diligencia la ficha física o en el aplicativo oficial de la institución.
4. **Catálogo inicial enfocado y curado:** Contiene patologías de alta prevalencia y criticidad en el primer nivel rural colombiano.

---

## 5. Arquitectura Técnica
* **Modelo:** Aplicación Web Progresiva (PWA) de una sola página (SPA).
* **Stack:** HTML5 semántico, CSS3 modular (diseño responsivo móvil/escritorio, tema claro y modo turno nocturno), JavaScript ES6 nativo modular.
* **Autonomía:** 100% Offline mediante Service Worker (`sw.js`). No requiere conexión a internet para consultar fichas ni editar notas locales.
* **Persistencia:** Almacenamiento local del navegador (`localStorage`) para favoritos, notas del centro de salud y preferencias visuales.

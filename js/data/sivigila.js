/**
 * Directorio Normativo SIVIGILA (Sistema de Vigilancia en Salud Pública de Colombia)
 * Instituto Nacional de Salud (INS)
 */

export const SIVIGILA_EVENTS = [
  {
    code: "100",
    name: "Accidente Ofídico",
    periodicity: "Inmediata",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Vía telefónica / radial / aplicativo Sivigila",
    description: "Todo caso con antecedente de mordedura de serpiente con manifestaciones locales o sistémicas de envenenamiento.",
    clinicalSheetId: "accidente-ofidico",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-100"
  },
  {
    code: "580",
    name: "Dengue Grave y Mortalidad por Dengue",
    periodicity: "Inmediata",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Inmediato a Secretaría de Salud Municipal y Departamental",
    description: "Casos de dengue con choque por extravasación, hemorragia severa o falla orgánica grave. Requiere autopsia verbal en caso de defunción.",
    clinicalSheetId: "dengue",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-580"
  },
  {
    code: "210",
    name: "Dengue (Sin y Con Signos de Alarma)",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Cierre de semana epidemiológica",
    channel: "Archivo plano semanal SIVIGILA",
    description: "Todo caso sospechoso o confirmado de dengue con o sin signos de alarma que no cumpla criterios de dengue grave.",
    clinicalSheetId: "dengue",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-210"
  },
  {
    code: "475",
    name: "Malaria Complicada y Muertes por Malaria",
    periodicity: "Inmediata",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Inmediato por canal de urgencia epidemiológica",
    description: "Casos de malaria con manifestaciones de malaria cerebral, falla renal, disfunción respiratoria, ictericia marcada o hiperparasitemia.",
    clinicalSheetId: "malaria",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-465"
  },
  {
    code: "465",
    name: "Malaria por Plasmodium vivax",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Cierre semanal",
    channel: "Archivo plano semanal",
    description: "Caso confirmado por gota gruesa o prueba rápida de infección por P. vivax sin criterios de complicación.",
    clinicalSheetId: "malaria",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-465"
  },
  {
    code: "470",
    name: "Malaria por Plasmodium falciparum",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Cierre semanal",
    channel: "Archivo plano semanal",
    description: "Caso confirmado por gota gruesa o prueba rápida de infección por P. falciparum sin signos de complicación.",
    clinicalSheetId: "malaria",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-465"
  },
  {
    code: "345",
    name: "Infección Respiratoria Aguda Grave (IRAG) Inusitada",
    periodicity: "Inmediata",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Inmediato a Vigilancia Epidemiológica",
    description: "Casos de IRAG en personas previamente sanas de 5 a 49 años con rápida progresión a falla ventilatoria o sospecha de patógeno emergente (ej. Influenza aviar, nuevo coronavirus).",
    clinicalSheetId: "irag",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-345"
  },
  {
    code: "348",
    name: "Infección Respiratoria Aguda Grave (IRAG) Rutinaria",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Semanal",
    channel: "Archivo plano semanal",
    description: "Hospitalizaciones por cuadro respiratorio agudo en menores de 5 años y mayores de 60 años.",
    clinicalSheetId: "irag",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-348"
  },
  {
    code: "813",
    name: "Tuberculosis (Pulmonar y Extrapulmonar)",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Semanal",
    channel: "Archivo plano semanal e ingreso al Libro de Programa TB",
    description: "Caso confirmado bacteriológica o clínicamente de TB sensible o en estudio.",
    clinicalSheetId: "tuberculosis",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-813"
  },
  {
    code: "815",
    name: "Tuberculosis Farmacorresistente (MDR / XDR)",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Semanal",
    channel: "Archivo plano semanal y comité departamental",
    description: "Caso de TB con resistencia confirmada a Rifampicina o Isoniazida por GeneXpert o cultivo.",
    clinicalSheetId: "tuberculosis",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-815"
  },
  {
    code: "831",
    name: "Varicela (Brote ≥ 3 casos o Complicación Grave)",
    periodicity: "Inmediata / Semanal",
    isImmediate: true,
    timeLimit: "< 24 horas en brotes / Semanal en casos aislados",
    channel: "Inmediato si es brote; semanal si es caso esporádico",
    description: "Conglomerados de 3 o más casos en escuelas, guarderías, cárceles o batallones, y cualquier defunción por varicela.",
    clinicalSheetId: "varicela",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-831"
  },
  {
    code: "850",
    name: "Infección por VIH / Síndrome de Inmunodeficiencia Adquirida (SIDA)",
    periodicity: "Semanal",
    isImmediate: false,
    timeLimit: "Semanal",
    channel: "Archivo plano semanal",
    description: "Caso confirmado por algoritmo diagnóstico nacional (dos pruebas presuntivas positivas de diferentes plataformas y confirmatoria).",
    clinicalSheetId: "pep-vih",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-850"
  },
  {
    code: "453",
    name: "Violencia de Género y Violencia Sexual",
    periodicity: "Inmediata",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Inmediato (Ruta de atención integral Código Rosa)",
    description: "Toda presunta víctima de violencia sexual que acuda a la IPS. Atención médica prioritaria Minuto Cero con profilaxis PEP para VIH y anticoncepción de emergencia.",
    clinicalSheetId: "pep-vih",
    requiresSpecialForm: true,
    formCode: "INS-Ficha-453"
  },
  {
    code: "220",
    name: "Chagas (Enfermedad de Chagas Aguda y Congénita)",
    periodicity: "Inmediata",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Inmediato por canal epidémico",
    description: "Fiebre prolongada con signo de Romaña, chagoma de inoculación o sospecha de transmisión oral por jugo de caña o frutas contaminadas con heces de pito (Triatoma).",
    clinicalSheetId: null,
    requiresSpecialForm: true,
    formCode: "INS-Ficha-220"
  },
  {
    code: "440",
    name: "Leishmaniasis (Cutánea, Mucosa y Visceral)",
    periodicity: "Semanal (Visceral es Inmediata)",
    isImmediate: false,
    timeLimit: "Semanal (Cutánea/Mucosa) / Inmediata (Visceral)",
    channel: "Archivo plano semanal",
    description: "Úlcera cutánea de bordes levantados e indurados ('úlcera de chiclero') de fondo limpio en área rural endémica transmitida por Lutzomyia.",
    clinicalSheetId: null,
    requiresSpecialForm: true,
    formCode: "INS-Ficha-440"
  },
  {
    code: "650",
    name: "Rabia Humana y Agresiones por Animales Potencialmente Transmisores de Rabia (APTR)",
    periodicity: "Inmediata (< 24 horas)",
    isImmediate: true,
    timeLimit: "< 24 horas",
    channel: "Inmediato por teléfono/red",
    description: "Mordeduras o arañazos de murciélagos, zorros, monos o perros/gatos callejeros no observables o con signos neurológicos.",
    clinicalSheetId: null,
    requiresSpecialForm: true,
    formCode: "INS-Ficha-650"
  }
];

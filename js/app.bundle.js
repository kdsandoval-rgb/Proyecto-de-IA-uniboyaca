/**
 * Asistente Clínico para Médico Rural (Primer Nivel)
 * Bundle unificado y autónomo (Zero CORS, 100% compatible con file:// y http://)
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. BASE DE DATOS DE PATOLOGÍAS CLÍNICAS (INS / MINSALUD COLOMBIA)
  // ==========================================================================
  const DISEASES = [
    {
      id: "dengue",
      name: "Dengue (Sin signos, Con signos de alarma y Dengue Grave)",
      shortName: "Dengue",
      category: "infecciosas",
      categoryLabel: "Infecciosas / Tropicales",
      urgencyLevel: "alta",
      sivigila: {
        code: "210 / 580",
        type: "inmediata_condicional",
        periodicity: "Inmediata (<24h) en Dengue Grave / Semanal en Dengue sin/con signos",
        priorityBadge: "SIVIGILA 210/580",
        isImmediate: true,
        subtypes: [
          { name: "Dengue sin signos de alarma", code: "210", period: "Semanal" },
          { name: "Dengue con signos de alarma", code: "210", period: "Semanal" },
          { name: "Dengue grave / Mortalidad por dengue", code: "580", period: "Inmediata (< 24 horas)" }
        ]
      },
      triad: {
        title: "Tríada de Extravasación Plasmática (Dengue Crítico)",
        components: [
          "Aumento progresivo del hematocrito (≥ 20% sobre valor basal)",
          "Trombocitopenia marcada y acelerada (< 100.000 / μL)",
          "Acumulación de líquidos clínica o ecográfica (derrame pleural, ascitis, hipoalbuminemia)"
        ],
        alertText: "La fase crítica ocurre típicamente entre el 3.° y 7.° día de evolución, coincidiendo con la caída de la fiebre (defervescencia). ¡Monitoreo estricto del hematocrito y presión de pulso!"
      },
      definition: "Enfermedad febril aguda producida por el virus del dengue (DENV-1, 2, 3 o 4), flavivirus transmitido por la picadura de mosquitos hembra del género Aedes (principalmente Aedes aegypti). En Colombia es endémica en áreas situadas por debajo de los 2.200 metros sobre el nivel del mar.",
      epidemiology: "Endémica en más del 85% del territorio nacional por debajo de 2.200 msnm. Comportamiento hiperendémico con circulación simultánea de los cuatro serotipos. Mayor gravedad en reinfecciones heterotípicas.",
      phases: [
        { name: "Fase Febril", duration: "Días 1 a 3-4", desc: "Fiebre alta repentina, cefalea retroocular, mialgias, artralgias, rubor facial." },
        { name: "Fase Crítica", duration: "Días 3 a 7 (al caer la fiebre)", desc: "Fuga capilar de plasma, aumento del hematocrito, signos de alarma o choque." },
        { name: "Fase de Recuperación", duration: "Días 7 a 10", desc: "Reabsorción de líquidos, mejoría del apetito, erupción tardía pruriginosa (islas blancas en mar rojo)." }
      ],
      symptoms: [
        "Fiebre aguda (2 a 7 días de duración)",
        "Cefalea intensa con predominio retroocular",
        "Mialgias intensas ('fiebre quebrantahuesos') y artralgias",
        "Erupción cutánea eritematosa o petequial",
        "Náuseas, vómito y anorexia"
      ],
      redFlags: [
        "Dolor abdominal intenso, continuo y localizado o a la palpación",
        "Vómitos persistentes (≥ 3 episodios en 1 hora o ≥ 5 en 6 horas)",
        "Acumulación clínica de líquidos (ascitis, derrame pleural, edema periorbitario)",
        "Sangrado espontáneo de mucosas (gingivorragia, epistaxis, metrorragia)",
        "Letargo, somnolencia extrema o irritabilidad motora",
        "Hipotensión postural o lipotimia",
        "Hepatomegalia dolorosa (> 2 cm por debajo del reborde costal)",
        "Aumento progresivo y sostenido del hematocrito con caída rápida de plaquetas"
      ],
      diagnosis: {
        ruralContext: "En el primer nivel se basa en definición de caso clínico, prueba de torniquete (lazo) y seguimiento estricto del hemoleucograma básico.",
        tests: [
          "Hemoleucograma completo: Monitorear Hematocrito (Hto) y Plaquetas cada 12-24 horas en consulta/observación.",
          "Prueba de torniquete: Inflar manguito a presión media (PAS+PAD)/2 durante 5 min (3 min en niños). Positiva si ≥ 20 petequias en un cuadro de 2.5 x 2.5 cm.",
          "Prueba rápida antígeno NS1 (primeros 3 a 5 días) o serología IgM para dengue (después del 5.° día) si está disponible en laboratorio local.",
          "Gota gruesa obligatoria en zona rural endémica para descartar coinfección por malaria."
        ],
        classificationCriteria: "1. Dengue sin signos: Tolera VO, orina normal, sin comorbilidad de riesgo.\n2. Dengue con signos: Presenta al menos 1 signo de alarma.\n3. Dengue grave: Choque hipovolémico, sangrado severo o falla orgánica (transaminasas > 1.000, miocarditis, encefalopatía)."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero (Acciones Críticas en Urgencias)",
        steps: [
          {
            order: 1,
            action: "Triage y Acceso Vascular",
            detail: "Si hay signos de alarma o choque, canalizar 2 accesos venosos periféricos con catéter de grueso calibre (18G o 20G en adultos). Posición de decúbito supino con elevación de miembros si hay hipotensión."
          },
          {
            order: 2,
            action: "Reanimación con Cristaloides (Dengue con Signos de Alarma)",
            detail: "Iniciar Lactato de Ringer o Solución Salina 0.9% a 10 mL/kg en la primera hora. Reevaluar: si mejoran signos y diuresis (> 1 mL/kg/h), reducir a 5-7 mL/kg/h por 2 a 4 horas; luego 3-5 mL/kg/h por 2 a 4 horas. Total infusión máxima 48 horas."
          },
          {
            order: 3,
            action: "Manejo de Choque por Dengue (Dengue Grave)",
            detail: "Iniciar bolo inmediato de cristaloides a 20 mL/kg en 15 a 30 minutos. Si no responde tras segundo bolo, considerar coloides y solicitar remisión medicalizada inmediata a UCI."
          },
          {
            order: 4,
            action: "Monitoreo Estricto de Parámetros",
            detail: "Signos vitales cada 15-30 minutos en choque, cada 1 hora en signos de alarma. Control horario de gasto urinario (sonda vesical en paciente grave). Hematocrito antes y después de los bolos."
          },
          {
            order: 5,
            action: "Criterios de Remisión Inmediata (Segundo/Tercer Nivel)",
            detail: "Presencia de choque, hipotensión refractaria a cristaloides, sangrado mayor gastrointestinal, compromiso neurológico, gestante con signos de alarma o menores de 1 año inestables."
          }
        ],
        warnings: [
          "¡ABSOLUTAMENTE CONTRAINDICADOS AINEs (ibuprofeno, diclofenaco, naproxeno) y ácido acetilsalicílico por riesgo de sangrado severo y acidosis!",
          "¡Evitar inyecciones intramusculares (riesgo de hematomas masivos) y corticoides!",
          "¡Cuidado con la sobrecarga de líquidos al entrar en la fase de recuperación (riesgo de edema pulmonar agudo)!"
        ]
      },
      treatment: {
        outpatient: "Manejo ambulatorio (Grupo A - Sin signos de alarma): Reposo en cama con toldillo/mosquitero. Abundante hidratación oral con sales de rehidratación oral (SRO) o líquidos caseros (jugos, sueros, sopas; evitar agua sola). Acetaminofén: adultos 500-1000 mg VO cada 6 horas (máximo 3 g/día); niños 10-15 mg/kg/dosis cada 6 horas. Instruir por escrito signos de alarma y citar a control diario de hematocrito hasta 48h posfiebre.",
        hospitalized: "Manejo hospitalario (Grupo B - Con signos de alarma): Hospitalizar en observación de urgencias. Terapia hídrica protocolizada con Lactato de Ringer. Control horario de diuresis, presión arterial media y hematocrito cada 12 horas.",
        intensive: "Manejo en UCI (Grupo C - Dengue grave): Soporte ventilatorio, corrección de coagulopatía, reanimación avanzada guiada por metas y manejo de falla multiorgánica."
      }
    },
    {
      id: "accidente-ofidico",
      name: "Accidente Ofídico (Mordedura de Serpiente)",
      shortName: "Accidente Ofídico",
      category: "urgencias",
      categoryLabel: "Urgencias / Toxicología",
      urgencyLevel: "critica",
      sivigila: {
        code: "100",
        type: "inmediata",
        periodicity: "Notificación Inmediata Obligatoria (< 24 horas)",
        priorityBadge: "SIVIGILA 100 - INMEDIATO",
        isImmediate: true
      },
      triad: {
        title: "Tríada Local Bothrópica (90-95% de casos en Colombia)",
        components: [
          "Dolor urente intenso e inmediato en el sitio de inoculación",
          "Edema progresivo, indurado y de avance centrípeto rápido",
          "Signos hemorrágicos locales/sistémicos (sangrado continuo en orificios de colmillos, equimosis, flictenas)"
        ],
        alertText: "¡El género Bothrops (mapaná, cuatro narices, talla X) es responsable de más del 90% de los envenenamientos en Colombia! Evaluar inmediatamente la prueba de coagulación."
      },
      definition: "Lesión resultante de la mordedura de una serpiente venenosa con inoculación activa de toxinas (veneno). En Colombia las familias de importancia médica son Viperidae (Bothrops, Crotalus, Lachesis) y Elapidae (Micrurus - corales verdaderas).",
      epidemiology: "Evento de alta incidencia rural en zonas agrícolas y selváticas por debajo de 2.500 msnm. Frecuente en extremidades inferiores de agricultores y trabajadores del campo. Pico estacional en temporadas de lluvias.",
      typesInColombia: [
        { snake: "Bothrópico (Bothrops / Mapaná)", freq: "90 - 95%", clinic: "Proteolítico, coagulante, hemorrágico y miotóxico local. Edema masivo, flictenas, necrosis e incoagulabilidad." },
        { snake: "Crotálico (Crotalus / Cascabel)", freq: "1 - 3%", clinic: "Neurotóxico, miotóxico sistémico. Facies miasténica de Rosenfeld (ptosis palpebral), oftalmoplejía, rabdomiólisis y orina oscura (mioglobinuria)." },
        { snake: "Lachésico (Lachesis / Verrugoso)", freq: "1 - 2%", clinic: "Similar a Bothrops más estimulación vagal intensa: bradicardia, hipotensión severa, dolor abdominal y diarrea coleriforme." },
        { snake: "Micrúrico (Micrurus / Coral)", freq: "1 - 2%", clinic: "Neurotoxicidad postsináptica pura sin lesión local: ptosis, sialorrea, disfonía, parálisis diafragmática y paro respiratorio rápido." }
      ],
      symptoms: [
        "Marcas de colmillos (1 o 2 punciones visibles con sangrado o exudado serosanguinolento)",
        "Dolor intenso de aparición inmediata",
        "Edema progresivo que supera articulaciones adyacentes",
        "Equimosis, bulas/flictenas con contenido hemático",
        "Sangrado a distancia: gingivorragia, hematuria, hemoptisis, sangrado en sitios de venopunción"
      ],
      redFlags: [
        "Avance rápido del edema (> 10 cm en 2 horas o compromiso de tronco)",
        "Incoagulabilidad sanguínea persistente",
        "Oliguria o anuria (riesgo inminente de Necrosis Tubular Aguda)",
        "Hipotensión arterial, taquicardia o signos francos de choque",
        "Ptosis palpebral, disfagia o dificultad respiratoria (bloqueo neuromuscular)",
        "Síndrome compartimental (extremidad a tensión, palidez distal, pérdida de pulsos)"
      ],
      diagnosis: {
        ruralContext: "El pilar diagnóstico en el centro de salud de primer nivel es la Prueba del Todo o Nada (Prueba del tubo / 20 minutos).",
        tests: [
          "Prueba de coagulación en tubo (Lee-White modificado 20 min): Extraer 3-5 mL de sangre venosa sin anticoagulante en tubo de vidrio seco. Dejar en reposo vertical 20 min a temperatura ambiente. Invertir el tubo suavemente a 90°: si la sangre fluye libremente = INCOAGULABILIDAD CONFIRMADA (indica consumo de fibrinógeno).",
          "Medición perimétrica del miembro con cinta métrica cada 2 horas (marcar el avance del edema con marcador indeleble).",
          "Inspección de orina en cada micción: color rojo/pardo (hematuria vs mioglobinuria).",
          "Hemoleucograma, TP, TPT, Creatinina y Parcial de Orina si se cuenta con laboratorio."
        ],
        severityClassification: "1. Leve: Edema local en un segmento del miembro, sin sangrado a distancia, sangre coagula o no.\n2. Moderado: Edema en dos o más segmentos del miembro, dolor moderado, incoagulabilidad sanguínea, sangrado local activo o gingivorragia leve.\n3. Grave: Edema extenso que compromete raíz de miembro o tronco, sangrado sistémico masivo, choque, falla renal o parálisis respiratoria."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero (Acciones Críticas Inmediatas)",
        steps: [
          {
            order: 1,
            action: "Retirar Objetos Constrictivos e Inmovilizar",
            detail: "Retirar inmediatamente anillos, pulseras, relojes o calzado ajustado. Inmovilizar la extremidad con férula suave a la altura del corazón (disminuye absorción linfática). Reposo absoluto del paciente."
          },
          {
            order: 2,
            action: "Acceso Venoso y Reanimación Hídrica",
            detail: "Canalizar vena periférica en la extremidad SANA con catéter grueso. Iniciar infusión de Lactato de Ringer a 10-15 mL/kg/h para garantizar gasto urinario > 1-2 mL/kg/h (previene taponamiento renal por mioglobina/hemoglobina)."
          },
          {
            order: 3,
            action: "Realizar Prueba de Tubo de 20 Minutos",
            detail: "Extraer sangre de inmediato para verificar estado de coagulación antes de administrar el suero."
          },
          {
            order: 4,
            action: "Preparar y Administrar Suero Antiofídico Polivalente (INS o Probiol)",
            detail: "NO realizar prueba de sensibilidad cutánea (no predice anafilaxia y retrasa el tratamiento). Tener lista adrenalina 1:1.000 ampolla ante posible choque anafiláctico."
          },
          {
            order: 5,
            action: "Analgesia y Profilaxis",
            detail: "Analgesia con acetaminofén o tramadol/dipirona. Administrar toxoide tetánico (profilaxis antitetánica) una vez corregida la coagulopatía."
          }
        ],
        warnings: [
          "¡NUNCA APLICAR TORNIQUETES! Aumenta la isquemia tisular, promueve necrosis masiva y precipita amputaciones.",
          "¡PROHIBIDO REALIZAR CORTES, INCISIONES O SUCCIÓN CON LA BOCA! Introduce flora oral virulenta e incrementa hemorragia.",
          "¡PROHIBIDO APLICAR HIELO, QUEROSENO, HIERBAS O QUÍMICOS EN LA HERIDA!",
          "¡CONTRAINDICADOS AINEs Y ASPIRINA por agravar el defecto plaquetario y de coagulación!"
        ]
      },
      treatment: {
        antivenomDosing: "Dosificación de Suero Antiofídico Polivalente INS (tanto en niños como adultos la dosis de suero es IGUAL, porque neutraliza la cantidad de veneno inoculado):\n• Bothrópico Leve: 2 a 4 ampollas IV diluidas en 250 mL SSN a pasar en 30-60 minutos.\n• Bothrópico Moderado: 4 a 8 ampollas IV en 250 mL SSN en 60 minutos.\n• Bothrópico Grave / Crotálico / Lachésico: 8 a 12 ampollas IV en 250-500 mL SSN.\n• Envenenamiento Micrúrico (Coral): 2 a 4 ampollas de suero anticoral específico.",
        followUp: "Repetir prueba de coagulación en tubo a las 6 y 12 horas pos-infusión del suero. Si la sangre sigue incoagulable a las 6 horas, administrar dosis adicional de 2 a 4 ampollas de suero antiofídico.",
        antibiotics: "Antibioticoterapia solo si hay signos francos de infección secundaria sobreagregada (absceso, celulitis purulenta tras 24-48h): Ampicilina/Sulbactam o Ciprofloxacino + Clindamicina."
      }
    },
    {
      id: "malaria",
      name: "Malaria / Paludismo (P. vivax, P. falciparum)",
      shortName: "Malaria",
      category: "infecciosas",
      categoryLabel: "Infecciosas / Parasitarias",
      urgencyLevel: "alta",
      sivigila: {
        code: "465 / 470 / 475",
        type: "inmediata_condicional",
        periodicity: "Inmediata en Malaria Complicada (475) / Semanal en No Complicada (465/470)",
        priorityBadge: "SIVIGILA 465/470/475",
        isImmediate: true,
        subtypes: [
          { name: "Malaria por P. vivax", code: "465", period: "Semanal" },
          { name: "Malaria por P. falciparum", code: "470", period: "Semanal" },
          { name: "Malaria Complicada y Muertes", code: "475", period: "Inmediata (< 24 horas)" }
        ]
      },
      triad: {
        title: "Tríada Paroxística Clásica del Paludismo",
        components: [
          "Escalofríos intensos y castañeo incontrolable de dientes (15 a 60 min)",
          "Fiebre muy alta en espiga (39 - 41 °C) con cefalea y mialgias (2 a 6 horas)",
          "Diaforesis profusa con caída rápida de la temperatura, fatiga y somnolencia (2 a 4 horas)"
        ],
        alertText: "En zonas endémicas, ¡todo síndrome febril agudo sin causa evidente es malaria hasta demostrar lo contrario! Realizar gota gruesa de inmediato."
      },
      definition: "Enfermedad parasitaria transmitida por la picadura de mosquitos hembra del género Anopheles infectados por plasmodios. En Colombia predominan Plasmodium vivax (60-70%) y Plasmodium falciparum (30-40%), con focos en la costa Pacífica, Urabá-Bajo Cauca y Amazonía-Orinoquía.",
      epidemiology: "Frecuente en zonas mineras, madereras, selváticas y rurales de Colombia por debajo de los 1.600 msnm. Región Pacífica (Chocó, Nariño, Valle, Cauca) concentra la mayor carga y casos de falciparum.",
      symptoms: [
        "Paroxismos febriles periódicos (cada 48 horas en vivax/falciparum)",
        "Cefalea holocraneana pulsátil intensa",
        "Sudoración nocturna y astenia marcada",
        "Náuseas, vómito y dolor epigástrico",
        "Palidez cutaneomucosa progresiva por hemólisis",
        "Esplenomegalia y hepatomegalia palpable"
      ],
      redFlags: [
        "Alteración del estado de conciencia, somnolencia, convulsiones o coma (Malaria Cerebral)",
        "Ictericia franca en escleras y piel con coluria",
        "Dificultad respiratoria, taquipnea o edema pulmonar no cardiogénico",
        "Anemia severa (Hb < 7 g/dL o hematocrito < 20%)",
        "Oliguria (< 0.5 mL/kg/h) con creatinina elevada (falla renal aguda)",
        "Hemoglobinuria (orina oscura color 'coca-cola')",
        "Hipotensión severa o llenado capilar > 3 segundos (síndrome de choque álgido)",
        "Hipoglicemia (< 60 mg/dL), especialmente en niños y gestantes"
      ],
      diagnosis: {
        ruralContext: "El estándar de oro en puestos de salud y centros de primer nivel es la Gota Gruesa y Frotis de Sangre Periférica leída por microscopía, o Prueba de Diagnóstico Rápido (PDR).",
        tests: [
          "Gota Gruesa (tinción Field o Giemsa): Determina especie (vivax vs falciparum) y parasitemia (parásitos/μL o cruces +/++++). Si resulta negativa pero persiste sospecha, repetir cada 12-24 horas hasta completar 3 muestras consecutivas.",
          "Pruebas de Diagnóstico Rápido (PDR): Inmunocromatografía para antígenos PfHRP2 (específico para falciparum) y pLDH (panmalárico). Útiles si no hay microscopista en el turno.",
          "Hemoglobina/Hematocrito y Glucometría rápida (descartar hipoglicemia en todo paciente con somnolencia)."
        ],
        classificationCriteria: "No complicada: Gota gruesa positiva sin signos de disfunción orgánica ni intolerancia a la vía oral.\nComplicada: Presencia de cualquiera de los criterios de gravedad de la OMS/INS o hiperparasitemia (> 50.000 parásitos/μL o > 2% de eritrocitos infectados)."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero en Malaria",
        steps: [
          {
            order: 1,
            action: "Confirmación Parasitológica Rápida",
            detail: "Tomar inmediatamente muestra para gota gruesa o PDR. ¡No retrasar la prueba si el paciente tiene fiebre en el momento de la consulta!"
          },
          {
            order: 2,
            action: "Descarte de Criterios de Gravedad",
            detail: "Verificar inmediatamente estado de alerta (Escala Glasgow), realizar glucometría capilar y evaluar coloración de conjuntivas e ictericia."
          },
          {
            order: 3,
            action: "Acción en Malaria Complicada (Emergencia Médica)",
            detail: "Canalizar vía venosa. Si hay hipoglicemia (< 60 mg/dL), administrar bolo de Dextrosa al 10% (2-4 mL/kg en niños o 100 mL de DAD 10% en adultos). Iniciar inmediatamente Artemesunato IV 2.4 mg/kg (al minuto 0, a las 12h y 24h) o Arteméter IM. Organizar remisión inmediata con médico a segundo nivel."
          },
          {
            order: 4,
            action: "Suministro Supervisado de Antimaláricos",
            detail: "En malaria no complicada, la primera dosis de tratamiento debe ser administrada y observada directamente en el centro de salud (Tratamiento Directamente Observado - TDO)."
          }
        ],
        warnings: [
          "¡NUNCA administrar Primaquina en mujeres embarazadas ni en menores de 6 meses por riesgo de hemólisis fetal/neonatal severa!",
          "¡No utilizar cloroquina como monoterapia en P. falciparum por resistencia casi universal en Colombia!",
          "La hipoglicemia puede simular coma malárico o empeorar el daño neurológico: medir glicemia en todo paciente alterado."
        ]
      },
      treatment: {
        vivaxScheme: "Tratamiento P. vivax no complicada (Colombia):\n• Cloroquina Fosfato: Total 25 mg base/kg en 3 días (Día 1: 10 mg/kg; Día 2: 7.5 mg/kg; Día 3: 7.5 mg/kg).\n• Primaquina: 0.25 a 0.50 mg base/kg/día por 14 días consecutivos (elimina hipnozoítos en hígado y previene recaídas). Administrar con alimentos.",
        falciparumScheme: "Tratamiento P. falciparum no complicada (Primera línea Colombia):\n• Arteméter + Lumefantrina (Coartem tabletas 20/120 mg): Régimen de 6 dosis repartidas en 3 días (Horas 0, 8, 24, 36, 48 y 60). Administrar estrictamente con alimentos grasos (leche, comida) para asegurar absorción.\n• Primaquina gametocitocida: Dosis única de 0.75 mg/kg el Día 1 (esteriliza gametocitos para cortar transmisión en la comunidad).",
        complicatedScheme: "Malaria Complicada (Cualquier especie):\n• Artemesunato IV: 2.4 mg/kg IV al ingreso (0h), a las 12h, a las 24h y luego cada 24h hasta tolerar vía oral (mínimo 3 dosis parenterales). Al tolerar VO, completar ciclo completo con Arteméter/Lumefantrina por 3 días."
      }
    },
    {
      id: "tuberculosis",
      name: "Tuberculosis Pulmonar y Extrapulmonar (Mycobacterium tuberculosis)",
      shortName: "Tuberculosis (TB)",
      category: "infecciosas",
      categoryLabel: "Infecciosas / Respiratorias",
      urgencyLevel: "media",
      sivigila: {
        code: "813 / 815",
        type: "semanal",
        periodicity: "Notificación Semanal Obligatoria (INS 813)",
        priorityBadge: "SIVIGILA 813",
        isImmediate: false
      },
      triad: {
        title: "Tríada Constitucional Clásica de Tuberculosis",
        components: [
          "Pérdida involuntaria y progresiva de peso",
          "Diaforesis y sudoración nocturna profusa (que obliga a cambiar de ropa de cama)",
          "Febrícula de predominio vespertino/nocturno de semanas de evolución"
        ],
        alertText: "Regla de oro de salud pública: Todo paciente con tos y expectoración por más de 15 días es un Sintomático Respiratorio y amerita baciloscopia seriada de esputo."
      },
      definition: "Infección bacteriana crónica causada por el bacilo ácido-alcohol resistente Mycobacterium tuberculosis (Bacilo de Koch). Se transmite por vía aérea mediante microgotas que contienen bacilos expulsadas por pacientes bacilíferos al toser, hablar o estornudar.",
      epidemiology: "Problema prioritario de salud pública en Colombia, con alta prevalencia en comunidades indígenas, personas privadas de la libertad, habitantes de calle y pacientes con VIH/desnutrición.",
      symptoms: [
        "Tos productiva con expectoración mucopurulenta por más de 15 días",
        "Hemoptisis o esputo hemoptoico (estrías de sangre en flemas)",
        "Dolor torácico de características pleuríticas",
        "Astenia, adinamia y anorexia progresiva",
        "Disnea progresiva en enfermedad avanzada"
      ],
      redFlags: [
        "Hemoptisis masiva (> 200-500 mL en 24h o asfixia inminente)",
        "Disnea de reposo con estridor o cianosis",
        "Signos meníngeos (rigidez de nuca, vómito en proyectil, parálisis de pares craneales) = TB Meníngea",
        "Coinfección con VIH confirmada o sospechosa",
        "Deterioro marcado del estado nutricional (caquexia severa)"
      ],
      diagnosis: {
        ruralContext: "El diagnóstico de base en el primer nivel rural reposa en la Baciloscopia Seriada de Esputo teñida con Ziehl-Neelsen y el envío a nodo de referencia para GeneXpert MTB/RIF.",
        tests: [
          "Baciloscopia de esputo seriada (mínimo 2 muestras): Muestra 1 en el momento de la consulta (in situ); Muestra 2 al despertar al día siguiente en ayunas.",
          "Prueba molecular rápida (GeneXpert MTB/RIF): Detecta ADN de M. tuberculosis y resistencia a Rifampicina en menos de 2 horas. Solicitud obligatoria según guía colombiana.",
          "Radiografía de tórax (si hay equipo en el hospital): Infiltrados apicales, cavitaciones fibrocaseosas, patrón miliar o derrame pleural.",
          "Prueba de tamizaje de VIH obligatoria en todo paciente con diagnóstico de TB presuntivo o confirmado."
        ],
        classificationCriteria: "• Sintomático Respiratorio: Tos y flemas > 15 días.\n• TB Pulmonar Bacteriológicamente Confirmada: Baciloscopia o GeneXpert positiva.\n• TB Pulmonar Clínicamente Diagnosticada: Criterio clínico + radiológico + epidemiológico con baciloscopia negativa.\n• TB Extrapulmonar: Pleural, ganglionar, meníngea, osteoarticular (Mal de Pott)."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero en Tuberculosis",
        steps: [
          {
            order: 1,
            action: "Bioseguridad y Control de Infecciones Aéreas",
            detail: "Colocar de inmediato mascarilla quirúrgica simple al paciente sintomático respiratorio. El personal de salud debe usar respirador de alta eficiencia N95 bien ajustado. Ubicar en área ventilada."
          },
          {
            order: 2,
            action: "Toma Inmediata de Primera Muestra de Esputo",
            detail: "Indicar al paciente toser con fuerza en área abierta y bien ventilada (o cabina de esputo) recolectando la primera muestra en frasco estéril de boca ancha debidamente rotulado."
          },
          {
            order: 3,
            action: "Ingreso al Libro de Registro de Sintomáticos Respiratorios",
            detail: "Anotar en el libro oficial del programa de tuberculosis para seguimiento epidemiológico institucional."
          },
          {
            order: 4,
            action: "Descarte de Urgencia (Hemoptisis Amenazante)",
            detail: "Si hay hemoptisis masiva: decúbito lateral sobre el hemitórax presuntamente afectado (evita inundación del pulmón contralateral sano), oxígeno alto flujo, canalización venosa y remisión inmediata."
          }
        ],
        warnings: [
          "¡NUNCA prescribir quinolonas (levofloxacino, moxifloxacino) empíricamente a un paciente con tos crónica sin antes descartar TB, ya que enmascara los cultivos y genera resistencia cruzada!",
          "¡No iniciar tratamiento con monoterapia bajo ninguna circunstancia!",
          "La supervisión del tratamiento debe ser 100% observada (DOTS) para evitar generación de cepas MDR (multidrogorresistentes)."
        ]
      },
      treatment: {
        firstLineScheme: "Esquema Tetraconjugado en Dosis Fijas Combinadas (Adultos - Primera Línea Colombia):\n• Fase Intensiva (2 meses - 56 dosis continuas, de lunes a sábado):\n  - 4 fármacos combinados (Rifampicina 150 mg + Isoniazida 75 mg + Pirazinamida 400 mg + Etambutol 275 mg) en tabletas según peso:\n    * 30 - 39 kg: 2 tabletas/día\n    * 40 - 54 kg: 3 tabletas/día\n    * ≥ 55 kg: 4 tabletas/día\n• Fase de Mantenimiento (4 meses - 112 dosis continuas, de lunes a sábado):\n  - 2 fármacos (Rifampicina 150 mg + Isoniazida 75 mg) en tabletas según peso.\n• Duración total: 6 meses.",
        monitoring: "Control de baciloscopia mensual a partir del segundo mes de tratamiento para verificar negativización bacteriológica. Evaluación de función hepática si hay ictericia o vómito."
      }
    },
    {
      id: "varicela",
      name: "Varicela y Complicaciones (Virus Varicela-Zóster - VVZ)",
      shortName: "Varicela",
      category: "infecciosas",
      categoryLabel: "Infecciosas / Exantemáticas",
      urgencyLevel: "media",
      sivigila: {
        code: "831",
        type: "inmediata_condicional",
        periodicity: "Inmediata (< 24h) en Brotes (≥ 3 casos) o Muertes / Semanal en casos aislados",
        priorityBadge: "SIVIGILA 831",
        isImmediate: false,
        subtypes: [
          { name: "Varicela Caso Individual", code: "831", period: "Semanal" },
          { name: "Brote de Varicela (≥ 3 casos relacionados)", code: "831", period: "Inmediata (< 24 horas)" }
        ]
      },
      triad: {
        title: "Tétrada Exantemática Clásica ('Cielo Estrellado')",
        components: [
          "Evolución centrífuga polimórfica (mácula → pápula → vesícula → pústula → costra)",
          "Vesículas con contenido líquido claro sobre base eritematosa ('Gota de rocío sobre pétalo de rosa')",
          "Presencia simultánea de TODOS los estadios lesionales en la misma región corporal",
          "Prurito intenso y generalizado con afectación habitual de cuero cabelludo y mucosas"
        ],
        alertText: "¡La persona es contagiosa desde 1-2 días antes de la erupción hasta que TODAS las vesículas se han convertido en costras secas!"
      },
      definition: "Infección viral primaria, aguda y altamente contagiosa producida por el Virus Varicela-Zóster (Herpesvirus tipo 3 humano). Presenta un período de incubación típico de 10 a 21 días (promedio 14-16 días).",
      epidemiology: "Afecta predominantemente a la población pediátrica, pero en adultos, adolescentes no inmunizados, embarazadas e inmunocomprometidos tiene un curso mucho más tórpido y potencialmente mortal.",
      symptoms: [
        "Pródromos (1-2 días antes): Fiebre moderada, malestar general, dolor de garganta y anorexia",
        "Exantema pruriginoso que inicia en cuero cabelludo, cara y tronco, extendiéndose a extremidades",
        "Vesículas umbilicadas que se rompen con facilidad",
        "Lesiones ulcerosas en mucosa oral, conjuntival o genital",
        "Linfadenopatías cervicales y suboccipitales dolorosas"
      ],
      redFlags: [
        "Fiebre alta persistente o recurrente después del 4.° día de inicio del exantema",
        "Eritema circundante extenso, calor, dolor desproporcionado o exudado purulento en las lesiones (Sobreinfección bacteriana / Celulitis / Fascitis)",
        "Dificultad respiratoria, taquipnea, tos seca o dolor torácico (Neumonía Varicelosa - letal en adultos y gestantes)",
        "Inestabilidad en la marcha, ataxia, letargo, rigidez de nuca o convulsiones (Cerebelitis / Encefalitis)",
        "Lesiones purpúricas, hemorragias mucosas o sangrado digestivo (Varicela Hemorrágica)",
        "Mujer embarazada en cualquier trimestre (riesgo de Varicela Congénita o Perinatal)"
      ],
      diagnosis: {
        ruralContext: "El diagnóstico en el primer nivel es fundamentalmente CLÍNICO gracias al patrón patognomónico de lesiones polimórficas.",
        tests: [
          "Inspección clínica minuciosa buscando signos de sobreinfección bacteriana secundaria.",
          "Frotis de Tzanck (si se dispone de laboratorio con tinción Wright/Giemsa): Muestra células gigantes multinucleadas con inclusiones intranucleares.",
          "Oximetría de pulso obligatoria en adolescentes y adultos para descartar compromiso pulmonar subclínico."
        ],
        classificationCriteria: "• Varicela no complicada: Paciente pediátrico previamente sano sin signos de sobreinfección ni compromiso sistémico.\n• Varicela complicada: Con sobreinfección bacteriana de tejidos blandos, neumonía, compromiso neurológico, trombocitopenia o en población de alto riesgo."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero en Varicela",
        steps: [
          {
            order: 1,
            action: "Aislamiento y Bioseguridad",
            detail: "Aislamiento inmediato por vía respiratoria y de contacto en el centro de salud. Indicar aislamiento estricto domiciliario hasta que la última lesión esté en fase de costra seca (aprox. 7 a 10 días)."
          },
          {
            order: 2,
            action: "Manejo del Prurito y Prevención de Rascado",
            detail: "Corte y limpieza estricta de uñas. Baños diarios con agua templada y jabón neutro sin frotar. Antihistamínicos orales no sedantes o sedantes según edad (ej. Loratadina o Hidroxicina nocturna). Aplicación de loción de calamina (evitar sobre heridas abiertas)."
          },
          {
            order: 3,
            action: "Control Térmico Seguro",
            detail: "Uso exclusivo de Acetaminofén a dosis estándar (10-15 mg/kg cada 6 horas en niños; 500-1.000 mg cada 6h en adultos). Medios físicos."
          },
          {
            order: 4,
            action: "Identificación de Población Tributaria de Antiviral Rápido",
            detail: "Si es adulto, paciente con enfermedad cutánea crónica (ej. dermatitis atópica), neumópata crónico o gestante: considerar inicio de Aciclovir dentro de las primeras 24-72h de exantema."
          }
        ],
        warnings: [
          "¡ABSOLUTAMENTE CONTRAINDICADO EL IBUPROFENO Y OTROS AINEs! Se asocian fuertemente con el desarrollo de infecciones bacterianas invasivas severas de piel por Streptococcus pyogenes (Fascitis Necrosante potencialmente mortal).",
          "¡ABSOLUTAMENTE CONTRAINDICADA LA ASPIRINA (Ácido Acetilsalicílico) por riesgo de Síndrome de Reye (encefalopatía aguda y degeneración grasa hepática masiva con alta mortalidad)!"
        ]
      },
      treatment: {
        symptomatic: "Tratamiento de soporte en casos no complicados:\n• Higiene cutánea con agua y jabón antiséptico suave.\n• Acetaminofén para la fiebre.\n• Antihistamínicos orales de primera o segunda línea para el prurito.\n• Adecuada ingesta de líquidos orales.",
        antiviralScheme: "Antiviral (Aciclovir) - Indicado en > 12 años, casos secundarios intradomiciliarios, o pacientes de riesgo:\n• Adultos y adolescentes: Aciclovir 800 mg vía oral 5 veces al día (cada 4 horas omitiendo la dosis nocturna) durante 7 días continuos.\n• Niños de riesgo (> 2 años): 20 mg/kg/dosis (máximo 800 mg por dosis) 4 veces al día por 5 a 7 días.\n• Debe iniciarse idealmente en las primeras 24 a 72 horas del brote.",
        bacterialSuperinfection: "Sobreinfección bacteriana secundaria (celulitis, impétigo):\n• Cefalexina 50-100 mg/kg/día en 4 tomas o Oxacilina IV si requiere hospitalización por riesgo de estafilococo/estreptococo."
      }
    },
    {
      id: "pep-vih",
      name: "Profilaxis Post-Exposición al VIH (PEP Ocupacional y No Ocupacional)",
      shortName: "VIH / Profilaxis PEP",
      category: "urgencias",
      categoryLabel: "Urgencias / Prevención Infecciosa",
      urgencyLevel: "critica",
      sivigila: {
        code: "850 / 453",
        type: "semanal",
        periodicity: "Notificación Semanal (INS 850) / Notificación Inmediata en Violencia Sexual (INS 453)",
        priorityBadge: "SIVIGILA 850/453",
        isImmediate: false
      },
      triad: {
        title: "Tríada de Intervención Crítica en la Exposición al VIH",
        components: [
          "Ventana de oportunidad ultrarrápida: Idealmente < 2 horas, ventana máxima hasta 72 horas",
          "Evaluación de riesgo: Tipo de fluido (sangre, semen, fluidos con sangre) y vía (percutánea, mucosa, abuso sexual)",
          "Esquema de triple terapia antirretroviral completa durante 28 días calendario ininterrumpidos"
        ],
        alertText: "¡La profilaxis post-exposición pierde casi toda su efectividad si se inicia después de 72 horas del contacto! Cada hora de demora cuenta."
      },
      definition: "Conjunto de intervenciones clínicas y administración de medicamentos antirretrovirales a personas que han tenido una exposición de riesgo biológico (accidente laboral por pinchazo/salpicadura o exposición no laboral/violencia sexual) para prevenir la infección por el Virus de la Inmunodeficiencia Humana (VIH).",
      epidemiology: "Frecuente en médicos rurales por accidentes biológicos en urgencias (pinchazos con agujas huecas en suturas o venopunciones nocturnas) y atención de víctimas de agresión sexual en el contexto rural.",
      exposureTypes: [
        { type: "Ocupacional", desc: "Pinchazo con aguja con sangre, corte con bisturí o contacto de mucosas/piel no intacta con fluidos corporales de alto riesgo." },
        { type: "No Ocupacional (Consentida)", desc: "Relación sexual no protegida con persona VIH positiva o de estatus desconocido con alto riesgo." },
        { type: "Violencia Sexual", desc: "Urgencia médica integral (Código Rosa): anticoncepción de emergencia, profilaxis para ITS bacterianas, hepatitis B y VIH." }
      ],
      symptoms: [
        "Asintomático al momento de la exposición (es una urgencia preventiva)",
        "Infección aguda primaria (Síndrome Retroviral Agudo - semanas después si no hubo profilaxis): Fiebre, faringitis, linfadenopatías difusas, exantema maculopapular y mialgias"
      ],
      redFlags: [
        "Exposición de alto riesgo con aguja hueca con sangre fresca directamente en vaso sanguíneo",
        "Fuente conocida con carga viral detectable de VIH no suprimida o sin tratamiento",
        "Paciente que acude cerca del límite de las 72 horas",
        "Víctima de agresión sexual con desgarro mucoso o sangrado activo",
        "Ausencia de vacunas previas contra Hepatitis B en el trabajador expuesto"
      ],
      diagnosis: {
        ruralContext: "En el primer nivel se aplican Pruebas Rápidas de Tercera o Cuarta Generación para VIH.",
        tests: [
          "Prueba Rápida de VIH a la persona expuesta en el Minuto Cero: DEBE SER NEGATIVA basal para que califique a PEP (si es positiva, ya estaba previamente infectado y requiere ingreso a programa crónico, no PEP).",
          "Prueba Rápida de VIH a la persona fuente (si está identificada y otorga consentimiento informado voluntario). Si la fuente es negativa confirmada, se suspende la PEP.",
          "Prueba rápida de Hepatitis B (HBsAg) y Hepatitis C (Anti-VHC).",
          "Prueba rápida de embarazo en mujeres en edad fértil.",
          "Pruebas de función renal (creatinina) y hemograma basal."
        ],
        classificationCriteria: "Exposición significativa: Sangre, semen, secreciones vaginales, LCR, líquido pleural/amniótico en contacto con tejido subcutáneo, herida abierta o mucosas.\nExposición NO significativa: Saliva sin sangre, lágrimas, sudor, heces, orina sobre piel intacta (no amerita PEP)."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero en Accidente Biológico / Exposición",
        steps: [
          {
            order: 1,
            action: "Primeros Auxilios Locales Inmediatos",
            detail: "Lavar profusamente con agua y jabón la zona de punción o corte durante varios minutos. Si es salpicadura en ojos o mucosas, irrigar con solución salina estéril o agua corriente por 15 minutos."
          },
          {
            order: 2,
            action: "¡PROHIBICIONES ESTRICTAS EN LA HERIDA!",
            detail: "NO exprimir ni apretar la herida mecánicamente (provoca microtraumatismos que facilitan la entrada viral a capilares). NO usar hipoclorito, alcohol ni cáusticos irritantes."
          },
          {
            order: 3,
            action: "Tamizaje Rápido Basal",
            detail: "Realizar de inmediato prueba rápida de VIH al expuesto con asesoría pre-test. Registrar hora exacta del evento y hora de inicio de atención."
          },
          {
            order: 4,
            action: "Iniciar Primera Dosis de Antirretrovirales SIN ESPERAR",
            detail: "Si la exposición ocurrió hace menos de 72 horas y el expuesto es VIH negativo en la prueba rápida, suministrar inmediatamente la primera dosis del esquema PEP desde el stock de urgencias."
          },
          {
            order: 5,
            action: "Profilaxis Adicional Integral",
            detail: "En violencia sexual: Anticoncepción de emergencia (Levonorgestrel 1.5 mg DU VO), profilaxis ITS (Ceftriaxona 500 mg IM DU + Azitromicina 1 g VO DU + Metronidazol 2 g VO DU). En accidente laboral: vacuna o inmunoglobulina anti-hepatitis B si no tiene esquema completo."
          }
        ],
        warnings: [
          "¡NO esperar resultados de confirmación ni autorización de aseguradora para entregar la primera dosis de antirretrovirales en urgencias!",
          "La adherencia al tratamiento debe ser del 100% durante los 28 días completos para garantizar la eficacia preventiva."
        ]
      },
      treatment: {
        firstLineScheme: "Esquema Estándar PEP Colombia (28 días calendario ininterrumpidos):\n• Tenofovir Disoproxil Fumarato (TDF) 300 mg + Emtricitabina (FTC) 200 mg (1 tableta combinada cada 24 horas)\n  MÁS\n• Dolutegravir (DTG) 50 mg (1 tableta cada 24 horas)\n\nAlternativa si no hay Dolutegravir: TDF/FTC más Raltegravir 400 mg cada 12 horas o Lopinavir/Ritonavir 400/100 mg cada 12 horas.",
        monitoringFollowUp: "Seguimiento serológico con prueba de VIH a las 6 semanas, 3 meses y 6 meses post-exposición. Uso de preservativo en todas las relaciones sexuales durante el período de seguimiento."
      }
    },
    {
      id: "irag",
      name: "Infección Respiratoria Aguda Grave (IRAG / Bronquiolitis Rural)",
      shortName: "IRAG / Bronquiolitis",
      category: "urgencias",
      categoryLabel: "Urgencias / Respiratorias",
      urgencyLevel: "alta",
      sivigila: {
        code: "345 / 348",
        type: "inmediata_condicional",
        periodicity: "Inmediata (< 24h) en IRAG Inusitado (345) / Semanal en IRAG Común (348)",
        priorityBadge: "SIVIGILA 345/348",
        isImmediate: true,
        subtypes: [
          { name: "IRAG Inusitado / Sospecha Nuevo Virus", code: "345", period: "Inmediata (< 24 horas)" },
          { name: "IRAG / Bronquiolitis / Neumonía Grave", code: "348", period: "Semanal" }
        ]
      },
      triad: {
        title: "Tríada de Dificultad Respiratoria y Falla Ventilatoria",
        components: [
          "Fiebre aguda (≥ 38 °C) de inicio súbito con tos",
          "Tirajes subcostales e intercostales marcados y aleteo nasal",
          "Taquipnea marcada para la edad y saturación de oxígeno limítrofe o caída"
        ],
        alertText: "Frecuencias respiratorias de corte para Taquipnea: < 2 meses: ≥ 60 rpm | 2 - 11 meses: ≥ 50 rpm | 1 - 5 años: ≥ 40 rpm | > 5 años y adultos: ≥ 24-28 rpm."
      },
      definition: "Cuadro infeccioso agudo del tracto respiratorio con compromiso parenquimatoso o bronquiolar que genera dificultad respiratoria severa y requiere hospitalización inmediata o soporte de oxígeno.",
      epidemiology: "Primera causa de consulta de urgencias y morbimortalidad infantil en menores de 5 años y ancianos en Colombia, con picos estacionales durante las temporadas de lluvias.",
      symptoms: [
        "Fiebre cuantificada o sensación febril",
        "Tos exigente y congestión nasofaríngea",
        "Taquipnea progresiva",
        "Rechazo al alimento o incapacidad para beber el pecho materno",
        "Estridor inspiratorio o sibilancias espiratorias audibles"
      ],
      redFlags: [
        "Estridor en reposo o quejido espiratorio audible",
        "Cianosis central peribucal o en lechos ungueales",
        "Tirajes universales marcados con cabeceo o disociación toracoabdominal",
        "Somnolencia excesiva, letargia o respuesta lenta a estímulos",
        "Saturación de oxígeno por debajo de metas (< 90% a nivel del mar; < 85% a > 2.500 msnm)",
        "Apneas en lactantes menores"
      ],
      diagnosis: {
        ruralContext: "Evaluación clínica de signos de dificultad respiratoria mediante la estrategia AIEPI y pulsioximetría en urgencias.",
        tests: [
          "Pulsioximetría continua: Evaluar SpO2 antes y después de oxigenoterapia.",
          "Conteo manual de frecuencia respiratoria en 60 segundos completos con el paciente tranquilo.",
          "Radiografía de tórax portátil o básica: Infiltrados de condensación lobar, broncograma aéreo o hiperinsuflación.",
          "Hemoleucograma y PCR si se cuenta con laboratorio rural."
        ],
        classificationCriteria: "• Neumonía sin signos de gravedad: Taquipnea sin tirajes severos, tolera VO (manejo ambulatorio con amoxicilina).\n• Neumonía Grave / IRAG: Presencia de tirajes subcostales, cianosis, hipoxemia o incapacidad para beber (hospitalización/remisión).\n• Bronquiolitis: Primer episodio de sibilancias en menor de 2 años precedido de rinitis."
      },
      zeroMinute: {
        title: "Protocolo Minuto Cero en IRAG / Dificultad Respiratoria",
        steps: [
          {
            order: 1,
            action: "Posición y Permeabilización de Vía Aérea",
            detail: "Posición semisentada (30-45°) o en brazos de la madre. Aspiración suave de secreciones nasales con solución salina normal si hay obstrucción por moco."
          },
          {
            order: 2,
            action: "Oxigenoterapia Inmediata",
            detail: "Iniciar oxígeno suplementario por cánula nasal a 1-2 L/min o máscara con reservorio si la hipoxemia es severa. Meta: SpO2 ≥ 90-92% (o ≥ 88% en altitud andina)."
          },
          {
            order: 3,
            action: "Manejo del Broncoespasmo (Prueba Terapéutica)",
            detail: "Si hay sibilancias marcadas en mayores de 6 meses o sospecha de crisis asmática: Salbutamol inhalador de dosis medida con aerocámara, 2 a 4 puff cada 20 minutos por 3 ciclos (primera hora) y reevaluar."
          },
          {
            order: 4,
            action: "Mantenimiento Hidroelectrolítico",
            detail: "Si la frecuencia respiratoria es > 60-70 rpm, suspender vía oral por riesgo de broncoaspiración. Canalizar acceso venoso e infundir líquidos de mantenimiento (Dextrosa al 5% en SSN)."
          },
          {
            order: 5,
            action: "Inicio Precoz de Antibiótico si es Bacteriana",
            detail: "En neumonía grave sospechada: administrar primera dosis parenteral de Ampicilina (50 mg/kg IV) o Penicilina Cristalina antes de trasladar al paciente."
          }
        ],
        warnings: [
          "¡NO administrar sedantes ni antitusígenos a pacientes con dificultad respiratoria!",
          "Evitar sobrehidratación en bronquiolitis y neumonías graves.",
          "No retrasar la remisión médica si hay quejido o cianosis refractaria a oxígeno."
        ]
      },
      treatment: {
        outpatientPneumonia: "Neumonía no grave (Manejo ambulatorio en niños):\n• Amoxicilina oral: 80 a 90 mg/kg/día divididos en 2 o 3 tomas por 5 a 7 días.\n• Citar a control obligatorio en 48 horas o antes si hay signos de alarma.",
        severePneumoniaHospital: "Neumonía Grave / IRAG en primer nivel (mientras se traslada):\n• Ampicilina 150-200 mg/kg/día IV cada 6 horas más soporte de oxígeno.\n• En adultos: Ampicilina/Sulbactam 1.5 g IV cada 6 horas o Ceftriaxona 1-2 g IV día.",
        bronchiolitisManagement: "Bronquiolitis (Menores de 2 años):\n• Piedra angular: Oxígeno húmedo si SpO2 baja, lavados nasales con SSN y fraccionamiento de tomas de leche. ¡Evitar antibióticos y corticoides de rutina!"
      }
    }
  ];

  // ==========================================================================
  // 2. DIRECTORIO SIVIGILA (INS)
  // ==========================================================================
  const SIVIGILA_EVENTS = [
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
      description: "Casos de dengue con choque por extravasación, hemorragia severa o falla orgánica grave.",
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
      description: "Casos de malaria con manifestaciones de malaria cerebral, falla renal, disfunción respiratoria o ictericia.",
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
      description: "Caso confirmado por gota gruesa o prueba rápida de infección por P. vivax.",
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
      description: "Caso confirmado por gota gruesa o prueba rápida de infección por P. falciparum.",
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
      description: "Casos de IRAG en personas de 5 a 49 años con rápida progresión a falla ventilatoria o patógeno nuevo.",
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
      description: "Caso confirmado bacteriológica o clínicamente de TB.",
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
      description: "Caso de TB con resistencia confirmada a Rifampicina o Isoniazida.",
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
      description: "Conglomerados de 3 o más casos en escuelas o cuarteles, y cualquier defunción.",
      clinicalSheetId: "varicela",
      requiresSpecialForm: true,
      formCode: "INS-Ficha-831"
    },
    {
      code: "850",
      name: "Infección por VIH / SIDA",
      periodicity: "Semanal",
      isImmediate: false,
      timeLimit: "Semanal",
      channel: "Archivo plano semanal",
      description: "Caso confirmado por algoritmo diagnóstico nacional.",
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
      channel: "Inmediato (Ruta Código Rosa)",
      description: "Toda presunta víctima de violencia sexual. Atención Minuto Cero con profilaxis PEP y anticoncepción de emergencia.",
      clinicalSheetId: "pep-vih",
      requiresSpecialForm: true,
      formCode: "INS-Ficha-453"
    },
    {
      code: "220",
      name: "Chagas (Agudo y Congénito)",
      periodicity: "Inmediata",
      isImmediate: true,
      timeLimit: "< 24 horas",
      channel: "Inmediato por canal epidémico",
      description: "Fiebre con signo de Romaña, chagoma o transmisión oral por consumo de alimentos contaminados con triatóminos.",
      clinicalSheetId: null,
      requiresSpecialForm: true,
      formCode: "INS-Ficha-220"
    },
    {
      code: "440",
      name: "Leishmaniasis (Cutánea, Mucosa y Visceral)",
      periodicity: "Semanal (Visceral es Inmediata)",
      isImmediate: false,
      timeLimit: "Semanal",
      channel: "Archivo plano semanal",
      description: "Úlcera cutánea de bordes elevados e indurados (úlcera de chiclero) en área rural endémica.",
      clinicalSheetId: null,
      requiresSpecialForm: true,
      formCode: "INS-Ficha-440"
    },
    {
      code: "650",
      name: "Rabia Humana y Agresiones por Animales (APTR)",
      periodicity: "Inmediata (< 24 horas)",
      isImmediate: true,
      timeLimit: "< 24 horas",
      channel: "Inmediato por teléfono/red",
      description: "Mordeduras o arañazos de murciélagos, zorros o perros no observables.",
      clinicalSheetId: null,
      requiresSpecialForm: true,
      formCode: "INS-Ficha-650"
    }
  ];

  // ==========================================================================
  // 3. STORE DE ALMACENAMIENTO LOCAL (PERSISTENCIA OFFLINE)
  // ==========================================================================
  const STORAGE_KEYS = {
    FAVORITES: "asistente_clinico_favoritos",
    NOTES: "asistente_clinico_notas_v1",
    HISTORY: "asistente_clinico_historial",
    THEME: "asistente_clinico_tema"
  };

  const Store = {
    getFavorites() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },
    isFavorite(id) {
      return this.getFavorites().includes(id);
    },
    toggleFavorite(id) {
      const favs = this.getFavorites();
      const index = favs.indexOf(id);
      let isNowFav = false;
      if (index > -1) {
        favs.splice(index, 1);
        isNowFav = false;
      } else {
        favs.push(id);
        isNowFav = true;
      }
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      } catch (e) {}
      return isNowFav;
    },
    getNote(diseaseId) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
        const allNotes = raw ? JSON.parse(raw) : {};
        return allNotes[diseaseId] || { stock: "", referralContact: "", clinicalNotes: "", updatedAt: null };
      } catch (e) {
        return { stock: "", referralContact: "", clinicalNotes: "", updatedAt: null };
      }
    },
    saveNote(diseaseId, { stock, referralContact, clinicalNotes }) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
        const allNotes = raw ? JSON.parse(raw) : {};
        allNotes[diseaseId] = {
          stock: stock || "",
          referralContact: referralContact || "",
          clinicalNotes: clinicalNotes || "",
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
        return allNotes[diseaseId];
      } catch (e) {
        return null;
      }
    },
    getAllNotes() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    },
    addToHistory(diseaseId) {
      try {
        let history = [];
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (raw) history = JSON.parse(raw);
        history = history.filter(item => item.diseaseId !== diseaseId);
        history.unshift({ diseaseId, timestamp: new Date().toISOString() });
        history = history.slice(0, 10);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      } catch (e) {}
    },
    getTheme() {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (saved) return saved;
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch (e) {
        return "light";
      }
    },
    setTheme(theme) {
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {}
    }
  };

  // ==========================================================================
  // 4. MOTOR DE BÚSQUEDA PREDICTIVA
  // ==========================================================================
  function normalizeText(text) {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  class SearchEngine {
    constructor(diseasesList) {
      this.diseases = diseasesList;
      this.index = this.buildIndex(diseasesList);
    }

    buildIndex(diseasesList) {
      return diseasesList.map(disease => {
        const searchTerms = [
          disease.name,
          disease.shortName,
          disease.category,
          disease.categoryLabel,
          disease.sivigila.code,
          disease.sivigila.priorityBadge,
          disease.triad?.title || "",
          ...(disease.triad?.components || []),
          ...(disease.symptoms || []),
          ...(disease.redFlags || []),
          disease.definition,
          ...(disease.zeroMinute?.steps?.map(s => `${s.action} ${s.detail}`) || [])
        ].join(" ");

        return {
          id: disease.id,
          disease,
          normalizedSearchable: normalizeText(searchTerms),
          normalizedName: normalizeText(disease.name),
          normalizedShortName: normalizeText(disease.shortName),
          normalizedSivigilaCode: normalizeText(disease.sivigila.code)
        };
      });
    }

    search(query, activeFilter = "all") {
      const normQuery = normalizeText(query);
      const favorites = Store.getFavorites();

      let pool = this.index.filter(item => {
        const d = item.disease;
        switch (activeFilter) {
          case "sivigila_inmediato":
            return d.sivigila.isImmediate === true;
          case "urgencias":
            return d.category === "urgencias" || d.urgencyLevel === "critica";
          case "infecciosas":
            return d.category === "infecciosas";
          case "favoritos":
            return favorites.includes(d.id);
          case "all":
          default:
            return true;
        }
      });

      if (!normQuery) {
        return pool.map(item => item.disease);
      }

      const tokens = normQuery.split(/\s+/).filter(t => t.length > 0);
      const results = [];

      for (const item of pool) {
        let score = 0;
        let allTokensMatch = true;

        for (const token of tokens) {
          if (!item.normalizedSearchable.includes(token)) {
            allTokensMatch = false;
            break;
          }
          if (item.normalizedShortName === token) score += 100;
          else if (item.normalizedShortName.startsWith(token)) score += 60;
          else if (item.normalizedName.includes(token)) score += 40;

          if (item.normalizedSivigilaCode.includes(token)) score += 50;
          if (item.disease.triad && normalizeText(item.disease.triad.title).includes(token)) score += 30;
        }

        if (allTokensMatch) {
          score += 10;
          results.push({ disease: item.disease, score });
        }
      }

      results.sort((a, b) => b.score - a.score);
      return results.map(r => r.disease);
    }
  }

  // ==========================================================================
  // 5. CONTROLADOR DE INTERFAZ DE USUARIO
  // ==========================================================================
  const searchEngine = new SearchEngine(DISEASES);

  let activeFilter = "all";
  let activeSivFilter = "all";
  let currentDisease = null;
  let currentView = "directory";

  let elements = {};

  function setupDOMElements() {
    elements = {
      searchInput: document.getElementById("clinical-search-input"),
      searchClearBtn: document.getElementById("search-clear-btn"),
      filterChips: document.querySelectorAll(".filter-chip[data-filter]"),
      diseaseGrid: document.getElementById("disease-grid"),
      resultsCount: document.getElementById("results-count"),
      resultsFilterBadge: document.getElementById("results-filter-badge"),

      navTabs: document.querySelectorAll(".nav-tab-btn"),
      viewDirectory: document.getElementById("view-directory"),
      viewSivigila: document.getElementById("view-sivigila"),
      viewNotes: document.getElementById("view-notes"),

      sivigilaSearch: document.getElementById("sivigila-table-search"),
      sivigilaFilterChips: document.querySelectorAll(".filter-chip[data-siv-filter]"),
      sivigilaTableBody: document.getElementById("sivigila-table-body"),

      allNotesContainer: document.getElementById("all-notes-container"),

      sheetModal: document.getElementById("sheet-modal"),
      modalCloseBtn: document.getElementById("modal-close-btn"),
      modalSivBanner: document.getElementById("modal-sivigila-banner"),
      modalTitle: document.getElementById("modal-disease-title"),
      modalCategory: document.getElementById("modal-disease-category"),
      modalFavBtn: document.getElementById("modal-fav-btn"),
      modalNotesBtn: document.getElementById("modal-notes-btn"),
      modalPrintBtn: document.getElementById("modal-print-btn"),
      modalTriadBox: document.getElementById("modal-triad-box"),
      sheetTabBtns: document.querySelectorAll(".sheet-tab-btn"),
      sheetTabPanes: document.querySelectorAll(".tab-pane"),

      tabOverviewDef: document.getElementById("tab-overview-def"),
      tabOverviewEpidem: document.getElementById("tab-overview-epidem"),
      tabOverviewExtra: document.getElementById("tab-overview-extra"),
      tabSymptomsList: document.getElementById("tab-symptoms-list"),
      tabRedFlagsList: document.getElementById("tab-red-flags-list"),
      tabDiagContext: document.getElementById("tab-diag-context"),
      tabDiagTests: document.getElementById("tab-diag-tests"),
      tabDiagCriteria: document.getElementById("tab-diag-criteria"),
      tabZeroTimeline: document.getElementById("tab-zero-timeline"),
      tabZeroWarningsList: document.getElementById("tab-zero-warnings-list"),
      tabTreatmentContent: document.getElementById("tab-treatment-content"),

      notesDrawer: document.getElementById("notes-drawer"),
      notesDrawerClose: document.getElementById("notes-drawer-close"),
      notesDrawerSubtitle: document.getElementById("notes-drawer-subtitle"),
      notesInputStock: document.getElementById("notes-input-stock"),
      notesInputContact: document.getElementById("notes-input-contact"),
      notesInputClinical: document.getElementById("notes-input-clinical"),
      notesSaveStatus: document.getElementById("notes-save-status"),

      infoModal: document.getElementById("info-modal"),
      infoModalBtn: document.getElementById("info-modal-btn"),
      infoModalClose: document.getElementById("info-modal-close"),
      themeToggleBtn: document.getElementById("theme-toggle-btn"),
      themeIcon: document.getElementById("theme-icon"),
      toastContainer: document.getElementById("toast-container"),
      brandLink: document.getElementById("brand-link")
    };
  }

  function renderDiseaseGrid(diseasesList) {
    if (!elements.diseaseGrid) return;
    elements.diseaseGrid.innerHTML = "";

    if (diseasesList.length === 0) {
      elements.diseaseGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No se encontraron patologías</h3>
          <p>Intenta con otro término de búsqueda, síntoma o elimina los filtros aplicados.</p>
          <button class="filter-chip active" id="btn-reset-search" style="margin: 0 auto;">Ver todas las patologías</button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-search");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (elements.searchInput) elements.searchInput.value = "";
          setActiveFilter("all");
        });
      }
      updateResultsMeta(0);
      return;
    }

    const favorites = Store.getFavorites();

    diseasesList.forEach(d => {
      const isFav = favorites.includes(d.id);
      const note = Store.getNote(d.id);
      const hasNotes = Boolean(note.stock || note.referralContact || note.clinicalNotes);

      const card = document.createElement("article");
      card.className = "disease-card";
      card.setAttribute("data-id", d.id);

      const sivBadgeClass = d.sivigila.isImmediate ? "badge-immediate" : "badge-weekly";
      const sivBadgeText = d.sivigila.isImmediate
        ? `🚨 Notificación Inmediata (${d.sivigila.code})`
        : `📋 Semanal (${d.sivigila.code})`;

      card.innerHTML = `
        <div>
          <div class="card-top">
            <div class="card-badges">
              <span class="badge ${sivBadgeClass}">${sivBadgeText}</span>
              <span class="badge badge-category">${d.categoryLabel}</span>
            </div>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-fav-id="${d.id}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
              ★
            </button>
          </div>

          <h3 class="card-title" style="margin: 0.75rem 0 0.4rem 0;">${d.name}</h3>
          <p class="card-desc">${d.definition}</p>

          ${d.triad ? `
            <div class="card-triad-preview" style="margin-top: 0.75rem;">
              <strong>${d.triad.title}</strong>
              ${d.triad.components[0]}
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <div>
            ${hasNotes ? `
              <span class="has-notes-indicator" title="Tiene notas de farmacia registradas">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Notas guardadas
              </span>
            ` : '<span style="color: var(--text-light); font-size: 0.75rem;">Sin notas locales</span>'}
          </div>
          <button class="btn-open-sheet" data-open-sheet="${d.id}">
            Ver Ficha Completa
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      `;

      const favBtn = card.querySelector(`[data-fav-id="${d.id}"]`);
      if (favBtn) {
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isNow = Store.toggleFavorite(d.id);
          favBtn.classList.toggle("active", isNow);
          showToast(isNow ? `⭐ Agregado a favoritos del turno` : `Removido de favoritos`);
          if (activeFilter === "favoritos") {
            performSearch();
          }
        });
      }

      const openBtn = card.querySelector(`[data-open-sheet="${d.id}"]`);
      if (openBtn) {
        openBtn.addEventListener("click", () => openSheetModal(d.id));
      }

      card.addEventListener("click", (e) => {
        if (e.target.closest(".fav-btn") || e.target.closest(".btn-open-sheet")) return;
        openSheetModal(d.id);
      });

      elements.diseaseGrid.appendChild(card);
    });

    updateResultsMeta(diseasesList.length);
  }

  function updateResultsMeta(count) {
    if (!elements.resultsCount) return;
    const filterNames = {
      all: "todas las patologías",
      sivigila_inmediato: "eventos SIVIGILA Inmediatos (<24h)",
      urgencias: "urgencias y minuto cero",
      infecciosas: "enfermedades infecciosas / tropicales",
      favoritos: "favoritos del turno"
    };
    elements.resultsCount.textContent = `Mostrando ${count} ${count === 1 ? 'patología' : 'patologías'} (${filterNames[activeFilter] || 'filtradas'})`;
  }

  function performSearch() {
    const query = elements.searchInput ? elements.searchInput.value : "";
    if (elements.searchClearBtn) {
      elements.searchClearBtn.classList.toggle("visible", Boolean(query));
    }
    const results = searchEngine.search(query, activeFilter);
    renderDiseaseGrid(results);
  }

  function setActiveFilter(filter) {
    activeFilter = filter;
    elements.filterChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.filter === filter);
    });
    performSearch();
  }

  function openSheetModal(diseaseId) {
    const d = DISEASES.find(item => item.id === diseaseId);
    if (!d) return;

    currentDisease = d;
    Store.addToHistory(d.id);

    const isImm = d.sivigila.isImmediate;
    elements.modalSivBanner.className = `sivigila-banner ${isImm ? 'banner-immediate' : 'banner-weekly'}`;
    elements.modalSivBanner.innerHTML = `
      <div class="sivigila-banner-left">
        <span class="sivigila-pill">${isImm ? 'Alerta SIVIGILA Inmediata' : 'Reporte SIVIGILA Semanal'}</span>
        <strong>Código INS: ${d.sivigila.code}</strong> &bull; ${d.sivigila.periodicity}
      </div>
      <div style="font-size: 0.78rem; font-weight: 600;">
        ${isImm ? '⏱️ Reporte telefónico/radial &lt; 24h obligatorio' : '📅 Reporte en archivo plano semanal'}
      </div>
    `;

    elements.modalTitle.textContent = d.name;
    elements.modalCategory.textContent = `${d.categoryLabel} &bull; Urgencia: ${d.urgencyLevel.toUpperCase()}`;

    const isFav = Store.isFavorite(d.id);
    elements.modalFavBtn.classList.toggle("active", isFav);
    elements.modalFavBtn.onclick = () => {
      const isNow = Store.toggleFavorite(d.id);
      elements.modalFavBtn.classList.toggle("active", isNow);
      showToast(isNow ? `⭐ Agregado a favoritos` : `Removido de favoritos`);
      performSearch();
    };

    elements.modalNotesBtn.onclick = () => openNotesDrawer(d.id);
    elements.modalPrintBtn.onclick = () => window.print();

    if (d.triad) {
      elements.modalTriadBox.style.display = "block";
      elements.modalTriadBox.innerHTML = `
        <div class="triad-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
          ${d.triad.title}
        </div>
        <ul class="triad-list">
          ${d.triad.components.map(c => `<li>${c}</li>`).join("")}
        </ul>
        ${d.triad.alertText ? `<div class="triad-alert-note">${d.triad.alertText}</div>` : ""}
      `;
    } else {
      elements.modalTriadBox.style.display = "none";
    }

    elements.tabOverviewDef.textContent = d.definition;
    elements.tabOverviewEpidem.textContent = d.epidemiology;

    let extraHtml = "";
    if (d.phases) {
      extraHtml += `
        <div class="content-section" style="margin-top: 1rem;">
          <div class="section-title">Fases Evolutivas de la Enfermedad</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
            ${d.phases.map(p => `
              <div class="content-box" style="border-left: 3px solid var(--primary-600);">
                <strong style="color: var(--primary-800);">${p.name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">${p.duration}</div>
                <p style="font-size: 0.85rem;">${p.desc}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    if (d.typesInColombia) {
      extraHtml += `
        <div class="content-section" style="margin-top: 1rem;">
          <div class="section-title">Familias y Especies de Serpientes en Colombia</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${d.typesInColombia.map(t => `
              <div class="content-box">
                <strong style="color: var(--primary-700);">${t.snake} (${t.freq} de casos)</strong>
                <p style="font-size: 0.88rem; margin-top: 0.2rem;">${t.clinic}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
    elements.tabOverviewExtra.innerHTML = extraHtml;

    elements.tabSymptomsList.innerHTML = d.symptoms.map(s => `<li>${s}</li>`).join("");
    elements.tabRedFlagsList.innerHTML = d.redFlags.map(rf => `<li>${rf}</li>`).join("");

    elements.tabDiagContext.textContent = d.diagnosis.ruralContext;
    elements.tabDiagTests.innerHTML = d.diagnosis.tests.map(t => `<li>${t}</li>`).join("");
    elements.tabDiagCriteria.textContent = d.diagnosis.classificationCriteria || d.diagnosis.severityClassification || "";

    elements.tabZeroTimeline.innerHTML = d.zeroMinute.steps.map(s => `
      <div class="timeline-step">
        <div class="step-number">${s.order}</div>
        <div class="step-content">
          <div class="step-action">${s.action}</div>
          <div class="step-detail">${s.detail}</div>
        </div>
      </div>
    `).join("");

    elements.tabZeroWarningsList.innerHTML = d.zeroMinute.warnings.map(w => `<li>${w}</li>`).join("");

    let treatHtml = "";
    if (d.treatment.outpatient) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title">Manejo Ambulatorio (Primer Nivel)</div>
          <div class="content-box" style="white-space: pre-line;">${d.treatment.outpatient}</div>
        </div>
      `;
    }
    if (d.treatment.hospitalized) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title">Manejo Hospitalario en Observación de Urgencias</div>
          <div class="content-box" style="white-space: pre-line;">${d.treatment.hospitalized}</div>
        </div>
      `;
    }
    if (d.treatment.antivenomDosing) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title" style="color: var(--alert-primary);">Dosificación de Suero Antiofídico Polivalente INS</div>
          <div class="content-box" style="white-space: pre-line; border-left: 4px solid var(--alert-primary);">${d.treatment.antivenomDosing}</div>
        </div>
      `;
    }
    if (d.treatment.vivaxScheme) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title">Esquema para Plasmodium vivax (Cloroquina + Primaquina)</div>
          <div class="content-box" style="white-space: pre-line;">${d.treatment.vivaxScheme}</div>
        </div>
      `;
    }
    if (d.treatment.falciparumScheme) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title">Esquema para Plasmodium falciparum (Arteméter/Lumefantrina)</div>
          <div class="content-box" style="white-space: pre-line;">${d.treatment.falciparumScheme}</div>
        </div>
      `;
    }
    if (d.treatment.firstLineScheme) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title">Esquema Terapéutico Estandarizado</div>
          <div class="content-box" style="white-space: pre-line;">${d.treatment.firstLineScheme}</div>
        </div>
      `;
    }
    if (d.treatment.antiviralScheme) {
      treatHtml += `
        <div class="content-section">
          <div class="section-title">Terapia Antiviral (Aciclovir)</div>
          <div class="content-box" style="white-space: pre-line;">${d.treatment.antiviralScheme}</div>
        </div>
      `;
    }
    elements.tabTreatmentContent.innerHTML = treatHtml;

    switchSheetTab("tab-overview");

    elements.sheetModal.classList.add("open");
    elements.sheetModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeSheetModal() {
    elements.sheetModal.classList.remove("open");
    elements.sheetModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function switchSheetTab(targetTabId) {
    elements.sheetTabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === targetTabId);
    });
    elements.sheetTabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === targetTabId);
    });
  }

  function openNotesDrawer(diseaseId) {
    const d = DISEASES.find(item => item.id === diseaseId);
    if (!d) return;

    elements.notesDrawerSubtitle.textContent = d.name;
    const currentNote = Store.getNote(diseaseId);

    elements.notesInputStock.value = currentNote.stock || "";
    elements.notesInputContact.value = currentNote.referralContact || "";
    elements.notesInputClinical.value = currentNote.clinicalNotes || "";

    const handleAutoSave = () => {
      Store.saveNote(diseaseId, {
        stock: elements.notesInputStock.value,
        referralContact: elements.notesInputContact.value,
        clinicalNotes: elements.notesInputClinical.value
      });
      elements.notesSaveStatus.style.opacity = "1";
      setTimeout(() => {
        elements.notesSaveStatus.style.opacity = "0.7";
      }, 1500);
    };

    elements.notesInputStock.oninput = handleAutoSave;
    elements.notesInputContact.oninput = handleAutoSave;
    elements.notesInputClinical.oninput = handleAutoSave;

    elements.notesDrawer.classList.add("open");
    elements.notesDrawer.setAttribute("aria-hidden", "false");
  }

  function closeNotesDrawer() {
    elements.notesDrawer.classList.remove("open");
    elements.notesDrawer.setAttribute("aria-hidden", "true");
    performSearch();
    if (currentView === "notes") {
      renderAllNotesView();
    }
  }

  function renderSivigilaTable() {
    if (!elements.sivigilaTableBody) return;
    const query = (elements.sivigilaSearch?.value || "").toLowerCase().trim();

    let filtered = SIVIGILA_EVENTS.filter(ev => {
      if (activeSivFilter === "immediate" && !ev.isImmediate) return false;
      if (activeSivFilter === "weekly" && ev.isImmediate) return false;
      if (query) {
        return ev.code.includes(query) || ev.name.toLowerCase().includes(query) || ev.description.toLowerCase().includes(query);
      }
      return true;
    });

    elements.sivigilaTableBody.innerHTML = filtered.map(ev => {
      const isImm = ev.isImmediate;
      return `
        <tr>
          <td>
            <span class="badge ${isImm ? 'badge-immediate' : 'badge-weekly'}">
              ${ev.code}
            </span>
          </td>
          <td>
            <strong>${ev.name}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">${ev.description}</div>
          </td>
          <td>
            <span style="font-weight: 700; color: ${isImm ? 'var(--alert-primary)' : 'var(--info-primary)'};">
              ${ev.periodicity}
            </span>
          </td>
          <td>${ev.timeLimit}</td>
          <td>${ev.channel}</td>
          <td>
            ${ev.clinicalSheetId ? `
              <button class="btn-open-sheet" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" data-open-sheet="${ev.clinicalSheetId}">
                Abrir Ficha
              </button>
            ` : `<span style="font-size: 0.75rem; color: var(--text-light);">Normativo</span>`}
          </td>
        </tr>
      `;
    }).join("");

    elements.sivigilaTableBody.querySelectorAll("[data-open-sheet]").forEach(btn => {
      btn.addEventListener("click", () => {
        openSheetModal(btn.dataset.openSheet);
      });
    });
  }

  function renderAllNotesView() {
    if (!elements.allNotesContainer) return;
    const allNotes = Store.getAllNotes();
    const diseasesWithNotes = DISEASES.filter(d => {
      const n = allNotes[d.id];
      return n && (n.stock || n.referralContact || n.clinicalNotes);
    });

    if (diseasesWithNotes.length === 0) {
      elements.allNotesContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>No tienes notas registradas aún</h3>
          <p>Abre cualquier ficha clínica y haz clic en el ícono de notas para registrar el stock de farmacia de tu centro de salud o teléfonos de ambulancia local.</p>
          <button class="btn-open-sheet" style="margin: 0 auto;" id="btn-go-to-catalog">Ir al catálogo de patologías</button>
        </div>
      `;
      const btnGo = document.getElementById("btn-go-to-catalog");
      if (btnGo) {
        btnGo.addEventListener("click", () => switchView("directory"));
      }
      return;
    }

    elements.allNotesContainer.innerHTML = diseasesWithNotes.map(d => {
      const n = allNotes[d.id];
      return `
        <article class="disease-card">
          <div>
            <div class="card-top">
              <span class="badge badge-category">${d.categoryLabel}</span>
              <button class="btn-open-sheet" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" data-edit-note="${d.id}">
                Editar Notas
              </button>
            </div>
            <h3 class="card-title" style="margin: 0.5rem 0 0.75rem 0;">${d.name}</h3>

            ${n.stock ? `
              <div style="margin-bottom: 0.6rem;">
                <span class="form-label" style="font-size: 0.7rem; color: var(--primary-700);">📦 Stock en Farmacia:</span>
                <p style="font-size: 0.85rem; background: var(--bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${n.stock}</p>
              </div>
            ` : ''}

            ${n.referralContact ? `
              <div style="margin-bottom: 0.6rem;">
                <span class="form-label" style="font-size: 0.7rem; color: var(--primary-700);">📞 Contactos de Remisión:</span>
                <p style="font-size: 0.85rem; background: var(--bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${n.referralContact}</p>
              </div>
            ` : ''}

            ${n.clinicalNotes ? `
              <div>
                <span class="form-label" style="font-size: 0.7rem; color: var(--primary-700);">📝 Notas Clínicas:</span>
                <p style="font-size: 0.85rem; background: var(--bg-subtle); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${n.clinicalNotes}</p>
              </div>
            ` : ''}
          </div>

          <div class="card-footer">
            <span style="font-size: 0.72rem; color: var(--text-muted);">
              Actualizado: ${n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Reciente'}
            </span>
            <button class="btn-open-sheet" data-open-sheet="${d.id}">
              Ver Ficha
            </button>
          </div>
        </article>
      `;
    }).join("");

    elements.allNotesContainer.querySelectorAll("[data-edit-note]").forEach(btn => {
      btn.addEventListener("click", () => openNotesDrawer(btn.dataset.editNote));
    });

    elements.allNotesContainer.querySelectorAll("[data-open-sheet]").forEach(btn => {
      btn.addEventListener("click", () => openSheetModal(btn.dataset.openSheet));
    });
  }

  function switchView(viewName) {
    currentView = viewName;

    elements.navTabs.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    elements.viewDirectory.style.display = viewName === "directory" ? "block" : "none";
    elements.viewSivigila.style.display = viewName === "sivigila" ? "block" : "none";
    elements.viewNotes.style.display = viewName === "notes" ? "block" : "none";

    if (viewName === "directory") {
      performSearch();
    } else if (viewName === "sivigila") {
      renderSivigilaTable();
    } else if (viewName === "notes") {
      renderAllNotesView();
    }
  }

  function showToast(message) {
    if (!elements.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 200);
    }, 2500);
  }

  function updateThemeIcon(theme) {
    if (!elements.themeIcon) return;
    if (theme === "dark") {
      elements.themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    } else {
      elements.themeIcon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
    }
  }

  function init() {
    setupDOMElements();

    const savedTheme = Store.getTheme();
    Store.setTheme(savedTheme);
    updateThemeIcon(savedTheme);

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener("click", () => {
        const current = Store.getTheme();
        const next = current === "dark" ? "light" : "dark";
        Store.setTheme(next);
        updateThemeIcon(next);
        showToast(`Modo ${next === 'dark' ? 'Turno Nocturno activado 🌙' : 'Claro activado ☀️'}`);
      });
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", performSearch);
    }
    if (elements.searchClearBtn) {
      elements.searchClearBtn.addEventListener("click", () => {
        if (elements.searchInput) {
          elements.searchInput.value = "";
          elements.searchInput.focus();
        }
        performSearch();
      });
    }

    elements.filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        setActiveFilter(chip.dataset.filter);
      });
    });

    elements.navTabs.forEach(tab => {
      tab.addEventListener("click", () => switchView(tab.dataset.view));
    });

    if (elements.brandLink) {
      elements.brandLink.addEventListener("click", (e) => {
        e.preventDefault();
        switchView("directory");
        setActiveFilter("all");
      });
    }

    elements.sivigilaFilterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        elements.sivigilaFilterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        activeSivFilter = chip.dataset.sivFilter;
        renderSivigilaTable();
      });
    });

    if (elements.sivigilaSearch) {
      elements.sivigilaSearch.addEventListener("input", renderSivigilaTable);
    }

    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener("click", closeSheetModal);
    }
    if (elements.sheetModal) {
      elements.sheetModal.addEventListener("click", (e) => {
        if (e.target === elements.sheetModal) closeSheetModal();
      });
    }

    elements.sheetTabBtns.forEach(btn => {
      btn.addEventListener("click", () => switchSheetTab(btn.dataset.tab));
    });

    if (elements.notesDrawerClose) {
      elements.notesDrawerClose.addEventListener("click", closeNotesDrawer);
    }
    if (elements.notesDrawer) {
      elements.notesDrawer.addEventListener("click", (e) => {
        if (e.target === elements.notesDrawer) closeNotesDrawer();
      });
    }

    if (elements.infoModalBtn) {
      elements.infoModalBtn.addEventListener("click", () => {
        elements.infoModal.classList.add("open");
      });
    }
    if (elements.infoModalClose) {
      elements.infoModalClose.addEventListener("click", () => {
        elements.infoModal.classList.remove("open");
      });
    }
    if (elements.infoModal) {
      elements.infoModal.addEventListener("click", (e) => {
        if (e.target === elements.infoModal) elements.infoModal.classList.remove("open");
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (elements.notesDrawer && elements.notesDrawer.classList.contains("open")) {
          closeNotesDrawer();
        } else if (elements.sheetModal && elements.sheetModal.classList.contains("open")) {
          closeSheetModal();
        } else if (elements.infoModal && elements.infoModal.classList.contains("open")) {
          elements.infoModal.classList.remove("open");
        }
      } else if (e.key === "/" && document.activeElement !== elements.searchInput && elements.sheetModal && !elements.sheetModal.classList.contains("open")) {
        e.preventDefault();
        if (elements.searchInput) elements.searchInput.focus();
      }
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
      });
    }

    performSearch();
  }

  // Arranque seguro compatible con carga síncrona y diferida
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

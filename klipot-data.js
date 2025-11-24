// ========== DATOS Y CONFIGURACIONES ==========

const sefirotDefs = {
    "Keter": "Corona - Propósito Supremo",
    "Jojma": "Sabiduría - Inspiración Pura", 
    "Bina": "Entendimiento - Mente Analítica",
    "Daat": "Conocimiento - Integración",
    "Jesed": "Amor - Expansión",
    "Gevura": "Fuerza - Límites",
    "Tiferet": "Belleza - Equilibrio",
    "Netsaj": "Victoria - Perseverancia",
    "Hod": "Gloria - Procesamiento",
    "Yesod": "Fundación - Identidad",
    "Malkuth": "Reino - Manifestación"
};

const orMeanings = {
    1: "liderazgo auténtico y voluntad soberana",
    2: "diplomacia y colaboración", 
    3: "expresión creativa y comunicación",
    4: "estabilidad y trabajo práctico",
    5: "libertad y adaptabilidad",
    6: "amor incondicional y belleza",
    7: "sabiduría e introspección",
    8: "poder y abundancia",
    9: "compasión universal"
};

// ========== FUNCIONES DE CÁLCULO ==========

function reduceNumber(num) {
    if (num === 11 || num === 22 || num === 33) return num;
    
    let result = num;
    while (result > 9) {
        let sum = 0;
        const str = result.toString();
        for (let i = 0; i < str.length; i++) {
            sum += parseInt(str[i]);
        }
        result = sum;
        if (result === 11 || result === 22 || result === 33) break;
    }
    return result;
}

function calculateAllSefirot(d, m, a) {
    return {
        "Keter": Math.abs(d - a),
        "Jojma": Math.abs(d - m),
        "Bina": Math.abs(m - a),
        "Daat": Math.abs(Math.abs(d - m) - Math.abs(d - a)),
        "Jesed": Math.abs(d - Math.abs(m - a)),
        "Gevura": Math.abs(m - Math.abs(d - a)),
        "Tiferet": Math.abs(Math.abs(d - m) - Math.abs(m - a)),
        "Netsaj": Math.abs(Math.abs(d - a) - Math.abs(m - a)),
        "Hod": Math.abs(Math.abs(d - m) - Math.abs(d - a)),
        "Yesod": Math.abs(d - Math.abs(Math.abs(d - m) - Math.abs(m - a))),
        "Malkuth": Math.abs(a - Math.abs(d - m))
    };
}

function findEmergentSefirot(kliMap) {
    const entries = Object.entries(kliMap);
    entries.sort((a, b) => b[1] - a[1]);
    
    const shadowCentral = entries[0];
    const secondary = entries[1];
    const tertiary = entries[2];
    
    const keyValue = Math.abs(shadowCentral[1] - secondary[1]);
    let missionKey = entries[0];
    
    for (let i = 0; i < entries.length; i++) {
        if (Math.abs(entries[i][1] - keyValue) <= 1) {
            missionKey = entries[i];
            break;
        }
    }
    
    return {
        shadowCentral: { name: shadowCentral[0], value: shadowCentral[1] },
        secondary: { name: secondary[0], value: secondary[1] },
        tertiary: { name: tertiary[0], value: tertiary[1] },
        missionKey: { name: missionKey[0], value: missionKey[1] },
        allSefirot: entries
    };
}

function calculateTense(or, kli) {
    if (kli === 0) {
        return { value: Infinity, state: "Flujo Puro", badge: "tense-high", type: "overflow" };
    }
    const tenseValue = or / kli;
    if (tenseValue < 0.7) {
        return { value: tenseValue, state: "Subpresión Severa", badge: "tense-severe", type: "vacuum" };
    }
    if (tenseValue < 1) {
        return { value: tenseValue, state: "Subpresión", badge: "tense-low", type: "vacuum" };
    }
    if (tenseValue === 1) {
        return { value: tenseValue, state: "Punto Crítico", badge: "tense-critical", type: "critical" };
    }
    return { value: tenseValue, state: "Sobrepresión", badge: "tense-high", type: "overflow" };
}

function calculateAllTense(or, kliMap) {
    const tenseMap = {};
    for (const [sefira, kli] of Object.entries(kliMap)) {
        tenseMap[sefira] = calculateTense(or, kli);
    }
    return tenseMap;
}

function analyzeKlipot(tenseMap) {
    const klipot = {
        overflow: [],
        vacuum: [],
        critical: []
    };
    
    for (const [sefira, tense] of Object.entries(tenseMap)) {
        if (tense.type === "overflow") klipot.overflow.push({ sefira: sefira, tense: tense });
        if (tense.type === "vacuum") klipot.vacuum.push({ sefira: sefira, tense: tense });
        if (tense.type === "critical") klipot.critical.push({ sefira: sefira, tense: tense });
    }
    
    return klipot;
}

// ========== EXPLICACIONES DE KLIPOT ==========

function getDeepKlipaExplanation(sefira, type) {
    const explanations = {
        "Keter": {
            "overflow": {
                "title": "Klipa de Desborde en Keter - La Corona Inflada",
                "explicacion": "Cuando Keter recibe más Or del que puede contener, se genera una espiritualidad inflada y desconectada de la realidad terrenal.",
                "manifestaciones": [
                    "Búsqueda obsesiva de significado en todo",
                    "Desprecio por lo mundano y práctico",
                    "Espiritualidad de escape en lugar de integración",
                    "Sentimiento de superioridad espiritual"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Keter - La Corona Quebrada",
                "explicacion": "La vasija de Keter está demasiado vacía para recibir el Or, generando una crisis existencial profunda.",
                "manifestaciones": [
                    "Sentimiento de vacío existencial",
                    "Falta de dirección y propósito vital",
                    "Desconexión de la guía interior",
                    "Crisis de fe y significado"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Keter - Umbral de Propósito",
                "explicacion": "Keter en perfecto balance, momento de claridad existencial y conexión consciente con tu propósito.",
                "manifestaciones": [
                    "Claridad sobre tu misión de vida",
                    "Conexión equilibrada con lo trascendente",
                    "Momento para decisiones existenciales importantes",
                    "Integración armónica entre espíritu y materia"
                ]
            }
        },
        "Jojma": {
            "overflow": {
                "title": "Klipa de Desborde en Jojmá - Sabiduría Inundada",
                "explicacion": "Exceso de Or en Jojmá genera sobrecarga de ideas que no pueden materializarse.",
                "manifestaciones": [
                    "Exceso de ideas sin aplicación práctica",
                    "Inspiración constante sin concretar",
                    "Dificultad para focalizar en un proyecto",
                    "Frustración por no materializar visiones"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Jojmá - Sabiduría Obstruida",
                "explicacion": "Vasija bloqueada impidiendo el flujo de inspiración y comprensión profunda.",
                "manifestaciones": [
                    "Bloqueo creativo persistente",
                    "Incapacidad para ver soluciones innovadoras",
                    "Mente rígida y poco flexible",
                    "Falta de chispas inspiradoras"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Jojmá - Sabiduría Pura",
                "explicacion": "Jojmá en equilibrio perfecto, permitiendo recibir inspiración con capacidad de aplicación práctica.",
                "manifestaciones": [
                    "Insights profundos y aplicables",
                    "Creatividad fluida y productiva",
                    "Capacidad para ver soluciones innovadoras",
                    "Inspiración que se manifiesta naturalmente"
                ]
            }
        },
        "Bina": {
            "overflow": {
                "title": "Klipa de Desborde en Binah - Entendimiento Saturado",
                "explicacion": "Exceso de Or en Binah genera análisis excesivo y parálisis por sobrepensamiento.",
                "manifestaciones": [
                    "Análisis interminable sin decisión",
                    "Parálisis por exceso de información",
                    "Dificultad para sintetizar y concluir",
                    "Sobrepensamiento que agota mentalmente"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Binah - Entendimiento Fragmentado",
                "explicacion": "Vasija vacía genera confusión mental y dificultad para comprender relaciones complejas.",
                "manifestaciones": [
                    "Confusión y desorganización mental",
                    "Dificultad para entender conceptos abstractos",
                    "Pensamiento fragmentado y desconectado",
                    "Incapacidad para ver patrones y conexiones"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Binah - Entendimiento Profundo",
                "explicacion": "Binah en perfecto balance, permitiendo análisis profundos que conducen a decisiones sabias.",
                "manifestaciones": [
                    "Capacidad de análisis que lleva a acción",
                    "Comprensión profunda de situaciones complejas",
                    "Pensamiento estructurado y claro",
                    "Habilidad para discernir patrones ocultos"
                ]
            }
        },
        "Daat": {
            "overflow": {
                "title": "Klipa de Desborde en Daat - Conocimiento Forzado",
                "explicacion": "Exceso de Or genera conexiones artificiales y síntesis prematuras.",
                "manifestaciones": [
                    "Conexiones forzadas entre ideas dispares",
                    "Pseudosíntesis sin fundamento real",
                    "Integración superficial de conceptos",
                    "Conocimiento amplio pero poco profundo"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Daat - Conocimiento Desconectado",
                "explicacion": "Vasija vacía impide la integración del conocimiento, generando fragmentación.",
                "manifestaciones": [
                    "Saberes desconectados y sin integración",
                    "Dificultad para aplicar conocimiento teórico",
                    "Fragmentación entre entender y saber",
                    "Incapacidad para conectar ideas relacionadas"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Daat - Conocimiento Integrado",
                "explicacion": "Daat en equilibrio perfecto, permitiendo la verdadera síntesis del conocimiento.",
                "manifestaciones": [
                    "Integración natural de saberes diversos",
                    "Capacidad para aplicar teoría a la práctica",
                    "Visión holística de situaciones complejas",
                    "Síntesis creativa de ideas opuestas"
                ]
            }
        },
        "Jesed": {
            "overflow": {
                "title": "Klipa de Desborde en Jesed - Amor Devorador",
                "explicacion": "Exceso de Or genera generosidad sin límites que termina siendo asfixiante.",
                "manifestaciones": [
                    "Generosidad que agota tus recursos",
                    "Amor que sofoca en lugar de nutrir",
                    "Dificultad para poner límites amorosos",
                    "Sacrificio excesivo por otros"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Jesed - Amor Congelado",
                "explicacion": "Vasija bloqueada impidiendo el flujo de amor y generosidad.",
                "manifestaciones": [
                    "Aislamiento emocional y afectivo",
                    "Dificultad para dar y recibir amor",
                    "Frialdad emocional y distancia",
                    "Miedo a la intimidad y vulnerabilidad"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Jesed - Amor Incondicional",
                "explicacion": "Jesed en perfecto balance, permitiendo dar y recibir amor de manera libre.",
                "manifestaciones": [
                    "Amor que nutre sin sofocar",
                    "Generosidad equilibrada y sostenible",
                    "Capacidad para poner límites amorosos",
                    "Apertura emocional sin dependencia"
                ]
            }
        },
        "Gevura": {
            "overflow": {
                "title": "Klipa de Desborde en Gevurá - Fuerza Tiránica",
                "explicacion": "Exceso de Or genera fuerza desmedida que se convierte en rigidez y autoritarismo.",
                "manifestaciones": [
                    "Rigidez extrema en principios y valores",
                    "Control excesivo sobre otros",
                    "Autoritarismo y falta de flexibilidad",
                    "Juicio severo hacia sí mismo y otros"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Gevurá - Fuerza Quebrada",
                "explicacion": "Vasija vacía genera falta de límites e incapacidad para defenderse.",
                "manifestaciones": [
                    "Indefensión y falta de límites",
                    "Incapacidad para decir 'no'",
                    "Indecisión crónica y falta de firmeza",
                    "Permisividad que permite abusos"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Gevurá - Fuerza Justa",
                "explicacion": "Gevurá en equilibrio perfecto, permitiendo establecer límites con compasión.",
                "manifestaciones": [
                    "Límites claros y respetuosos",
                    "Firmeza sin rigidez",
                    "Capacidad para decir no con amor",
                    "Disciplina que empodera"
                ]
            }
        },
        "Tiferet": {
            "overflow": {
                "title": "Klipa de Desborde en Tiferet - Belleza Artificial",
                "explicacion": "Exceso de Or genera armonía superficial que evita el conflicto necesario.",
                "manifestaciones": [
                    "Armonía superficial que evita conflictos",
                    "Belleza estética sin sustancia real",
                    "Equilibrio forzado que reprime emociones",
                    "Imagen perfecta que oculta sombras"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Tiferet - Belleza Fragmentada",
                "explicacion": "Vasija bloqueada genera desequilibrio emocional y falta de centro.",
                "manifestaciones": [
                    "Desequilibrio emocional constante",
                    "Falta de centro y dirección clara",
                    "Crisis de identidad y valores",
                    "Incapacidad para integrar polaridades"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Tiferet - Belleza Auténtica",
                "explicacion": "Tiferet en perfecto balance, permitiendo la verdadera armonía que integra todas las partes.",
                "manifestaciones": [
                    "Armonía interna auténtica",
                    "Centro emocional estable",
                    "Identidad integrada y coherente",
                    "Capacidad para manejar conflictos constructivamente"
                ]
            }
        },
        "Netsaj": {
            "overflow": {
                "title": "Klipa de Desborde en Netsaj - Victoria Desbocada",
                "explicacion": "Exceso de Or genera hiperactividad y dispersión energética.",
                "manifestaciones": [
                    "Hiperactividad y multitasking excesivo",
                    "Inicio de múltiples proyectos sin terminar",
                    "Dispersión energética y falta de enfoque",
                    "Impaciencia por resultados inmediatos"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Netsaj - Victoria Estancada",
                "explicacion": "Vasija vacía genera desmotivación y dificultad para concretar metas.",
                "manifestaciones": [
                    "Desmotivación y falta de impulso",
                    "Abandono de proyectos al primer obstáculo",
                    "Falta de perseverancia y constancia",
                    "Dificultad para visualizar el éxito"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Netsaj - Victoria Sostenible",
                "explicacion": "Netsaj en equilibrio perfecto, permitiendo iniciativa efectiva y capacidad para concretar.",
                "manifestaciones": [
                    "Iniciativa equilibrada con perseverancia",
                    "Capacidad para concretar proyectos",
                    "Energía sostenible sin agotamiento",
                    "Visión clara con acción consistente"
                ]
            }
        },
        "Hod": {
            "overflow": {
                "title": "Klipa de Desborde en Hod - Gloria Excesiva",
                "explicacion": "Exceso de Or genera análisis estéril y racionalización excesiva.",
                "manifestaciones": [
                    "Análisis interminable sin acción",
                    "Racionalización que justifica inacción",
                    "Perfeccionismo paralizante",
                    "Sobre-estructuración de procesos"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Hod - Gloria Desorganizada",
                "explicacion": "Vasija vacía genera caos mental y falta de estructura.",
                "manifestaciones": [
                    "Caos mental y desorganización",
                    "Dificultad para seguir procesos",
                    "Falta de método y sistematicidad",
                    "Pensamiento desestructurado"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Hod - Gloria Estructurada",
                "explicacion": "Hod en perfecto balance, permitiendo análisis profundo que conduce a acción efectiva.",
                "manifestaciones": [
                    "Pensamiento analítico que lleva a acción",
                    "Estructura que facilita la creatividad",
                    "Capacidad para organizar procesos complejos",
                    "Análisis que ilumina en lugar de paralizar"
                ]
            }
        },
        "Yesod": {
            "overflow": {
                "title": "Klipa de Desborde en Yesod - Fundación Líquida",
                "explicacion": "Exceso de Or genera identidad líquida y adaptación excesiva.",
                "manifestaciones": [
                    "Identidad cambiante según el contexto",
                    "Adaptación excesiva a expectativas ajenas",
                    "Falta de núcleo identitario estable",
                    "Dificultad para mantener coherencia personal"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Yesod - Fundación Quebrada",
                "explicacion": "Vasija vacía genera falta de identidad y desarraigo.",
                "manifestaciones": [
                    "Falta de sentido de identidad claro",
                    "Desarraigo y sensación de no pertenencia",
                    "Dificultad para conectar con el propio cuerpo",
                    "Inestabilidad emocional básica"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Yesod - Fundación Sólida",
                "explicacion": "Yesod en equilibrio perfecto, permitiendo una identidad estable y flexible.",
                "manifestaciones": [
                    "Identidad clara y flexible",
                    "Buen contacto con el cuerpo y emociones",
                    "Autoexpresión auténtica y coherente",
                    "Fundación psíquica sólida"
                ]
            }
        },
        "Malkuth": {
            "overflow": {
                "title": "Klipa de Desborde en Malkuth - Reino Materialista",
                "explicacion": "Exceso de Or genera acumulación vacía y materialismo.",
                "manifestaciones": [
                    "Acumulación material sin significado",
                    "Materialismo y apego a posesiones",
                    "Identificación excesiva con logros terrenales",
                    "Dificultad para soltar y dejar fluir"
                ]
            },
            "vacuum": {
                "title": "Klipa de Vacío en Malkuth - Reino Desconectado",
                "explicacion": "Vasija vacía genera desconexión terrenal y dificultad para manifestar.",
                "manifestaciones": [
                    "Desconexión del cuerpo y lo físico",
                    "Dificultad para materializar ideas",
                    "Vivir en abstracciones sin anclaje real",
                    "Problemas prácticos recurrentes"
                ]
            },
            "critical": {
                "title": "Punto Crítico en Malkuth - Reino Consciente",
                "explicacion": "Malkuth en perfecto balance, permitiendo la manifestación consciente con propósito.",
                "manifestaciones": [
                    "Manifestación alineada con propósito",
                    "Presencia plena en lo físico",
                    "Capacidad para disfrutar lo sensorial",
                    "Habilidad para materializar visiones"
                ]
            }
        }
    };
    
    return explanations[sefira]?.[type] || {
        "title": `Klipa ${type === "overflow" ? "de Desborde" : type === "vacuum" ? "de Vacío" : "Crítica"} en ${sefira}`,
        "explicacion": "Esta Sefirá se encuentra en un estado de desbalance energético que necesita atención y transformación consciente.",
        "manifestaciones": [
            "Expresión desequilibrada de la energía de esta Sefirá",
            "Dificultad para integrar esta dimensión de manera armónica",
            "Patrones repetitivos relacionados con este ámbito",
            "Resistencia al flujo natural en esta área"
        ]
    };
}
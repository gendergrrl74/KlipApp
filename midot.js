// ========== SISTEMA DE PRÁCTICAS ==========

function showMidotPlan() {
    if (!window.currentAnalysis) {
        showError('Completa el análisis primero');
        return;
    }
    
    const { emergent, or, klipot } = window.currentAnalysis;
    const midot = generateMidotPractices(emergent, klipot, or);
    
    const midotHTML = generateMidotHTML(midot, emergent, or);
    document.getElementById('midot-tab').innerHTML = midotHTML;
    document.querySelector('[data-tab="midot"]').click();
}

function generateMidotPractices(emergent, klipot, or) {
    const midot = [];
    
    const sefiraToMidot = {
        "Keter": {
            "midot": ["Anavá (Humildad)", "Bitajón (Confianza)"],
            "practica": "Medita 10 minutos en tu pequeño lugar en el universo. Agradece por 3 cosas que recibiste sin merecer.",
            "proposito": "Conectar con la fuente divina desde la humildad consciente"
        },
        "Jojma": {
            "midot": ["Daat (Conocimiento)", "Aspaklaria (Claridad)"],
            "practica": "Observa algo ordinario como si fuera la primera vez. Anota 1 insight aplicable a tu vida.",
            "proposito": "Despertar la chispa de sabiduría divina en lo cotidiano"
        },
        "Bina": {
            "midot": ["Savlanut (Paciencia)", "Havaná (Comprensión)"],
            "practica": "Toma una situación compleja y busca SOLAMENTE soluciones prácticas por 10 minutos.",
            "proposito": "Cultivar el entendimiento que transforma en acción"
        },
        "Daat": {
            "midot": ["Yijud (Unificación)", "Klal (Síntesis)"],
            "practica": "Encuentra la conexión entre dos ideas aparentemente opuestas. Escribe cómo se complementan.",
            "proposito": "Unificar polaridades para acceder al conocimiento integrado"
        },
        "Jesed": {
            "midot": ["Jessed (Bondad)", "Nedivut (Generosidad)"],
            "practica": "Haz un acto de bondad anónimo. Da algo valioso sin esperar reconocimiento.",
            "proposito": "Expresar el amor divino a través del servicio desinteresado"
        },
        "Gevura": {
            "midot": ["Gevurá (Fuerza)", "Gvul (Límite)"],
            "practica": "Pon un límite amoroso hoy. Di 'NO' a algo que no resuena con tu esencia.",
            "proposito": "Establecer contornos sagrados que protejan tu energía"
        },
        "Tiferet": {
            "midot": ["Tiferet (Belleza)", "Rachamim (Misericordia)"],
            "practica": "En un conflicto, busca el punto de equilibrio entre tu corazón y tu principio.",
            "proposito": "Encontrar la armonía que integra compasión y verdad"
        },
        "Netsaj": {
            "midot": ["Netsaj (Victoria)", "Hitlabshut (Vestimiento)"],
            "practica": "Completa una tarea que hayas estado postergando. Celebra el pequeño triunfo.",
            "proposito": "Materializar la visión a través de acción consistente"
        },
        "Hod": {
            "midot": ["Hod (Gloria)", "Hodaá (Agrado)"],
            "practica": "Reconoce y agradece por una cualidad admirable en alguien que te cuesta apreciar.",
            "proposito": "Ver la belleza divina en la diversidad de expresiones"
        },
        "Yesod": {
            "midot": ["Yesod (Fundación)", "Brit (Pacto)"],
            "practica": "Conecta con tu cuerpo mediante 5 min de respiración consciente. Siente tu fundamento.",
            "proposito": "Establecer una base sólida para la expresión auténtica"
        },
        "Malkuth": {
            "midot": ["Maljut (Reino)", "Shiflut (Bajeza)"],
            "practica": "Haz una acción práctica que manifieste un ideal espiritual. Ancla cielo en tierra.",
            "proposito": "Encarnar lo divino en la realidad terrenal"
        }
    };

    // PRÁCTICA 1: PARA HABITAR LA ESENCIA
    const esenciaMidot = sefiraToMidot[emergent.missionKey.name];
    midot.push({
        priority: "Alta",
        sefira: emergent.missionKey.name,
        title: "Habitando " + emergent.missionKey.name,
        description: esenciaMidot.practica,
        midotList: esenciaMidot.midot,
        duration: "15 min diarios",
        frequency: "Diaria",
        purpose: esenciaMidot.proposito
    });

    // PRÁCTICA 2: PARA LA SOMBRA CENTRAL
    const sombraMidot = sefiraToMidot[emergent.shadowCentral.name];
    midot.push({
        priority: "Alta",
        sefira: emergent.shadowCentral.name,
        title: "Transformando " + emergent.shadowCentral.name,
        description: sombraMidot.practica,
        midotList: sombraMidot.midot,
        duration: "10-15 min diarios",
        frequency: "Diaria",
        purpose: "Transformar el núcleo del desafío a través del atributo divino correspondiente"
    });

    // PRÁCTICA 3: PARA LA KLIPÁ MÁS CRÍTICA (si existe)
    if (klipot.overflow.length > 0 || klipot.vacuum.length > 0) {
        const criticalKlipa = klipot.overflow.length > 0 ? klipot.overflow[0] : klipot.vacuum[0];
        const criticalMidot = sefiraToMidot[criticalKlipa.sefira];
        midot.push({
            priority: "Media",
            sefira: criticalKlipa.sefira,
            title: "Equilibrando " + criticalKlipa.sefira,
            description: criticalMidot.practica,
            midotList: criticalMidot.midot,
            duration: "10 min diarios",
            frequency: "5 veces/semana",
            purpose: "Equilibrar el área de mayor desafío energético"
        });
    }

    return midot;
}

function generateMidotHTML(midot, emergent, or) {
    return `
        <div class="result-card tikkun-card">
            <h3>🌿 Prácticas para Habitar tu Esencia</h3>
            <p>Basado en tu análisis: Or ${or} - Esencia: ${emergent.missionKey.name}</p>
        </div>
        
        <div class="result-card">
            <h3>🎯 Tus Prácticas Esenciales</h3>
            <div class="practice-grid">
                ${midot.map(practice => `
                    <div class="practice-item">
                        <div class="practice-priority">${practice.priority} Prioridad</div>
                        <h4>${practice.title}</h4>
                        <div class="practice-duration">${practice.duration} | ${practice.frequency}</div>
                        <p>${practice.description}</p>
                        <div style="margin-top: 10px;">
                            <strong>Midot a cultivar:</strong>
                            <ul style="margin: 5px 0; padding-left: 20px;">
                                ${practice.midotList.map(midah => `<li>${midah}</li>`).join('')}
                            </ul>
                        </div>
                        <small><strong>Propósito:</strong> ${practice.purpose}</small>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-card">
            <h3>💫 Guía de Práctica</h3>
            <p><strong>Enfoque principal:</strong> Comienza con las prácticas de "Alta Prioridad"</p>
            <p><strong>Consistencia:</strong> 21 días para establecer el nuevo patrón energético</p>
            <p><strong>Observación:</strong> Nota los cambios sutiles en tu experiencia diaria</p>
        </div>
        
        <div class="result-card">
            <h3>🔄 Volver al Scanner</h3>
            <button onclick="showAnalysis()">📊 Ver Análisis Completo</button>
        </div>
    `;
}
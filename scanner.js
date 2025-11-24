// ========== SCANNER PRINCIPAL ==========

function calculateAIOK() {
    const birthDate = document.getElementById('birthDate').value;
    const loading = document.getElementById('loading');
    const results = document.getElementById('analysis-results');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    if (!birthDate) {
        showError('Por favor selecciona una fecha de nacimiento');
        return;
    }
    
    loading.style.display = 'block';
    results.style.display = 'none';
    
    setTimeout(function() {
        try {
            const dateParts = birthDate.split('-');
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]);
            const day = parseInt(dateParts[2]);
            
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                showError('Fecha de nacimiento inválida');
                return;
            }
            
            const d_raw = day;
            const m_raw = month;
            const a_raw = year;
            
            const d = reduceNumber(d_raw);
            const m = reduceNumber(m_raw);
            const a = reduceNumber(a_raw);
            const or = reduceNumber(d + m + a);
            
            // CALCULOS COMPLETOS
            const kliMap = calculateAllSefirot(d, m, a);
            const emergent = findEmergentSefirot(kliMap);
            const tenseMap = calculateAllTense(or, kliMap);
            const klipot = analyzeKlipot(tenseMap);
            
            // Generar HTML del scanner
            const scannerHTML = generateScannerHTML(birthDate, d_raw, m_raw, a_raw, or, emergent, tenseMap, klipot);
            
            results.innerHTML = scannerHTML;
            loading.style.display = 'none';
            results.style.display = 'block';
            
            // Guardar datos para las prácticas
            window.currentAnalysis = { emergent, or, klipot, tenseMap };
            
        } catch (error) {
            loading.style.display = 'none';
            showError('Error en el análisis: ' + error.message);
        }
    }, 1500);
}

function generateScannerHTML(birthDate, d_raw, m_raw, a_raw, or, emergent, tenseMap, klipot) {
    let resultHTML = '';
    
    // 1. DATOS BASE
    resultHTML += '<div class="result-card">';
    resultHTML += '<h3>📊 Datos de Nacimiento</h3>';
    resultHTML += '<p>Fecha: ' + birthDate + '</p>';
    resultHTML += '<p>Día: ' + d_raw + ' | Mes: ' + m_raw + ' | Año: ' + a_raw + '</p>';
    resultHTML += '</div>';
    
    // 2. POTENCIAL DE MISIÓN
    resultHTML += '<div class="result-card">';
    resultHTML += '<h3>💫 Potencial de Misión (Or)</h3>';
    resultHTML += '<p><strong>Número ' + or + '</strong> - ' + (orMeanings[or] || "potencial único") + '</p>';
    resultHTML += '</div>';
    
    // 3. SEFIROT EMERGENTES
    resultHTML += '<div class="result-card emergency-card">';
    resultHTML += '<h3>🎯 Triada de Sefirot Emergentes</h3>';
    resultHTML += '<div class="sefirot-grid">';
    resultHTML += '<div class="sefira-item emergency-item">';
    resultHTML += '<strong>' + emergent.shadowCentral.name + '</strong><br>';
    resultHTML += 'Kli: ' + emergent.shadowCentral.value + '<br>';
    resultHTML += '<small>' + sefirotDefs[emergent.shadowCentral.name] + '</small>';
    resultHTML += '</div>';
    resultHTML += '<div class="sefira-item">';
    resultHTML += '<strong>' + emergent.secondary.name + '</strong><br>';
    resultHTML += 'Kli: ' + emergent.secondary.value + '<br>';
    resultHTML += '<small>' + sefirotDefs[emergent.secondary.name] + '</small>';
    resultHTML += '</div>';
    resultHTML += '<div class="sefira-item">';
    resultHTML += '<strong>' + emergent.tertiary.name + '</strong><br>';
    resultHTML += 'Kli: ' + emergent.tertiary.value + '<br>';
    resultHTML += '<small>' + sefirotDefs[emergent.tertiary.name] + '</small>';
    resultHTML += '</div>';
    resultHTML += '</div>';
    resultHTML += '</div>';
    
    // 4. HABITANDO LA ESENCIA
    resultHTML += '<div class="result-card key-card">';
    resultHTML += '<h3>🌿 Habitando la Esencia</h3>';
    resultHTML += '<p><strong>' + emergent.missionKey.name + '</strong> (Kli ' + emergent.missionKey.value + ')</p>';
    resultHTML += '<p>' + sefirotDefs[emergent.missionKey.name] + '</p>';
    resultHTML += '<div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin: 10px 0;">';
    resultHTML += '<p><strong>🌱 Tu territorio sagrado:</strong> Esta Sefirá es el espacio donde tu esencia quiere habitar más plenamente.</p>';
    resultHTML += '<p><strong>💫 El camino es la morada:</strong> No busques transformarte desde afuera - <strong>habita lo que ya eres</strong> en esta dimensión.</p>';
    resultHTML += '</div>';
    resultHTML += '</div>';
    
    // 5. RESUMEN DEL ESTADO ENERGÉTICO
    resultHTML += '<div class="result-card key-card">';
    resultHTML += '<h3>📈 Resumen del Estado Energético</h3>';
    
    const overflowCount = klipot.overflow.length;
    const vacuumCount = klipot.vacuum.length;
    const criticalCount = klipot.critical.length;
    
    resultHTML += '<div class="summary-grid">';
    resultHTML += '<div class="summary-item" style="background: #fff5f5;">';
    resultHTML += '<strong>Vasijas Vacías</strong><br>';
    resultHTML += '<div class="summary-value" style="color: var(--danger);">' + vacuumCount + '</div>';
    resultHTML += '<small>Áreas bloqueadas</small>';
    resultHTML += '</div>';
    
    resultHTML += '<div class="summary-item" style="background: #fff4e6;">';
    resultHTML += '<strong>Desbordes</strong><br>';
    resultHTML += '<div class="summary-value" style="color: var(--warning);">' + overflowCount + '</div>';
    resultHTML += '<small>Excesos por canalizar</small>';
    resultHTML += '</div>';
    
    resultHTML += '<div class="summary-item" style="background: #f0f9ff;">';
    resultHTML += '<strong>Puntos Críticos</strong><br>';
    resultHTML += '<div class="summary-value" style="color: var(--success);">' + criticalCount + '</div>';
    resultHTML += '<small>Áreas en transformación</small>';
    resultHTML += '</div>';
    resultHTML += '</div>';
    
    let diagnostico = "";
    if (vacuumCount >= 3) {
        diagnostico = "Perfil predominantemente bloqueado - Necesita activación energética";
    } else if (overflowCount >= 3) {
        diagnostico = "Perfil predominantemente expansivo - Necesita canalización y enfoque";
    } else if (criticalCount >= 2) {
        diagnostico = "Perfil en transformación activa - Momentos de integración clave";
    } else {
        diagnostico = "Perfil balanceado - Enfocarse en la Sombra Central y Habitando la Esencia";
    }
    
    resultHTML += '<p><strong>Diagnóstico:</strong> ' + diagnostico + '</p>';
    resultHTML += '</div>';
    
    // 6. MAPA DE PRESIONES
    resultHTML += '<div class="result-card">';
    resultHTML += '<h3>🗺️ Mapa Completo de Presiones (TenSe)</h3>';
    resultHTML += '<div class="tense-map">';
    
    for (const [sefira, tense] of Object.entries(tenseMap)) {
        const isEmergent = [emergent.shadowCentral.name, emergent.secondary.name, emergent.tertiary.name].includes(sefira);
        const itemClass = isEmergent ? 'emergency-item' : 
                         tense.type === 'overflow' ? 'overflow-item' : 
                         tense.type === 'critical' ? 'critical-item' : '';
        
        resultHTML += '<div class="tense-item ' + itemClass + '">';
        resultHTML += '<strong>' + sefira + '</strong><br>';
        resultHTML += '<div class="tense-value">' + (tense.value === Infinity ? "∞" : tense.value.toFixed(2)) + '</div>';
        resultHTML += '<small>' + tense.state + '</small>';
        resultHTML += '</div>';
    }
    
    resultHTML += '</div>';
    resultHTML += '</div>';
    
    // 7. KLIPOT DE DESBORDE - TODAS
    if (klipot.overflow.length > 0) {
        resultHTML += '<div class="result-card overflow-card">';
        resultHTML += '<h3>🔥 Klipot de Desborde (TenSe > 1) - ' + klipot.overflow.length + ' detectadas</h3>';
        resultHTML += '<p><em>Áreas con exceso de energía que necesitan canalización</em></p>';
        
        klipot.overflow.sort((a, b) => b.tense.value - a.tense.value);
        
        klipot.overflow.forEach((klipa, index) => {
            const deepExplanation = getDeepKlipaExplanation(klipa.sefira, "overflow");
            
            resultHTML += '<div class="klipa-section klipa-overflow">';
            resultHTML += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
            resultHTML += '<strong>' + klipa.sefira + '</strong>';
            resultHTML += '<span class="tense-badge ' + klipa.tense.badge + '">';
            resultHTML += 'TenSe: ' + (klipa.tense.value === Infinity ? "∞" : klipa.tense.value.toFixed(2));
            resultHTML += '</span>';
            resultHTML += '</div>';
            
            resultHTML += '<div class="explanation-section">';
            resultHTML += '<div class="explanation-title">' + (index + 1) + '. ' + deepExplanation.title + '</div>';
            resultHTML += '<p>' + deepExplanation.explicacion + '</p>';
            resultHTML += '<p><strong>Manifestaciones comunes:</strong></p>';
            resultHTML += '<ul>';
            deepExplanation.manifestaciones.forEach(m => {
                resultHTML += '<li>' + m + '</li>';
            });
            resultHTML += '</ul>';
            resultHTML += '</div>';
            resultHTML += '</div>';
        });
        resultHTML += '</div>';
    }
    
    // 8. KLIPOT DE VASIJA VACÍA - TODAS
    if (klipot.vacuum.length > 0) {
        resultHTML += '<div class="result-card emergency-card">';
        resultHTML += '<h3>💢 Klipot de Vasija Vacía (TenSe < 1) - ' + klipot.vacuum.length + ' detectadas</h3>';
        resultHTML += '<p><em>Áreas con bloqueo energético que necesitan activación</em></p>';
        
        klipot.vacuum.sort((a, b) => a.tense.value - b.tense.value);
        
        klipot.vacuum.forEach((klipa, index) => {
            const deepExplanation = getDeepKlipaExplanation(klipa.sefira, "vacuum");
            
            resultHTML += '<div class="klipa-section klipa-vacuum">';
            resultHTML += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
            resultHTML += '<strong>' + klipa.sefira + '</strong>';
            resultHTML += '<span class="tense-badge ' + klipa.tense.badge + '">';
            resultHTML += 'TenSe: ' + klipa.tense.value.toFixed(2);
            resultHTML += '</span>';
            resultHTML += '</div>';
            
            resultHTML += '<div class="explanation-section">';
            resultHTML += '<div class="explanation-title">' + (index + 1) + '. ' + deepExplanation.title + '</div>';
            resultHTML += '<p>' + deepExplanation.explicacion + '</p>';
            resultHTML += '<p><strong>Manifestaciones comunes:</strong></p>';
            resultHTML += '<ul>';
            deepExplanation.manifestaciones.forEach(m => {
                resultHTML += '<li>' + m + '</li>';
            });
            resultHTML += '</ul>';
            resultHTML += '</div>';
            resultHTML += '</div>';
        });
        resultHTML += '</div>';
    }
    
    // 9. PUNTOS CRÍTICOS - TODOS
    if (klipot.critical.length > 0) {
        resultHTML += '<div class="result-card key-card">';
        resultHTML += '<h3>⚡ Puntos Críticos (TenSe = 1) - ' + klipot.critical.length + ' detectados</h3>';
        resultHTML += '<p><em>Áreas en perfecto balance energético - momentos de máxima potencialidad transformadora</em></p>';
        
        klipot.critical.forEach((klipa, index) => {
            const deepExplanation = getDeepKlipaExplanation(klipa.sefira, "critical");
            
            resultHTML += '<div class="klipa-section klipa-critical">';
            resultHTML += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">';
            resultHTML += '<strong>' + klipa.sefira + '</strong>';
            resultHTML += '<span class="tense-badge ' + klipa.tense.badge + '">';
            resultHTML += 'TenSe: ' + klipa.tense.value.toFixed(2);
            resultHTML += '</span>';
            resultHTML += '</div>';
            
            resultHTML += '<div class="explanation-section">';
            resultHTML += '<div class="explanation-title">' + (index + 1) + '. ' + deepExplanation.title + '</div>';
            resultHTML += '<p>' + deepExplanation.explicacion + '</p>';
            resultHTML += '<p><strong>Oportunidades de transformación:</strong></p>';
            resultHTML += '<ul>';
            deepExplanation.manifestaciones.forEach(m => {
                resultHTML += '<li>' + m + '</li>';
            });
            resultHTML += '</ul>';
            resultHTML += '</div>';
            resultHTML += '</div>';
        });
        resultHTML += '</div>';
    }
    
    // 10. BOTÓN PARA PRÁCTICAS
    resultHTML += '<div class="result-card tikkun-card">';
    resultHTML += '<h3>🔮 ¿Listo para Transformar?</h3>';
    resultHTML += '<p>Tu análisis está completo. Ahora puedes ver tus prácticas personalizadas.</p>';
    resultHTML += '<button class="secondary" onclick="showMidotPlan()">Ver Mis Prácticas</button>';
    resultHTML += '</div>';
    
    return resultHTML;
}
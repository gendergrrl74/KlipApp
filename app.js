// ========== INICIALIZACIÓN Y FUNCIONES AUXILIARES ==========

// Sistema de navegación
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });

    // Botón principal
    document.getElementById('calculateBtn').addEventListener('click', calculateAIOK);
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function showAnalysis() {
    document.querySelector('[data-tab="analysis"]').click();
}
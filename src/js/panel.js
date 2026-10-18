// Avisar a la ventana principal de que el panel está listo
window.addEventListener("DOMContentLoaded", function () {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ tipo: "PanelListo" }, window.location.origin);
    }
});

// Escuchar los mensajes enviados desde la página principal
window.addEventListener("message", function (evento) {
    // Validar origen, fuente y estructura de los datos
    if (evento.origin !== window.location.origin) return;
    if (evento.source !== window.parent) return;
    const datos = evento.data;
    if (!datos || datos.tipo !== "ActualizarPanel" || typeof datos.resumen !== "object" || datos.resumen === null) return;

    // Extraer los datos del resumen y validar su tipo
    const { total, presencial, online, ultimoNombre, ultimoFecha } = datos.resumen;
    if (typeof total !== "number" || typeof presencial !== "number" || typeof online !== "number") return;

    // Obtener los contenedores del DOM de panel.html
    const contTotal = document.getElementById("panel-total");
    const contModalidades = document.getElementById("panel-modalidades");
    const contUltimo = document.getElementById("panel-ultimo");

    // Si no hay inscripciones
    if (!datos.resumen || datos.resumen.total === 0) {
        if (contTotal) contTotal.textContent = "Sin inscripciones";
        if (contModalidades) contModalidades.textContent = "-";
        if (contUltimo) contUltimo.textContent = "-";
        return;
    }

    // Si hay datos válidos, actualizar el panel
    if (contTotal) contTotal.textContent = datos.resumen.total;
    
    if (contModalidades) {
        contModalidades.textContent = `Presencial: ${datos.resumen.presencial} | Online: ${datos.resumen.online}`;
    }

    if (contUltimo) {
        contUltimo.textContent = `${datos.resumen.ultimoNombre} (${datos.resumen.ultimoFecha})`;
    }
});
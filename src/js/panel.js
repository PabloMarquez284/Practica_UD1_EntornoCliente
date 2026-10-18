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
    const estado = document.getElementById("panel-estado");
    const listaDatos = document.getElementById("panel-datos");
    const contTotal = document.getElementById("panel-total");
    const contPresenciales = document.getElementById("panel-presenciales");
    const contOnline = document.getElementById("panel-online");
    const contUltimoNombre = document.getElementById("panel-ultimo-nombre");
    const contUltimoFecha = document.getElementById("panel-ultimo-fecha");

    // Si no hay inscripciones
    if (datos.resumen.total === 0) {
        if (estado) {
            estado.textContent = "Sin inscripciones";
            estado.hidden = false;
        }
        if (listaDatos) listaDatos.hidden = true;
        return;
    }

    // Si hay datos válidos: ocultar el mensaje "Sin inscripciones" y mostrar la lista
    if (estado) estado.hidden = true;
    if (listaDatos) listaDatos.hidden = false;

    // Actualizar los valores en pantalla
    if (contTotal) contTotal.textContent = datos.resumen.total;
    if (contPresenciales) contPresenciales.textContent = datos.resumen.presencial;
    if (contOnline) contOnline.textContent = datos.resumen.online;
    if (contUltimoNombre) contUltimoNombre.textContent = datos.resumen.ultimoNombre;
    if (contUltimoFecha) contUltimoFecha.textContent = datos.resumen.ultimoFecha;
});
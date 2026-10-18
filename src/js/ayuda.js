// Obtener los datos del navegador y sistema, y mostrarlos en la ventana de ayuda.html
document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del navegador y sistema
    const idioma = navigator.language || "Desconocido";
    const origen = location.origin || "Desconocido";
    const resolucion = screen.width + " x " + screen.height + " px";

    // Insertar los datos en los <span> de ayuda.html
    const elemIdioma = document.getElementById("nav-idioma");
    const elemOrigen = document.getElementById("nav-origen");
    const elemPantalla = document.getElementById("nav-pantalla");

    if (elemIdioma) elemIdioma.textContent = idioma;
    if (elemOrigen) elemOrigen.textContent = origen;
    if (elemPantalla) elemPantalla.textContent = resolucion;

    // 3. Botón para cerrar la ventana desde la propia ventana de ayuda
    const btnCerrar = document.getElementById("btn-cerrar-ventana");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", function () {
            window.close();
        });
    }
});
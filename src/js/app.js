// Importar los datos iniciales desde datos.js
let participantes = [...participantesIniciales];

// Esta función crea una tarjeta HTML para un participante dado
function crearTarjeta(participante) {
    // Crear el contenedor
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-participante");

    // Calcular clasificaciones simples
    let clasificacionEdad = "Mayor de edad";
    if (participante.edad < 18) {
        clasificacionEdad = "Menor de edad";
    }

    let clasificacionExp = "Inicial";
    if (participante.experiencia >= 7) {
        clasificacionExp = "Avanzada";
    } else if (participante.experiencia >= 4) {
        clasificacionExp = "Intermedia";
    }

    // Formatear la fecha a español
    const fecha = new Date(participante.fechaInscripcion).toLocaleString("es-ES");

    // Crear los textos
    const nombre = document.createElement("h3");
    nombre.textContent = participante.nombre;

    const id = document.createElement("p");
    id.textContent = "ID: " + participante.id;

    const edad = document.createElement("p");
    edad.textContent = "Edad: " + participante.edad + " (" + clasificacionEdad + ")";

    const tipoModalidad = document.createElement("p");
    tipoModalidad.textContent = "Tipo: " + participante.tipo + " - Modalidad: " + participante.modalidad;

    const experiencia = document.createElement("p");
    experiencia.textContent = "Experiencia: " + participante.experiencia + " años (" + clasificacionExp + ")";

    const fechaTexto = document.createElement("p");
    fechaTexto.textContent = "Inscrito el: " + fecha;

    // Crear el botón de borrar
    const btnBorrar = document.createElement("button");
    btnBorrar.textContent = "Borrar";
    btnBorrar.classList.add("btn-borrar");

    // Agregar el evento de borrar al botón
    btnBorrar.addEventListener("click", function () {
        const confirmar = confirm("¿Estás seguro de que deseas borrar a " + participante.nombre + "?");
        
        if (confirmar) {
            // Eliminamos al participante del array de memoria por su ID
            participantes = participantes.filter(function (p) {
                return p.id !== participante.id;
            });

            // Renderizamos las tarjetas y estadísticas después de borrar
            renderizarTarjetas(participantes);
            renderizarEstadisticas();
            enviarDatosAlPanel();
        }
    });

    // Agregar todos los elementos a la tarjeta
    tarjeta.append(nombre, id, edad, tipoModalidad, experiencia, fechaTexto, btnBorrar);

    return tarjeta;
}


// Esta función renderiza todas las tarjetas de participantes en el contenedor correspondiente
function renderizarTarjetas(lista) {
    // Buscar y limpiar el contenedor
    const contenedor = document.getElementById("contenedor-tarjetas");
    contenedor.textContent = "";

    // Recorrer la lista de participantes, generar y añadir cada tarjeta al contenedor
    for (const participante of lista) {
        const tarjeta = crearTarjeta(participante);
        contenedor.append(tarjeta);
    }
}


// Esta función actualiza las estadísticas en la pantalla
function renderizarEstadisticas() {
    // Obtener los datos calculados desde datos.js
    const estadisticas = calcularEstadisticas(participantes);

    // Recorrer el objeto de estadísticas propiedad por propiedad
    for (const clave in estadisticas) {
        const elemento = document.getElementById(clave);

        // Si el elemento existe en el HTML, actualizamos su texto
        if (elemento) {
            elemento.textContent = estadisticas[clave];
        }
    }
}


// Formulario de alta de participantes
const formParticipante = document.getElementById("form-participante");
const mensajeErrorForm = document.getElementById("mensaje-error-form");

// Escuchar el evento submit
formParticipante.addEventListener("submit", function (e) {
    // Evitar que la página se recargue
    e.preventDefault();

    // Extraer y formatear los datos de los inputs
    const nombreInput = document.getElementById("nombre").value.trim();
    const edadInput = parseInt(document.getElementById("edad").value, 10);
    const tipoInput = document.getElementById("tipo").value;
    const modalidadInput = document.getElementById("modalidad").value;
    const expInput = parseFloat(document.getElementById("experiencia").value);

    // Empaquetar los datos para la validación
    const datosFormulario = {
        nombre: nombreInput,
        edad: edadInput,
        tipo: tipoInput,
        modalidad: modalidadInput,
        experiencia: expInput
    };

    // Validar con datos.js
    const resultado = validarParticipante(datosFormulario);

    // Si no es válido, mostramos los errores
    if (!resultado.esValido) {
        mensajeErrorForm.textContent = resultado.errores.join(" | ");
        mensajeErrorForm.hidden = false; // Nos aseguramos de mostrarlo
        return;
    }

    // Si es válido, ocultamos y limpiamos el mensaje de error
    mensajeErrorForm.textContent = "";
    mensajeErrorForm.hidden = true;

    // Generar ID único
    const nuevoId = generarId(participantes);

    // Crear el objeto participante definitivo
    const nuevoParticipante = {
        id: nuevoId,
        nombre: nombreInput,
        edad: edadInput,
        tipo: tipoInput,
        modalidad: modalidadInput,
        experiencia: expInput,
        fechaInscripcion: new Date().toISOString()
    };

    // Guardar en la colección global
    participantes.push(nuevoParticipante);

    // Renderizar las tarjetas y estadísticas actualizadas
    renderizarTarjetas(participantes);
    renderizarEstadisticas();
    enviarDatosAlPanel();

    // Limpiar el formulario
    formParticipante.reset();
});


// Esta función aplica los filtros de búsqueda y modalidad a la lista de participantes
function aplicarFiltros() {
    const textoBuscar = document.getElementById("input-buscar-nombre").value.trim().toLowerCase();
    const modalidadFiltro = document.getElementById("select-filtro-modalidad").value;
    const mensajeVacio = document.getElementById("mensaje-busqueda-vacia");

    // Filtrar la lista de participantes según los criterios
    const resultado = participantes.filter(function (p) {
    
    // Comprobar si el nombre incluye el texto
    const coincideNombre = p.nombre.toLowerCase().includes(textoBuscar);

    // Comprobar si la modalidad coincide o si no hay filtro seleccionado / es "todas"
    const coincideModalidad = (modalidadFiltro === "" || modalidadFiltro === "todas") || p.modalidad === modalidadFiltro;

    // Se deben cumplir ambas condiciones
    return coincideNombre && coincideModalidad;
});

// Mostrar u ocultar el aviso si no hay coincidencias
if (resultado.length === 0) {
    mensajeVacio.hidden = false;
} else {
    mensajeVacio.hidden = true;
}
    // Renderizar las tarjetas filtradas
    renderizarTarjetas(resultado);
}

// Escuchadores de eventos para los filtros
document.getElementById("input-buscar-nombre").addEventListener("input", aplicarFiltros);
document.getElementById("select-filtro-modalidad").addEventListener("change", aplicarFiltros);



// Variable en memoria como respaldo si las cookies están bloqueadas por el navegador
const prefsEnMemoria = {
    tema: "claro",
    tamano: "normal"
};

// Guardar cookie con sus atributos
function guardarCookie(nombre, valor, maxAgeSegundos) {
    const valorCodificado = encodeURIComponent(valor);
    let cookieStr = `${nombre}=${valorCodificado}; Max-Age=${maxAgeSegundos}; Path=/; SameSite=Lax`;
    
    if (window.location.protocol === 'https:') {
        cookieStr += '; Secure';
    }
    
    document.cookie = cookieStr;
}

// Leer cookie por nombre y decodificar su valor
function leerCookie(nombre) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(nombre + '=')) {
            const valorCodificado = cookie.substring(nombre.length + 1);
            return decodeURIComponent(valorCodificado);
        }
    }
    return null;
}


// Esta función aplica las preferencias de tema y tamaño de fuente según las cookies o la memoria
function aplicarPreferencias() {
    let tema = leerCookie("tema") || prefsEnMemoria.tema;
    let tamano = leerCookie("tamano") || prefsEnMemoria.tamano;

    // Validar opciones permitidas (si son inválidas, usar valores por defecto: claro / normal)
    if (tema !== "claro" && tema !== "oscuro") {
        tema = "claro";
    }
    if (tamano !== "normal" && tamano !== "grande") {
        tamano = "normal";
    }

    // Actualizar variable en memoria
    prefsEnMemoria.tema = tema;
    prefsEnMemoria.tamano = tamano;

    // Aplicar clase de tema
    document.body.classList.remove("tema-claro", "tema-oscuro");
    document.body.classList.add("tema-" + tema);

    // Aplicar tamaño de fuente
    if (tamano === "grande") {
        document.body.classList.add("fuente-grande");
    } else {
        document.body.classList.remove("fuente-grande");
    }

    // Sincronizar los selects
    const selectTema = document.getElementById("select-tema");
    const selectTamano = document.getElementById("select-tamano");

    if (selectTema) selectTema.value = tema;
    if (selectTamano) selectTamano.value = tamano;
}

// Evento para Guardar Preferencias
document.getElementById("btn-guardar-pref").addEventListener("click", function () {
    const temaSeleccionado = document.getElementById("select-tema").value || "claro";
    const tamanoSeleccionado = document.getElementById("select-tamano").value || "normal";

    // Guardar en cookies por 30 días
    guardarCookie("tema", temaSeleccionado, 2592000);
    guardarCookie("tamano", tamanoSeleccionado, 2592000);

    // Guardar también en memoria por si las cookies están bloqueadas
    prefsEnMemoria.tema = temaSeleccionado;
    prefsEnMemoria.tamano = tamanoSeleccionado;

    // Aplicar los cambios
    aplicarPreferencias();
});

// Evento para Restablecer Preferencias
document.getElementById("btn-restablecer-pref").addEventListener("click", function () {
    // Borrar cookies
    guardarCookie("tema", "", 0);
    guardarCookie("tamano", "", 0);

    // Restablecer valores en memoria
    prefsEnMemoria.tema = "claro";
    prefsEnMemoria.tamano = "normal";

    // Reajustar desplegables y reaplicar
    document.getElementById("select-tema").value = "";
    document.getElementById("select-tamano").value = "";

    aplicarPreferencias();
});


// Evento para exportar JSON
document.getElementById("btn-exportar-json").addEventListener("click", function () {
    const textarea = document.getElementById("textarea-json");
    // Convertimos el array global a texto JSON con formato indentado (2 espacios)
    textarea.value = JSON.stringify(participantes, null, 2);
});

// Evento para importar JSON
document.getElementById("btn-importar-json").addEventListener("click", function () {
    // Obtener el contenido del textarea
    const textarea = document.getElementById("textarea-json");
    const mensajeErrorJson = document.getElementById("mensaje-error-json");

    try {
        // Intentamos parsear el texto a objeto/array JS
        const datosImportados = JSON.parse(textarea.value);

        // 2. Comprobamos si es un Array
        if (!Array.isArray(datosImportados)) {
            mensajeErrorJson.textContent = "Error: El JSON importado no es un array de participantes";
            mensajeErrorJson.hidden = false;
        } else {
            participantes = datosImportados;
            renderizarTarjetas(participantes);
            renderizarEstadisticas();
            enviarDatosAlPanel();
            mensajeErrorJson.hidden = true;
            textarea.value = ""; // Limpiar el textarea después de importar
        }

    } catch (error) {
        // Si hay un error de parseo, lo mostramos
        mensajeErrorJson.textContent = "Error al importar JSON: " + error.message;
        mensajeErrorJson.hidden = false;
    }
});


// Esta función envía los datos de resumen al iframe del panel
function enviarDatosAlPanel() {
    const iframe = document.getElementById("iframe-panel");
    if (!iframe || !iframe.contentWindow) return;

    // Calcular participante más reciente
    let ultimo = null;
    if (participantes.length > 0) {
        ultimo = participantes.reduce((masReciente, actual) => {
            return new Date(actual.fechaInscripcion) > new Date(masReciente.fechaInscripcion) ? actual : masReciente;
        });
    }

    // Contar por modalidad
    const presencial = participantes.filter(p => p.modalidad === "presencial").length;
    const online = participantes.filter(p => p.modalidad === "online").length;

    const resumen = {
        total: participantes.length,
        presencial: presencial,
        online: online,
        ultimoNombre: ultimo ? ultimo.nombre : "-",
        ultimoFecha: ultimo ? new Date(ultimo.fechaInscripcion).toLocaleDateString("es-ES") : "-"
    };

    // Enviar al iframe con origen seguro
    iframe.contentWindow.postMessage({
        tipo: "ActualizarPanel",
        resumen: resumen
    }, window.location.origin);
}

// Escucha mensajes del iframe y responde cuando el panel está listo
window.addEventListener("message", function (evento) {
    // Comprobar que el mensaje proviene del iframe correcto
    const iframe = document.getElementById("iframe-panel");
    if (evento.origin !== window.location.origin) return;
    if (!iframe || evento.source !== iframe.contentWindow) return; // <-- Validación de source agregada
    
    // Si el mensaje indica que el panel está listo, enviamos los datos
    if (evento.data && evento.data.tipo === "PanelListo") {
        enviarDatosAlPanel();
    }
});


// Variable global para controlar la referencia de la ventana emergente
let ventanaAyuda = null;

// Botón para abrir o enfocar la ayuda
document.getElementById("btn-abrir-ayuda").addEventListener("click", function () {
  // Si la ventana no existe o está cerrada, la abrimos
  if (!ventanaAyuda || ventanaAyuda.closed) {
    ventanaAyuda = window.open("ayuda.html", "VentanaAyuda", "width=600,height=500");

    // Comprobar si el navegador bloqueó la ventana emergente
    if (!ventanaAyuda) {
      alert("El navegador ha bloqueado la ventana emergente. Por favor, permítela para ver la ayuda.");
    }
  } else {
    // Si la ventana ya está abierta, simplemente la enfocamos
    ventanaAyuda.focus();
  }
});

// Botón para cerrar la ventana de ayuda desde la página principal
const btnCerrarAyudaMain = document.getElementById("btn-cerrar-ayuda");
if (btnCerrarAyudaMain) {
    btnCerrarAyudaMain.addEventListener("click", function () {
        if (ventanaAyuda && !ventanaAyuda.closed) {
            ventanaAyuda.close();
        }
    });
}

// Al cargar la página, renderizamos las tarjetas y estadísticas iniciales y aplicamos las preferencias guardadas
renderizarTarjetas(participantes);
renderizarEstadisticas();
aplicarPreferencias();
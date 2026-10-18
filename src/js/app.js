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

            // Refrescamos la pantalla y los cálculos
            renderizarTarjetas(participantes);
            renderizarEstadisticas();
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

    // Renderizar la interfaz (tarjetas y estadísticas)
    renderizarTarjetas(participantes);
    renderizarEstadisticas();

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
    // Volver a renderizar las tarjetas pasando solo el array filtrado
    renderizarTarjetas(resultado);
}

// Escuchadores de eventos para los filtros
document.getElementById("input-buscar-nombre").addEventListener("input", aplicarFiltros);
document.getElementById("select-filtro-modalidad").addEventListener("change", aplicarFiltros);
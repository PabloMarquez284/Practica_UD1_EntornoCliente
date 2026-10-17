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

// Llamar a las funciones de renderizado al cargar la página
renderizarTarjetas(participantes);
renderizarEstadisticas();
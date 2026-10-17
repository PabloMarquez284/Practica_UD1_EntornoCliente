const participantesIniciales = [
  {
    id: 483721,
    nombre: "Ana García",
    edad: 17,
    tipo: "estudiante",
    modalidad: "presencial",
    fechaInscripcion: "2026-10-08T08:30:00.000Z",
    experiencia: 4
  },
  {
    id: 846782,
    nombre: "Carlos Hermosa",
    edad: 20,
    tipo: "invitado",
    modalidad: "presencial",
    fechaInscripcion: "2026-10-17T11:30:00.000Z",
    experiencia: 6
  },
  {
    id: 663467,
    nombre: "Emilio Cózar",
    edad: 36,
    tipo: "profesional",
    modalidad: "online",
    fechaInscripcion: "2026-10-17T12:15:00.000Z",
    experiencia: 9
  }
];

// Esta función valida los datos de un participante y devuelve un objeto con la validez y los errores encontrados
function validarParticipante(datos) {
    const errores = [];

    // Verificar que 'datos' sea un objeto válido
    if (!datos || typeof datos !== "object") {
        return { 
            esValido: false, 
            errores: ["Los datos proporcionados no son válidos."] 
        };
    }

    // Validar Nombre
    const nombre = datos.nombre.trim();
    if (nombre.length < 2 || nombre.length > 60) {
        errores.push("El nombre debe tener entre 2 y 60 caracteres.");
    }

    // Validar Edad
    const edadTexto = String(datos.edad).trim();
    const edad = Number(edadTexto);
    if (edadTexto === "" || isNaN(edad) || !Number.isInteger(edad) || edad < 0 || edad > 120) {
        errores.push("La edad debe ser un número entero entre 0 y 120.");
    }

    // Validar Tipo
    if (datos.tipo !== "estudiante" && datos.tipo !== "profesional" && datos.tipo !== "invitado") {
        errores.push("El tipo debe ser estudiante, profesional o invitado.");
    }

    // Validar Modalidad
    if (datos.modalidad !== "presencial" && datos.modalidad !== "online") {
        errores.push("La modalidad debe ser presencial u online.");
    }

    // Validar Experiencia
    const expTexto = String(datos.experiencia).trim();
    const experiencia = Number(expTexto);
    if (expTexto === "" || isNaN(experiencia) || experiencia < 0 || experiencia > 10) {
        errores.push("La experiencia debe ser un número entre 0 y 10.");
    }

    // Devolver el resultado
    return {
        esValido: errores.length === 0,
        errores: errores
    };
}

// Esta función genera un ID único para un nuevo participante
function generarId(participantes) {
    let intentos = 0;
    const maxIntentos = 100;

    while (intentos < maxIntentos) {
        // Genera un número entero aleatorio entre 100000 y 999999
        const idGenerado = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        // Comprobar si ya existe en la lista de participantes
        let existe = false;
        for (const p of participantes) {
            if (p.id === idGenerado) {
                existe = true;
            break;
            }
        }

        // Si no existe, este ID es válido y lo devolvemos
        if (!existe) {
            return idGenerado;
        }

        intentos++;
    }

    // Si se superan los 100 intentos, devolvemos null para indicar que falló
    return null;
}

// Esta función calcula estadísticas a partir de la lista de participantes
function calcularEstadisticas(participantes) {
    // Caso de lista vacía o sin datos
    if (!participantes || participantes.length === 0) {
        return {
            total: 0,
            menores: 0,
            mayores: 0,
            edadMedia: "Sin datos",
            edadMin: "Sin datos",
            edadMax: "Sin datos",
            presenciales: 0,
            online: 0,
            estudiantes: 0,
            profesionales: 0,
            invitados: 0,
            expMediaPresencial: "Sin datos",
            primerMenor: "Sin datos"
        };
    }

    // Variables para acumular y contar
    let total = participantes.length;
    let menores = 0;
    let mayores = 0;

    let sumaEdades = 0;
    let edadMin = participantes[0].edad;
    let edadMax = participantes[0].edad;

    let presenciales = 0;
    let online = 0;

    let estudiantes = 0;
    let profesionales = 0;
    let invitados = 0;

    let sumaExpPresencial = 0;
    let cantPresencialesExp = 0;

    // Bucle principal para totales, edades, tipos y modalidades
    for (const p of participantes) {
        // Contar menores y mayores de edad
        if (p.edad < 18) {
        menores++;
        } else {
        mayores++;
        }

        // Edades (suma, mínima y máxima)
        sumaEdades += p.edad;
        if (p.edad < edadMin) edadMin = p.edad;
        if (p.edad > edadMax) edadMax = p.edad;

        // Contar tipos
        if (p.tipo === "estudiante") estudiantes++;
        if (p.tipo === "profesional") profesionales++;
        if (p.tipo === "invitado") invitados++;

        // Contar modalidades
        if (p.modalidad === "presencial") presenciales++;
        if (p.modalidad === "online") online++;
    }

    // Bucle para Experiencia Presencial
    for (const p of participantes) {
        // Si no es presencial, saltamos esta iteración
        if (p.modalidad !== "presencial") {
            continue;
        }
        sumaExpPresencial += p.experiencia;
        cantPresencialesExp++;
    }

    // Bucle para buscar al primer menor de edad
    let primerMenor = "Sin datos";
    for (const p of participantes) {
        if (p.edad < 18) {
            primerMenor = p.nombre;
            break; // Detenemos el bucle en cuanto encontramos al primero
        }
    }

    // Cálculo de medias en formato string con dos decimales
    const edadMediaCalculada = (sumaEdades / total).toFixed(2);

    let expPresencialCalculada = "Sin datos";
    if (cantPresencialesExp > 0) {
        expPresencialCalculada = (sumaExpPresencial / cantPresencialesExp).toFixed(2);
    }

    // Devolver el objeto con todas las estadísticas
    return {
        total: total,
        menores: menores,
        mayores: mayores,
        edadMedia: edadMediaCalculada,
        edadMin: edadMin,
        edadMax: edadMax,
        presenciales: presenciales,
        online: online,
        estudiantes: estudiantes,
        profesionales: profesionales,
        invitados: invitados,
        expMediaPresencial: expPresencialCalculada,
        primerMenor: primerMenor
    };
}
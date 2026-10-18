# Practica UD1 - Entorno Cliente

Esta práctica consta de desarrollar una **aplicación para gestionar las inscripciones de un evento tecnológico**. Dicha aplicación web permite dar de alta y borrar participantes, consultar estadísticas, intercambiar información con un iframe y guardar preferencias mediante cookies.

Este trabajo lo he realizado junto con el apoyo de la IA, guiándome paso a paso y ayudándome en los errores que he tenido. Dejo por aquí el enlace al chat con Gemini: https://gemini.google.com/share/d/1KY3qQySt28mI60HGSkDA6OWGIcrVC9pw?usp=drive_link

En primer lugar, he realizado los archivos **HTML** y **CSS** muy simples y claros para el usuario, haciendo uso de HTML semántico. En cuanto a los HTML, son 3 archivos: index.html, ayuda.html y panel.html.

### 1. INDEX.HTML

**HEAD**: tittle, link al css y link a los srcipts js con defer

**BODY**:
- **Header**: titulo principal, controles de preferencia de la aplicación (tema claro u oscuro, tamaño de fuente normal o grande) y botones para guardar las referencias, restablecerlas y uno de ayuda (**ayuda.html**)

- **Main**: 
    - **form**: con sus etiquetas label y input o select, con un boton al final para dar de alta. Este formulario debe pedir el nombre completo,o la edad, el tipo de participante, la modalidad y los años de experiencia. Cuando utilices select, utiliza esto como primera "opcion" para que no salga nada por defecto: **<option value="" selected hidden></option>**
    - **Búsqueda y filtros**: label+input para buscar por nombre y label+select para filtrar con modalidad, poniendo lo mismo que dije antes como primera "opción"
    - **Listado de participantes**: acceso a un contenedor donde JS insertará las tarjetas de los participantes dinámicamente
    - **Estadísticas**: una lista con viñetas donde se encuentren el número total de participantes y número de menores y mayores de edad, la edad media, mínima y máxima, la cantidad de participantes de cada modalidad y de cada tipo, y la experiencia media de los participantes presenciales
    - **Gestión de datos**: datos de la colección y dos botones para importar JSON y exportar JSON 
    - **Panel Informativo (iframe)**: resumen con las cosas fundamentales del evento que va hacia **panel.html**

- **Footer**: con el copyright, el año y el nombre del proyecto

### 2. AYUDA.HTML

**HEAD**: tittle, link al css y link al srcipt **ayuda.js** con defer

**BODY**: 
- **Header**: únicamente el título de la página

- **Main**: 
    - **Información clave**: secciones con información del ayuda al usuario para dar de altas a participantes, importar y exportar JSON y algunas preferencias
    - **Información del navegador y entorno**: idioma, origen y resolución de pantalla
    - **Cerrar ventana**: un botón para cerrar dicha ventana y volver a la página principal (**index.html**)

### 3. PANEL.HTML

**HEAD**: tittle, link al css y link  al srcipt **panel.js** con defer

**BODY**: 
- **Header**: únicamente el título de la página

- **Main**: 
    - **Resumen del evento**: infromación resumida del evento, como el número total de participantes inscritos, por modalidad (presencial y online) y la última inscripción

Para que estas páginas sean visuales y legibles de una manera adecuada para cualquier usuario, he implementado un archivo **CSS** sencillo con lo siguiente:
- **Colores**: para texto, fondos, botones y mensajes de error
- **Tarjetas**: para organizar mejor la información
- **Animación**: breve animación al pasar el ratón por un botón

Una vez terminada la maquetación y la estructura de estilos, pasamos a la programación del comportamiento y la lógica de la aplicación en **JavaScript**, la cual está dividida en 4 archivos según sus responsabilidades: datos.js, app.js, ayuda.js y panel.js.

### 1. DATOS.JS

Este archivo contiene la lista de participantes en memoria (**participantesIniciales**) y la lógica pura de negocio y cálculo. Cumple estrictamente con la regla de no acceder ni modificar el DOM directamente, devolviendo siempre datos procesados. Se compone de las siguientes funciones:

* **validarParticipante(datos)**: comprueba que los datos del formulario o de una importación sean fiables. He usado **.trim()** al nombre para verificar que su longitud se encuentre entre 2 y 60 caracteres. Valida que la edad no esté vacía, sea un número entero (**Number.isInteger()**) y esté entre 0 y 120. Luego, he verificado que el tipo sea "estudiante", "profesional" o "invitado", y la modalidad "presencial" u "online". Por último, he validado que la experiencia sea un número finito entre 0 y 10. Devuelve un objeto con la propiedad **esValido** y la lista con los **errores** detectados
* **generarId(participantes)**: calcula un identificador aleatorio único de 6 dígitos (entre 100000 y 999999) utilizando **Math.random()**. Para evitar bloquear la pestaña del navegador, he utilizado un bucle **while** limitado a un máximo de 100 intentos, comprobando en cada iteración mediante un **for...of** con **break** que el ID no exista en la colección
* **calcularEstadisticas(participantes)**: realiza todos los cálculos métricos de la colección mediante bucles **for...of**. Si la lista está vacía, establece las medias. En el cálculo de la experiencia presencial salta los participantes online con **continue**, y localiza al primer menor de edad interrumpiendo el bucle con **break**. Devuelve las medias formateadas con dos decimales mediante **.toFixed(2)**


### 2. APP.JS

Es el archivo principal de control de la página **index.html**. Se encarga de gestionar la interacción del usuario con la interfaz, actualizar el DOM y coordinar las distintas funciones:

* **crearTarjeta(participante)**: construye la tarjeta HTML de un participante utilizando **document.createElement()**, **textContent** y **append()**. Calcula las clasificaciones de edad ("Menor de edad" / "Mayor de edad") y experiencia ("Inicial", "Intermedia" o "Avanzada"), da formato a la fecha en español con **toLocaleString("es-ES")** y añade un botón de borrado que solicita confirmación mediante **confirm()**
* **renderizarTarjetas(lista)**: limpia el contenedor de listado mediante **textContent = ""** y recorre el array recibido para generar y mostrar las tarjetas dinámicamente
* **renderizarEstadisticas()**: obtiene las estadísticas calculadas en **datos.js** y las actualiza en el HTML recorriendo las propiedades del objeto con un bucle **for...in** para hacer coincidir las claves con los **id** de las etiquetas **<span>**
* **Formulario de Alta (#form-participante)**: intercepta el evento **submit** con **e.preventDefault()**, extrae y limpia los valores, los valida mediante **validarParticipante()**, genera un ID único, asigna la fecha ISO actual (**new Date().toISOString()**) y añade el nuevo participante a la colección en memoria. Tras el alta, actualiza tarjetas, estadísticas y borra los campos con **.reset()**
* **aplicarFiltros()**: escucha el evento **input** del buscador por nombre y **change** del filtro de modalidad. También he creado un array secundario filtrado con **.filter()** sin modificar la lista original de participantes y actualizando la vista. Si no hay resultados, muestra el aviso de búsqueda vacía
* **Gestión de Preferencias mediante Cookies**: guarda y recupera el tema y el tamaño de fuente usando cookies con un tiempo de vida de 30 días (**Max-Age=2592000**), **Path=/** y **SameSite=Lax**. Además, he mantenido una variable de respaldo en memoria por si las cookies están bloqueadas en el navegador, e incluye la opción de restablecer a valores por defecto
* **Gestión de Datos JSON**: permite exportar la colección actual mediante **JSON.stringify(participantes, null, 2)** y procesar importaciones con **JSON.parse()**. He gestionado los fallos con **try/catch** y comprueba que el formato importado sea un array válido antes de actualizar la aplicación
* **Comunicación con el Panel (Iframe)**: envía las métricas actualizadas mediante **postMessage()** hacia el iframe comprobando siempre la seguridad de origen (**window.location.origin**)
* **Ventana de Ayuda Externa**: abre **ayuda.html** usando **window.open()**, guardando la referencia en la variable **ventanaAyuda** para reenfocarla con **.focus()** si ya estaba abierta y avisando al usuario en caso de que los emergentes estén bloqueados


### 3. AYUDA.JS

Este archivo gestiona el funcionamiento de la ventana emergente de ayuda (**ayuda.html**):

* Obtiene y muestra los metadatos del navegador leyendo **navigator.language (idioma)**, **location.origin** (origen de la aplicación) y **screen.width** con **screen.height** (resolución de pantalla)
* Añade la funcionalidad al botón de cierre para cerrar la ventana secundaria mediante **window.close()**


### 4. PANEL.JS

Este archivo se ejecuta exclusivamente dentro del iframe (**panel.html**):

* Al cargarse la página, envía un mensaje inicial **PanelListo** a la ventana madre mediante **window.parent.postMessage()**
* Escucha los mensajes de actualización filtrando y validando la procedencia (**event.origin** y **event.source**)
* Actualiza su propio DOM mostrando el total de inscritos, el desglose por modalidad y el nombre junto a la fecha de la última inscripción realizada. Si no hay datos, indica "Sin inscripciones"
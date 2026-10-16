# Practica UD1 - Entorno Cliente

Esta práctica consta de desarrollar una **aplicación para gestionar las inscripciones de un evento tecnológico**. Dicha aplicación web permite dar de alta y borrar participantes, consultar estadísticas, intercambiar información con un iframe y guardar preferencias mediante cookies.

En primer lugar, he realizado los archivos HTML y CSS muy simples y claros para el usuario, haciendo uso de HTML semántico. En cuanto a los HTML, son 3 archivos: index.html, ayuda.html y panel.html.

#### 1. INDEX.HTML

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

#### 2. AYUDA.HTML

**HEAD**: tittle, link al css y link al srcipt **ayuda.js** con defer

**BODY**: 
- **Header**: únicamente el título de la página

- **Main**: 
    - **Información clave**: secciones con información del ayuda al usuario para dar de altas a participantes, importar y exportar JSON y algunas preferencias
    - **Información del navegador y entorno**: idioma, origen y resolución de pantalla
    - **Cerrar ventana**: un botón para cerrar dicha ventana y volver a la página principal (**index.html**)

#### 3. PANEL.HTML

**HEAD**: tittle, link al css y link  al srcipt **panel.js** con defer

**BODY**: 
- **Header**: únicamente el título de la página

- **Main**: 
    - **Resumen del evento**: infromación resumida del evento, como el número total de participantes inscritos, por modalidad (presencial y online) y la última inscripción

Para que estas páginas sean visuales y legibles de una manera adecuada para cualquier usuario, he implementado un archivo CSS sencillo con lo siguiente:
- **Colores**: para texto, fondos, botones y mensajes de error
- **Tarjetas**: para organizar mejor la información
- **Animación**: breve animación al pasar el ratón por un botón
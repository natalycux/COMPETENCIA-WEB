const API_BASE_URL = 'https://encuestas-api-umg-2025-dufuecexbveadnfc.eastus-01.azurewebsites.net/api';
let encuestaActivaId = 0;

// --- FUNCIÓN PARA CARGAR LA ENCUESTA (GET /Encuestas/{id}) ---
async function cargarEncuesta(id) {
    encuestaActivaId = id;
    const contenedorEncuesta = document.getElementById('contenedor-encuesta');
    contenedorEncuesta.innerHTML = '<div class="card-body text-center">Cargando Encuesta...</div>';
    document.getElementById('contenedor-resumen').innerHTML = '<div class="card-body text-center text-muted"><h5 class="card-title">Los resultados aparecerán aquí.</h5></div>';

    try {
        const response = await fetch(`${API_BASE_URL}/Encuestas/${id}`);
        if (!response.ok) throw new Error('Error al cargar la encuesta.');
        const encuesta = await response.json();

        let html = `<div class="card-header"><h3>${encuesta.nombre}</h3></div>`;
        html += `<div class="card-body">`;
        html += `<p>${encuesta.descripcion}</p>`;
        html += `
            <div class="mb-4">
                <input type="text" id="usuarioID" class="form-control usuario-id-input" placeholder="Ingresa tu ID de usuario (ej: ncuxr)">
            </div>
        `;

        html += `<div class="preguntas-container">`;
        encuesta.preguntas.forEach(pregunta => {
            html += `<div class="pregunta"><h5>${pregunta.textoPregunta}</h5>`;
            pregunta.opciones.forEach(opcion => {
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${opcion.opcionID}" id="opcion-${opcion.opcionID}">
                        <label class="form-check-label" for="opcion-${opcion.opcionID}">${opcion.textoOpcion}</label>
                    </div>
                `;
            });
            html += `</div>`;
        });
        html += `</div>`;

        html += `
            <div class="mt-4">
                <button class="btn btn-success w-100" onclick="enviarRespuestas()">Enviar Respuestas</button>
            </div>
        `;
        html += `</div>`;
        contenedorEncuesta.innerHTML = html;
    
    } catch (error) {
        contenedorEncuesta.innerHTML = `<div class="card-body text-danger text-center"><strong>Error:</strong> ${error.message}</div>`;
    }
}

// --- FUNCIÓN PARA ENVIAR RESPUESTAS (POST /Encuestas/responder) ---
async function enviarRespuestas() {
    const usuarioID = document.getElementById('usuarioID').value;
    if (!usuarioID) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...', 
            text: 'Por favor, ingresa un ID de usuario.',
            confirmButtonColor: 'var(--primary-color)'
        });
        return;
    }

    const checkboxes = document.querySelectorAll('#contenedor-encuesta input[type="checkbox"]:checked');
    const respuestas = Array.from(checkboxes).map(cb => ({
        opcionID: parseInt(cb.value),
        seleccionado: 1
    }));

    if (respuestas.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Espera',
            text: 'Debes seleccionar al menos una opción.',
            confirmButtonColor: 'var(--primary-color)'
        });
        return;
    }
    
    const payload = { usuarioID, respuestas };

    try {
        const response = await fetch(`${API_BASE_URL}/Encuestas/responder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Gracias por tus respuestas!',
                text: 'Tus respuestas han sido enviadas correctamente.',
                showConfirmButton: false,
                timer: 2000
            });
            mostrarResumen(encuestaActivaId);
        } else {
            const errorData = await response.json();
            let errorMsg = errorData.title || 'Error desconocido.';
            if (errorData.errors) {
                errorMsg += "\n" + Object.values(errorData.errors).flat().join("\n");
            }
            Swal.fire({
                icon: 'error',
                title: 'Error al enviar',
                text: errorMsg,
                confirmButtonColor: 'var(--danger-color)'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: error.message,
            confirmButtonColor: 'var(--danger-color)'
        });
    }
}

// --- FUNCIÓN PARA MOSTRAR RESUMEN (GET /Encuestas/resumen/{id}) ---
async function mostrarResumen(id) {
    const contenedorResumen = document.getElementById('contenedor-resumen');
    contenedorResumen.innerHTML = '<div class="card-body text-center">Cargando Resumen...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/Encuestas/resumen/${id}`);
        if (!response.ok) throw new Error('Error al cargar el resumen.');
        const resumen = await response.json();
        
        // CORRECCIÓN: Usamos .nombre, .preguntas
        let html = `<div class="card-header"><h3>Resumen: ${resumen.nombre}</h3></div>`;
        html += `<div class="card-body">`;

        resumen.preguntas.forEach(pregunta => {
            // CORRECCIÓN: Usamos .porcentaje, .textoPregunta
            let claseColor = '';
            let emoji = '';
            if (pregunta.porcentaje >= 60) {
                claseColor = 'resumen-verde';
                emoji = '✅';
            } else if (pregunta.porcentaje >= 30) {
                claseColor = 'resumen-amarillo';
                emoji = '🟡';
            } else {
                claseColor = 'resumen-rojo';
                emoji = '🔴';
            }
            html += `<div class="resumen-pregunta ${claseColor}"><p class="mb-0"><strong>${emoji} ${pregunta.porcentaje.toFixed(2)}%</strong> - ${pregunta.textoPregunta}</p></div>`;
        });
        
        html += `</div>`;
        contenedorResumen.innerHTML = html;

    } catch (error) {
         contenedorResumen.innerHTML = `<div class="card-body text-danger text-center"><strong>Error:</strong> ${error.message}</div>`;
    }
}
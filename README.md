# Plataforma de Encuestas UMG

Este proyecto es una aplicación web completa que consiste en un backend de API RESTful construido con .NET 8 y un frontend dinámico construido con HTML, Bootstrap 5 y JavaScript. La aplicación permite a los usuarios ver y responder a diferentes encuestas, así como visualizar los resultados de las mismas.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:**
    * C# y .NET 8
    * ASP.NET Core Web API
    * Dapper (para comunicación con la base de datos)
    * SQL Server (alojado en Azure)

* **Frontend:**
    * HTML5
    * CSS3
    * Bootstrap 5
    * JavaScript (ES6+)

* **Plataforma de Despliegue:**
    * Azure App Service

---

## 🚀 Backend API (EncuestasAPI)

El backend expone una serie de endpoints para gestionar las encuestas. La URL base de la API desplegada es:
`https://encuestas-api-umg-2025-dufuecexbveadnfc.eastus-01.azurewebsites.net`

### Endpoints Disponibles

#### 1. Obtener Lista de Todas las Encuestas
Devuelve un resumen de todas las encuestas disponibles.
* **Método:** `GET`
* **URL:** `/api/Encuestas`

#### 2. Obtener el Detalle de una Encuesta
Devuelve una encuesta específica con todas sus preguntas y opciones.
* **Método:** `GET`
* **URL:** `/api/Encuestas/{id}`
* **Ejemplo:** `/api/Encuestas/1`

#### 3. Obtener el Resumen de Resultados
Devuelve un resumen con los resultados y porcentajes de una encuesta específica.
* **Método:** `GET`
* **URL:** `/api/Encuestas/resumen/{id}`
* **Ejemplo:** `/api/Encuestas/resumen/1`

#### 4. Enviar Respuestas
Registra las respuestas de un usuario para una encuesta.
* **Método:** `POST`
* **URL:** `/api/Encuestas/responder`
* **Cuerpo (Body) requerido (JSON):**
    ```json
    {
      "usuarioID": "ncuxr",
      "respuestas": [
        {
          "opcionID": 1,
          "seleccionado": 1
        },
        {
          "opcionID": 7,
          "seleccionado": 1
        }
      ]
    }
    ```

---

## 🎨 Frontend (EncuestasFrontend)

La interfaz de usuario es una página única (SPA) que consume la API para mostrar y enviar datos dinámicamente.

### Cómo Ejecutar
1.  Descarga la carpeta del proyecto frontend.
2.  Abre el archivo `index.html` en cualquier navegador web moderno.

### Configuración
El archivo `js/app.js` contiene una constante `API_BASE_URL` que debe apuntar a la URL de la API desplegada.

---

## ☁️ Despliegue en Azure

La API está desplegada como un **App Service** en Microsoft Azure. Para una correcta funcionalidad, se requiere la siguiente configuración post-despliegue en el portal de Azure:

1.  **Cadena de Conexión:**
    * En `Configuración > Variables de entorno > Cadenas de conexión`.
    * **Nombre:** `DefaultConnection`
    * **Valor:** La cadena de conexión al servidor de SQL Server.
    * **Tipo:** `SQLAzure`

2.  **CORS (Cross-Origin Resource Sharing):**
    * En `API > CORS`.
    * **Orígenes permitidos:** Se debe añadir `*` para permitir peticiones desde cualquier origen (ideal para desarrollo) o la URL específica del dominio donde se alojará el frontend.

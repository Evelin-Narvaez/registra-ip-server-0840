# REGISTRA-IP — Backend

## Práctica 03: Wizard de registro de obra

**Asignatura:** Diseño de Interfaces de Usuario  
**Proyecto:** REGISTRA-IP  
**Tecnologías:** Node.js, Express y Multer

## Descripción

Este repositorio contiene el backend de REGISTRA-IP, desarrollado con Node.js y Express. Su función es recibir los datos y archivos de las obras registradas desde el frontend, almacenar los archivos físicamente y guardar sus metadatos en formato JSON.

## Tecnologías utilizadas

- Node.js: entorno de ejecución.
- Express: creación del servidor y las rutas de la API.
- CORS: permite la comunicación entre frontend y backend.
- Multer: recepción y almacenamiento de archivos.
- JSON: almacenamiento de los datos de las obras.

## Estructura del proyecto

```text
registra-ip-server/
├── datos/
│   └── obras/
├── subidas/
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
└── servidor.js
```

## Funcionamiento

El backend permite registrar obras mediante una solicitud HTTP POST. Recibe los datos de la obra y el archivo adjunto, guarda el archivo en la carpeta correspondiente y genera un archivo JSON con sus metadatos.

También permite consultar los registros almacenados mediante una solicitud GET.

## Rutas de la API

| Método | Ruta | Función |
|---|---|---|
| GET | `/` | Comprueba que el servidor está activo. |
| GET | `/obras` | Consulta las obras registradas. |
| POST | `/obras` | Registra una obra y recibe su archivo. |

## Almacenamiento

- `subidas/`: contiene los archivos adjuntos de las obras.
- `datos/obras/`: contiene los registros de las obras en formato JSON.

## Ejecución del servidor

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
node servidor.js
```

El backend se ejecuta en:

`http://localhost:4000`

## Repositorios relacionados

**Frontend:** https://github.com/Evelin-Narvaez/registra-ip-0840

**Backend:** https://github.com/Evelin-Narvaez/registrar-ip-servidor-0840

---

**REGISTRA-IP — Práctica 03**

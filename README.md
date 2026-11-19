# WEBACIELO
### Sistema de Gestión para la Fundación Acielo Rosa

**Proyecto académico de desarrollo web, arquitectura de microservicios, infraestructura distribuida y procesamiento de datos.**

---

## 1. Descripción del proyecto

WEBACIELO es una plataforma web desarrollada para apoyar la gestión administrativa y operativa de la Fundación Acielo Rosa.

El sistema integra funcionalidades para administrar usuarios, servicios, citas y pagos, así como herramientas de análisis de datos mediante Apache Spark.

Su arquitectura se basa en microservicios desarrollados con Node.js, bases de datos MySQL, contenedores Docker y orquestación mediante Docker Swarm.

Para su implementación se configuraron dos máquinas virtuales Ubuntu, separando el frontend del backend. También se incorporó HAProxy para centralizar las solicitudes HTTP y distribuir el tráfico hacia los microservicios.

## 2. ¿Qué incluye el proyecto?

| Componente | Descripción |
|---|---|
| Frontend | Interfaz web desarrollada con HTML, CSS y JavaScript |
| Usuarios | Registro, consulta, edición e inicio de sesión |
| Servicios | Registro, consulta y edición de servicios |
| Citas | Registro y consulta de citas |
| Pagos | Registro, consulta y edición de pagos |
| Bases de datos | Almacenamiento independiente mediante MySQL |
| Apache Spark | Procesamiento y análisis de datos |
| Docker | Contenerización de aplicaciones |
| Docker Swarm | Administración y escalado de microservicios |
| HAProxy | Proxy inverso y balanceo de carga |
| Dataset | Archivos de datos utilizados por el proyecto |

---

## 3. Tecnologías utilizadas

| Categoría | Tecnologías |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js |
| Bases de datos | MySQL 8.0 |
| Contenedores | Docker |
| Orquestación | Docker Swarm |
| Balanceo de carga | HAProxy 2.9 |
| Procesamiento de datos | Apache Spark 3.5.5 |
| Pruebas de rendimiento | Apache JMeter 5.6.3 |
| Sistemas operativos | Ubuntu |
| Virtualización | Oracle VirtualBox |
| Control de versiones | Git y GitHub |

---

## 4. Arquitectura del sistema

WEBACIELO utiliza una arquitectura distribuida que permite separar las responsabilidades de cada componente.

```text
                       USUARIO
                          |
                          v
                    FRONTEND WEB
                      Ubuntu 1
                     Puerto 8081
                          |
                          v
                       HAPROXY
                       Ubuntu 2
                      Puerto 5080
                          |
            +-------------+-------------+
            |             |             |
            v             v             v
         USUARIOS      SERVICIOS       CITAS
           3001          3002          3003
            |             |             |
            v             v             v
          MySQL         MySQL         MySQL

                 +---------------+
                 |               |
                 v               v
               PAGOS          ANALISIS
                3004            3005
                 |               |
                 v               v
               MySQL        APACHE SPARK
```

El frontend realiza solicitudes HTTP al backend a través de HAProxy.

Los microservicios se encuentran contenerizados y se comunican mediante la red overlay `acielo-red`.

Cada microservicio dispone de su propia base de datos MySQL, permitiendo separar el almacenamiento y la lógica de negocio.

---

## 5. Estructura del repositorio

```text
acielo-rosa/
│
├── dataset/
│   └── Archivos de datos del proyecto
│
├── WEBACIELO/
│   └── Backend, microservicios
│       y configuraciones
│
├── WEBACIELO-FRONTend/
│   ├── analisis/
│   ├── usuarios/
│   ├── servicios/
│   ├── citas/
│   ├── pagos/
│   ├── api.js
│   ├── index.html
│   ├── estilos.css
│   └── inicio-premium.css
│
└── README.md
```

---

## 6. Infraestructura de despliegue

La infraestructura del proyecto está compuesta por dos máquinas virtuales Ubuntu configuradas en Oracle VirtualBox.

| Servidor | Dirección IP | Función |
|---|---|---|
| servidorUbuntu1 | 192.168.100.2 | Frontend |
| servidorUbuntu2 | 192.168.100.3 | Backend, Docker Swarm, HAProxy, MySQL y Spark |

### Ubuntu1 — Frontend

El servidor Ubuntu1 aloja la interfaz web de WEBACIELO.

- Directorio: `/home/vagrant/WEBACIELO-FRONTend`
- Puerto: `8081`
- Servicio: `webacielo-frontend`
- Servidor HTTP: Python 3

Dirección de acceso:

`http://192.168.100.2:8081`

### Ubuntu2 — Backend

El servidor Ubuntu2 aloja los microservicios y los componentes de infraestructura.

- Docker Engine.
- Docker Swarm.
- Microservicios Node.js.
- Bases de datos MySQL.
- HAProxy.
- Apache Spark.
- API de análisis.

---

## 7. Requisitos

Para reproducir el entorno se requiere:

- Ubuntu o un sistema Linux compatible.
- Docker Engine.
- Docker Swarm.
- Node.js.
- MySQL.
- HAProxy.
- Apache Spark.
- Python 3.
- Conectividad entre los servidores.

---

## 8. Instalación y ejecución

### Paso 1. Clonar el repositorio

```bash
git clone https://github.com/Sxmugiron/acielo-rosa.git
cd acielo-rosa
```

### Paso 2. Ejecutar el frontend

```bash
cd WEBACIELO-FRONTend
python3 -m http.server 8081 --bind 0.0.0.0
```

Acceder mediante:

`http://localhost:8081`

### Paso 3. Configurar la conexión con el backend

El archivo `api.js` contiene las direcciones utilizadas para comunicarse con las APIs.

En la infraestructura del proyecto se utilizó:

`http://192.168.100.3:5080`

### Paso 4. Preparar el backend

Para ejecutar los microservicios se deben configurar las bases de datos, las variables de entorno, las imágenes Docker y los servicios de Docker Swarm.

La configuración del backend se encuentra organizada dentro del directorio `WEBACIELO/`.

---

## 9. Microservicios y API

El backend está dividido en cuatro microservicios principales.

| Microservicio | Servicio Docker | Puerto |
|---|---|---|
| Usuarios | `acielo_usuarios` | 3001 |
| Servicios | `acielo_servicios` | 3002 |
| Citas | `acielo_citas` | 3003 |
| Pagos | `acielo_pagos` | 3004 |

### Endpoints

| Ruta | Función |
|---|---|
| `/api/usuarios` | Gestión de usuarios |
| `/api/servicios` | Gestión de servicios |
| `/api/citas` | Gestión de citas |
| `/api/pagosv` | Gestión de pagos |
| `/api/analisis` | Análisis de datos |

Ejemplo de consulta:

```bash
curl http://192.168.100.3:5080/api/usuarios
```

---

## 10. Docker Swarm y HAProxy

### Docker Swarm

Docker Swarm se implementó para administrar y escalar los microservicios contenerizados.

Entre sus funciones se encuentran:

- Administración de servicios.
- Creación y ejecución de réplicas.
- Escalado de microservicios.
- Gestión de tareas y contenedores.
- Comunicación mediante redes overlay.

Consultar los servicios:

```bash
sudo docker service ls
```

Consultar las tareas:

```bash
sudo docker service ps acielo_usuarios
```

Escalar el microservicio de usuarios:

```bash
sudo docker service scale acielo_usuarios=2
```

### HAProxy

HAProxy se configuró como proxy inverso y balanceador de carga para el backend.

| Parámetro | Configuración |
|---|---|
| Servicio | `acielo_haproxy` |
| Imagen | `haproxy:2.9` |
| Puerto publicado | 5080 |
| Puerto interno | 80 |
| Red | `acielo-red` |

Su implementación permite centralizar las solicitudes HTTP y dirigirlas hacia los microservicios correspondientes.

---

## 11. Apache Spark y análisis de datos

Apache Spark 3.5.5 se incorporó para realizar tareas de procesamiento y análisis de información.

La infraestructura incluye:

- Spark Master.
- Spark Worker.
- API Node.js de análisis.
- Integración con la interfaz web.

La API de análisis utiliza el puerto `3005`.

El módulo de análisis permite consultar información y acceder a páginas que explican la arquitectura, la metodología y el proceso de análisis de datos.

---

## 12. Pruebas y validación

Durante el desarrollo se realizaron pruebas funcionales, de concurrencia, escalabilidad y rendimiento.

### Pruebas funcionales

Se verificó la respuesta HTTP de los servicios.

Entre las pruebas realizadas se registraron:

- 30 solicitudes secuenciales con respuesta HTTP 200.
- 20 solicitudes concurrentes con respuesta HTTP 200.

### Pruebas de escalabilidad

Se realizaron pruebas utilizando una y dos réplicas del microservicio de usuarios mediante Docker Swarm.

### Pruebas de carga con Apache JMeter

Se utilizó Apache JMeter 5.6.3 para evaluar el endpoint:

`GET /api/usuarios`

| Usuarios virtuales | Réplicas evaluadas |
|---|---|
| 10 | 1 y 2 |
| 50 | 1 y 2 |
| 100 | 1 y 2 |
| 200 | 1 y 2 |

**Resultados:**

- Ocho ejecuciones de prueba.
- 0,00 % de errores.
- Tiempos promedio entre 12 y 25 milisegundos.
- Comparación del comportamiento del servicio con una y dos réplicas.

Estas pruebas permitieron analizar el comportamiento del endpoint de usuarios bajo diferentes niveles de carga.

---

## 13. Verificación del funcionamiento

### Verificar el frontend

```bash
sudo systemctl status webacielo-frontend
```

Comprobar la respuesta HTTP:

```bash
curl -I http://localhost:8081
```

### Verificar los microservicios

```bash
sudo docker service ls
```

### Verificar HAProxy

```bash
sudo docker service ps acielo_haproxy
```

### Verificar la red Docker

```bash
sudo docker network inspect acielo-red
```

### Consultar la API

```bash
curl -i http://localhost:5080/api/usuarios
```

---

## 14. Seguridad y configuración

Para mantener una configuración segura se recomienda:

- Utilizar variables de entorno para las credenciales.
- Evitar publicar contraseñas y tokens.
- Restringir el acceso a las bases de datos.
- Proteger los endpoints que requieren autenticación.
- Implementar HTTPS en entornos públicos.
- Mantener actualizadas las dependencias.
- Realizar copias de seguridad.

---

## 15. Resultados y aprendizajes

El desarrollo de WEBACIELO permitió integrar conocimientos relacionados con:

- Desarrollo frontend.
- Arquitectura de microservicios.
- Construcción de APIs.
- Administración de bases de datos.
- Contenerización con Docker.
- Orquestación con Docker Swarm.
- Balanceo de carga mediante HAProxy.
- Procesamiento de datos con Apache Spark.
- Pruebas de rendimiento con Apache JMeter.
- Administración de servidores Ubuntu.
- Control de versiones con Git y GitHub.

---

## 16. Impacto del proyecto

WEBACIELO representa una propuesta tecnológica orientada a apoyar la digitalización de los procesos de la Fundación Acielo Rosa.

La plataforma integra funcionalidades administrativas y herramientas de análisis en una arquitectura modular, facilitando la organización de la información y la separación de responsabilidades.

Desde el ámbito académico, el proyecto demuestra la integración práctica de tecnologías de desarrollo web, microservicios, infraestructura, bases de datos y procesamiento de información.

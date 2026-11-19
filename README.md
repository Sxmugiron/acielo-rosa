# WEBACIELO
## Sistema de Gestión para la Fundación Acielo Rosa

**Plataforma web basada en microservicios, contenedores, balanceo de carga y procesamiento de datos con Apache Spark.**

**Proyecto académico de desarrollo e infraestructura de software — 2026**

---

## 1. Descripción general

WEBACIELO es una plataforma web desarrollada para apoyar la gestión de los procesos administrativos y operativos de la Fundación Acielo Rosa.

El sistema integra funcionalidades relacionadas con la administración de usuarios, servicios, citas y pagos, además de incorporar herramientas de análisis de información mediante Apache Spark.

Su arquitectura está basada en microservicios independientes desarrollados con Node.js, bases de datos MySQL, contenedores Docker y orquestación mediante Docker Swarm.

El proyecto también incorpora HAProxy como punto de entrada para las solicitudes HTTP y utiliza una infraestructura virtualizada con dos servidores Ubuntu.

Esta solución busca demostrar cómo diferentes tecnologías pueden integrarse para construir una aplicación modular, organizada y con posibilidades de escalabilidad.

## 2. Fundación Acielo Rosa

La Fundación Acielo Rosa es la organización para la cual se desarrolla esta propuesta tecnológica.

WEBACIELO está orientado a facilitar la organización de información relacionada con sus usuarios, los servicios administrados, la programación de citas y el registro de pagos.

La plataforma busca contribuir a la digitalización de procesos y ofrecer herramientas que faciliten la consulta, administración y análisis de datos.

Desde el punto de vista tecnológico, el proyecto plantea una solución centralizada para los usuarios finales, pero distribuida internamente en diferentes servicios independientes.

## 3. Objetivos del proyecto

### Objetivo general

Diseñar, desarrollar e implementar una plataforma web para la Fundación Acielo Rosa utilizando una arquitectura de microservicios, bases de datos relacionales, tecnologías de contenerización, balanceo de carga y procesamiento distribuido de datos.

### Objetivos específicos

- Desarrollar una interfaz web para la interacción con los diferentes módulos del sistema.
- Implementar microservicios independientes para usuarios, servicios, citas y pagos.
- Integrar bases de datos MySQL para el almacenamiento de información.
- Contenerizar los microservicios utilizando Docker.
- Administrar y escalar servicios mediante Docker Swarm.
- Implementar HAProxy para centralizar y distribuir las solicitudes HTTP.
- Incorporar Apache Spark para el procesamiento y análisis de información.
- Realizar pruebas funcionales, de concurrencia y de carga.
- Documentar la arquitectura y los procedimientos de despliegue.

---

## 4. Módulos del sistema

### 4.1. Gestión de usuarios

Permite administrar la información de los usuarios registrados en la plataforma.

Funcionalidades:

- Registro de usuarios.
- Consulta de usuarios.
- Edición de información.
- Inicio de sesión.

### 4.2. Gestión de servicios

Permite organizar los servicios administrados mediante la plataforma.

Funcionalidades:

- Registro de servicios.
- Consulta de servicios.
- Edición de información.
- Visualización de registros.

### 4.3. Gestión de citas

Permite administrar los registros relacionados con las citas.

Funcionalidades:

- Registro de citas.
- Consulta de citas.
- Visualización de información.

### 4.4. Gestión de pagos

Permite administrar la información relacionada con los pagos registrados.

Funcionalidades:

- Registro de pagos.
- Consulta de pagos.
- Edición de pagos.
- Visualización de registros.

### 4.5. Análisis de datos

Integra funcionalidades relacionadas con el procesamiento y la visualización de información.

Incluye:

- Interfaz de análisis.
- Visualización de resultados.
- Integración con Apache Spark.
- Consultas a endpoints de análisis.
- Páginas de documentación de arquitectura, metodología y procesamiento.

---

## 5. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura del frontend |
| CSS3 | Diseño y estilos |
| JavaScript | Interactividad y consumo de APIs |
| Node.js | Desarrollo de microservicios |
| MySQL 8.0 | Bases de datos |
| Docker | Contenerización |
| Docker Swarm | Orquestación y escalado |
| HAProxy 2.9 | Proxy inverso y balanceo de carga |
| Apache Spark 3.5.5 | Procesamiento de datos |
| Apache JMeter 5.6.3 | Pruebas de carga |
| Ubuntu | Sistema operativo |
| VirtualBox | Virtualización |
| Git y GitHub | Control de versiones |

---

## 6. Arquitectura del sistema

WEBACIELO utiliza una arquitectura distribuida que separa la interfaz web, los microservicios, las bases de datos y el procesamiento analítico.

```text
                     USUARIO
                        |
                        v
                FRONTEND WEB
                  UBUNTU 1
                  Puerto 8081
                        |
                        v
                    HAPROXY
                  UBUNTU 2
                  Puerto 5080
                        |
       +----------------+----------------+
       |                |                |
       v                v                v
    USUARIOS         SERVICIOS          CITAS
     :3001             :3002            :3003
       |                |                |
       v                v                v
     MySQL            MySQL            MySQL

                 +-------------+
                 |             |
                 v             v
               PAGOS        ANALISIS
               :3004          :3005
                 |             |
                 v             v
               MySQL      APACHE SPARK
```

Los microservicios se ejecutan en contenedores Docker y utilizan la red overlay `acielo-red` para su comunicación.

HAProxy actúa como punto de entrada HTTP, mientras que Apache Spark se integra mediante una API de análisis.

---

## 7. Infraestructura de servidores

El proyecto se desarrolló utilizando dos máquinas virtuales Ubuntu.

| Servidor | Dirección IP | Responsabilidad |
|---|---|---|
| servidorUbuntu1 | 192.168.100.2 | Frontend |
| servidorUbuntu2 | 192.168.100.3 | Backend, bases de datos, Docker Swarm, HAProxy y Spark |

### 7.1. Servidor Ubuntu1

Contiene el frontend de WEBACIELO.

Configuración:

- Servicio: `webacielo-frontend`
- Puerto: `8081`
- Directorio: `/home/vagrant/WEBACIELO-FRONTend`
- Servidor HTTP: Python

Dirección de acceso:

`http://192.168.100.2:8081`

### 7.2. Servidor Ubuntu2

Contiene los componentes del backend y la infraestructura de procesamiento.

Incluye:

- Docker Engine.
- Docker Swarm.
- Microservicios Node.js.
- Bases de datos MySQL.
- HAProxy.
- Apache Spark.
- API de análisis.

El entorno Docker Swarm documentado utiliza un nodo administrador. Por tanto, las pruebas de escalado realizadas no representan una distribución entre varios nodos físicos.

---

## 8. Microservicios

El backend se encuentra dividido en cuatro microservicios principales.

| Microservicio | Nombre en Docker Swarm | Puerto |
|---|---|---|
| Usuarios | acielo_usuarios | 3001 |
| Servicios | acielo_servicios | 3002 |
| Citas | acielo_citas | 3003 |
| Pagos | acielo_pagos | 3004 |

Cada microservicio dispone de su correspondiente servicio de base de datos MySQL.

### Comandos de administración

Consultar los servicios:

```bash
sudo docker service ls
```

Consultar las tareas:

```bash
sudo docker service ps acielo_usuarios
```

Consultar los registros:

```bash
sudo docker service logs acielo_usuarios
```

Escalar el servicio de usuarios:

```bash
sudo docker service scale acielo_usuarios=2
```

---

## 9. Balanceo de carga con HAProxy

HAProxy se utiliza como punto de entrada para las solicitudes HTTP del backend.

Configuración:

- Imagen: `haproxy:2.9`
- Servicio: `acielo_haproxy`
- Puerto publicado: `5080`
- Puerto interno: `80`
- Red: `acielo-red`

### Rutas de la API

| Ruta | Destino |
|---|---|
| /api/usuarios | Usuarios |
| /api/servicios | Servicios |
| /api/citas | Citas |
| /api/pagosv | Pagos |
| /api/analisis | Análisis |

Ejemplo:

```bash
curl http://192.168.100.3:5080/api/usuarios
```

HAProxy permite centralizar las solicitudes y facilita la implementación de estrategias de balanceo.

**Estado técnico:** durante las verificaciones del 19 de noviembre de 2026 se identificaron problemas de resolución DNS y conectividad mediante las IP virtuales de Docker Swarm. La recuperación del servicio HAProxy y su escalado a dos réplicas quedaron pendientes.

---

## 10. Integración con Apache Spark

El proyecto incorpora Apache Spark 3.5.5 como herramienta de procesamiento de información.

La infraestructura incluye:

- Spark Master.
- Spark Worker.
- API Node.js de análisis.
- Integración con el frontend.

La API utiliza el puerto `3005` y permite consultar funcionalidades relacionadas con el análisis de datos.

La integración de Spark busca separar las operaciones analíticas de los microservicios encargados de los procesos administrativos.

---

## 11. Pruebas realizadas

Durante el desarrollo se ejecutaron diferentes pruebas para evaluar el comportamiento del sistema.

### 11.1. Pruebas funcionales

Se realizaron solicitudes HTTP para verificar la respuesta de los servicios.

En verificaciones previas se registraron:

- 30 solicitudes secuenciales con respuesta HTTP 200.
- 20 solicitudes concurrentes con respuesta HTTP 200.

### 11.2. Pruebas de escalabilidad

Se realizaron ejercicios de escalado de microservicios mediante Docker Swarm, aumentando y reduciendo la cantidad de réplicas.

### 11.3. Pruebas de carga con Apache JMeter

Se evaluó el endpoint:

`GET /api/usuarios`

Escenarios utilizados:

| Usuarios virtuales | Réplicas |
|---|---|
| 10 | 1 y 2 |
| 50 | 1 y 2 |
| 100 | 1 y 2 |
| 200 | 1 y 2 |

Resultados documentados:

- Ocho ejecuciones.
- 0,00 % de errores.
- Tiempos promedio entre 12 y 25 ms.
- Sin mejoras consistentes de latencia o throughput al pasar de una a dos réplicas.

Estos resultados corresponden al endpoint de usuarios y no representan una evaluación completa de todos los módulos.

---

## 12. Estructura del repositorio

```text
acielo-rosa/
│
├── dataset/
│   └── Datos del proyecto
│
├── WEBACIELO/
│   └── Backend, microservicios
│       y configuraciones
│
├── WEBACIELO-FRONTend/
│   │
│   ├── analisis/
│   ├── usuarios/
│   ├── citas/
│   ├── servicios/
│   ├── pagos/
│   │
│   ├── api.js
│   ├── index.html
│   ├── estilos.css
│   └── inicio-premium.css
│
└── README.md
```

---

## 13. Instalación y ejecución

### 13.1. Requisitos

Para reproducir el entorno se requiere:

- Ubuntu o un sistema compatible.
- Docker Engine.
- Docker Swarm.
- MySQL.
- Node.js.
- HAProxy.
- Apache Spark.
- Conectividad entre los servidores.

### 13.2. Clonar el repositorio

```bash
git clone https://github.com/Sxmugiron/acielo-rosa.git
cd acielo-rosa
```

### 13.3. Ejecutar el frontend

```bash
cd WEBACIELO-FRONTend
python3 -m http.server 8081 --bind 0.0.0.0
```

Acceder mediante:

`http://localhost:8081`

Para utilizar las funcionalidades conectadas al backend, se deben configurar las direcciones correspondientes en `api.js`.

### 13.4. Despliegue del backend

El despliegue completo requiere configurar las variables de entorno, las bases de datos, las imágenes Docker, la red de servicios y los componentes de análisis.

Las direcciones IP documentadas corresponden al entorno virtual de desarrollo y deben adaptarse al utilizar otra infraestructura.

---

## 14. Seguridad

Para fortalecer la seguridad de la plataforma se recomienda:

- Utilizar variables de entorno para las credenciales.
- Evitar publicar archivos `.env` con información sensible.
- Restringir el acceso a las bases de datos.
- Implementar HTTPS en despliegues públicos.
- Revisar los mecanismos de autenticación y autorización.
- Mantener actualizadas las dependencias.
- Realizar copias de seguridad.
- Supervisar los servicios y contenedores.

El entorno descrito corresponde a un proyecto académico y no debe considerarse automáticamente preparado para producción.

---

## 15. Resultados y aprendizajes

El desarrollo de WEBACIELO permitió integrar diferentes áreas de la ingeniería de software:

- Desarrollo de interfaces web.
- Construcción de APIs.
- Arquitectura de microservicios.
- Administración de bases de datos.
- Contenerización de aplicaciones.
- Orquestación de servicios.
- Balanceo de carga.
- Procesamiento de datos.
- Pruebas de rendimiento.
- Control de versiones.

También permitió identificar desafíos relacionados con la comunicación entre servicios, la resolución DNS, las redes virtuales y la disponibilidad de componentes distribuidos.

---

## 16. Mejoras futuras

Entre las mejoras propuestas se encuentran:

- Estabilizar la comunicación interna de Docker Swarm.
- Recuperar el servicio HAProxy.
- Evaluar el escalado de HAProxy a dos réplicas.
- Incorporar herramientas de monitoreo.
- Automatizar pruebas.
- Fortalecer la seguridad.
- Optimizar las consultas a bases de datos.
- Ampliar las funcionalidades analíticas.
- Evaluar un despliegue multinodo.
- Mejorar la documentación de instalación y mantenimiento.

---

## 17. Impacto del proyecto

WEBACIELO constituye una propuesta tecnológica orientada a apoyar la gestión de información de la Fundación Acielo Rosa.

Su desarrollo demuestra cómo una arquitectura modular puede integrar diferentes procesos administrativos en una plataforma web.

La incorporación de microservicios, bases de datos, contenedores y procesamiento analítico permite explorar alternativas para mejorar la organización, el mantenimiento y la evolución del sistema.

Desde el ámbito académico, el proyecto representa una aplicación práctica de conocimientos de desarrollo de software, infraestructura, redes, bases de datos y análisis de información.

---

## 18. Repositorio

**Proyecto:** WEBACIELO — Fundación Acielo Rosa

**Repositorio:** https://github.com/Sxmugiron/acielo-rosa

**Rama principal:** `main`

**Última integración documentada:** `bec6212` — Agregar frontend completo de WEBACIELO.

**Año:** 2026

---

**WEBACIELO — Sistema de Gestión para la Fundación Acielo Rosa**

*Proyecto académico de desarrollo web, microservicios e infraestructura tecnológica.*

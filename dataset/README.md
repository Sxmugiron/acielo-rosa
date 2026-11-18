# Dataset - Fundación Acielo Rosa

Conjunto de datos de fuente abierta seleccionado para el análisis de programación y asistencia a citas médicas, como parte del proyecto de infraestructura de Fundación Acielo Rosa.

## Dataset Analítico de Fuente Abierta (Big Data - Apache Spark)

Se seleccionó el conjunto de datos público *Medical Appointment No Shows*, obtenido de Kaggle, para implementar procesos de análisis y procesamiento distribuido mediante Apache Spark (PySpark). Su propósito es generar indicadores estadísticos relacionados con la demanda, programación y asistencia a citas, cuyos resultados serán integrados al dashboard de WEBACIELO.

### Fuente del Dataset

- Plataforma: Kaggle.
- Nombre: Medical Appointment No Shows.
- Autor: Joni Hoppen.
- Enlace: https://www.kaggle.com/datasets/joniarroba/noshowappointments
- Formato: CSV.
- País de origen: Brasil.
- Año de los registros: 2016.

### Archivo del Dataset

- `KaggleV2-May-2016.csv`: conjunto de datos histórico compuesto por **110.527 registros y 14 atributos originales**.

### Variables Elegidas del Dataset

De las 14 columnas disponibles en el archivo original, se seleccionaron **7 variables principales** para el análisis de la gestión de citas:

1. `Gender`: género del paciente, utilizado para analizar la distribución de las citas.
2. `Age`: edad del paciente, utilizada para identificar los rangos de edad con mayor demanda.
3. `ScheduledDay`: fecha en la que se programó la cita.
4. `AppointmentDay`: fecha establecida para la atención.
5. `Neighbourhood`: ubicación o sector asociado a la cita.
6. `SMS_received`: indicador de recepción de recordatorios mediante mensajes de texto.
7. `No-show`: indicador que permite identificar si el paciente asistió o no a la cita.

Adicionalmente, se generará la variable derivada `WaitingDays`, calculada a partir de la diferencia entre `ScheduledDay` y `AppointmentDay`, para analizar los tiempos de espera.

### ¿Por qué lo elegimos?

- **Relación con el proyecto:** el dataset contiene información directamente relacionada con la programación y asistencia a citas, lo que permite desarrollar análisis complementarios al microservicio de Citas de WEBACIELO.
- **Volumen de información:** sus 110.527 registros permiten desarrollar procesos de limpieza, transformación y agregación utilizando Apache Spark.
- **Análisis de asistencia:** permite calcular porcentajes de asistencia e inasistencia e identificar patrones relacionados con los recordatorios SMS.
- **Inteligencia de datos:** permite generar indicadores sobre demanda, distribución de citas, tiempos de espera y características de los pacientes.

### Coincidencia con el Proyecto Fundación Acielo Rosa (WEBACIELO)

Las variables seleccionadas permiten complementar el funcionamiento del microservicio de Citas y generar información estadística de interés para la aplicación:

- `ScheduledDay` ↔ Fecha de programación de las citas.
- `AppointmentDay` ↔ Fecha prevista para la atención.
- `WaitingDays` ↔ Tiempo de espera entre programación y atención.
- `No-show` ↔ Indicador estadístico de asistencia e inasistencia.
- `SMS_received` ↔ Análisis de recordatorios y su relación con la asistencia.
- `Age` y `Gender` ↔ Caracterización estadística de los pacientes.
- `Neighbourhood` ↔ Distribución geográfica de las citas.

### Flujo de Procesamiento e Integración

1. El clúster de **Apache Spark (PySpark)** ingiere el archivo `KaggleV2-May-2016.csv`.
2. Se seleccionan las 7 variables principales y se realizan procesos de limpieza y transformación.
3. Se calcula la variable derivada `WaitingDays`.
4. Se generan agregaciones estadísticas sobre demanda, asistencia, inasistencia y tiempos de espera.
5. Los resultados consolidados se exportan en archivos estructurados.
6. La API REST de WEBACIELO consulta los resultados para presentarlos mediante gráficas e indicadores en el dashboard.

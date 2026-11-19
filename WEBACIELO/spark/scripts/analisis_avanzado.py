from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, sum as spark_sum, when,
    to_date, date_format
)
import json
import os

spark = (
    SparkSession.builder
    .appName("WEBACIELO-Analisis-Avanzado")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("ERROR")

ruta = "/home/vagrant/WEBACIELO/spark/dataset/KaggleV2-May-2016.csv"

df = spark.read.csv(ruta, header=True, inferSchema=True)

# Excluir edades negativas
df = df.filter(col("Age") >= 0)

# Crear variable de inasistencia
df = df.withColumn(
    "inasistencia",
    when(col("No-show") == "Yes", 1).otherwise(0)
)

# Análisis por grupos de edad
df = df.withColumn(
    "grupo_edad",
    when(col("Age") <= 17, "0-17")
    .when(col("Age") <= 35, "18-35")
    .when(col("Age") <= 59, "36-59")
    .otherwise("60+")
)

def resumir(grupo):
    filas = (
        df.groupBy(grupo)
        .agg(
            count("*").alias("total"),
            spark_sum("inasistencia").alias("faltaron")
        )
        .collect()
    )

    return [
        {
            "categoria": str(fila[grupo]),
            "total": fila["total"],
            "faltaron": fila["faltaron"],
            "porcentaje_inasistencia": round(
                fila["faltaron"] / fila["total"] * 100, 2
            )
        }
        for fila in filas
    ]

# Día de la semana de la cita
df = df.withColumn(
    "dia_semana",
    date_format(to_date(col("AppointmentDay")), "EEEE")
)

resultados = {
    "por_edad": resumir("grupo_edad"),
    "por_sms": resumir("SMS_received"),
    "por_dia_semana": resumir("dia_semana")
}

salida = "/home/vagrant/WEBACIELO/spark/resultados/analisis_avanzado.json"

os.makedirs(os.path.dirname(salida), exist_ok=True)

with open(salida, "w", encoding="utf-8") as archivo:
    json.dump(resultados, archivo, indent=4, ensure_ascii=False)

print("\nANALISIS AVANZADO WEBACIELO")
print(json.dumps(resultados, indent=4, ensure_ascii=False))
print("\nArchivo generado:", salida)

spark.stop()

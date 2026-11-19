from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import json
import os

spark = (
    SparkSession.builder
    .appName("WEBACIELO-Analisis-Citas")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("ERROR")

ruta = "/home/vagrant/WEBACIELO/spark/dataset/KaggleV2-May-2016.csv"

df = spark.read.csv(
    ruta,
    header=True,
    inferSchema=True
)

# Total de citas
total = df.count()

# Asistencia e inasistencia
asistencia = {
    fila["No-show"]: fila["count"]
    for fila in df.groupBy("No-show").count().collect()
}

# Distribución por género
generos = {
    fila["Gender"]: fila["count"]
    for fila in df.groupBy("Gender").count().collect()
}

# Preparar los resultados
resultados = {
    "total_citas": total,
    "asistieron": asistencia.get("No", 0),
    "no_asistieron": asistencia.get("Yes", 0),
    "porcentaje_asistencia": round(
        asistencia.get("No", 0) / total * 100, 2
    ),
    "porcentaje_inasistencia": round(
        asistencia.get("Yes", 0) / total * 100, 2
    ),
    "generos": generos
}

# Guardar JSON
salida = "/home/vagrant/WEBACIELO/spark/resultados/resumen_citas.json"

os.makedirs(os.path.dirname(salida), exist_ok=True)

with open(salida, "w", encoding="utf-8") as archivo:
    json.dump(resultados, archivo, indent=4, ensure_ascii=False)

print("\n========== WEBACIELO ==========")
print("ANALISIS DE CITAS MEDICAS")
print("================================")
print(json.dumps(resultados, indent=4, ensure_ascii=False))
print("\nResultados guardados en:", salida)

spark.stop()

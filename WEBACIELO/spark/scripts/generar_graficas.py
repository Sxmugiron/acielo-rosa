import json
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

BASE = "/home/vagrant/WEBACIELO/spark/resultados"

with open(os.path.join(BASE, "resumen_citas.json"), encoding="utf-8") as f:
    resumen = json.load(f)

with open(os.path.join(BASE, "analisis_avanzado.json"), encoding="utf-8") as f:
    avanzado = json.load(f)

COLORES = ["#e75480", "#1a3a5c", "#58a6a6", "#f3a65a"]

# 1. Asistencia general
plt.figure(figsize=(8, 6))
plt.pie(
    [resumen["asistieron"], resumen["no_asistieron"]],
    labels=["Asistieron", "No asistieron"],
    autopct="%1.1f%%",
    colors=[COLORES[2], COLORES[0]],
    startangle=90
)
plt.title("WEBACIELO - Asistencia a citas")
plt.tight_layout()
plt.savefig(os.path.join(BASE, "01_asistencia.png"), dpi=150)
plt.close()

# 2. Grupos de edad
edades = sorted(
    avanzado["por_edad"],
    key=lambda x: ["0-17", "18-35", "36-59", "60+"].index(x["categoria"])
)
plt.figure(figsize=(9, 5))
plt.bar(
    [x["categoria"] for x in edades],
    [x["porcentaje_inasistencia"] for x in edades],
    color=COLORES[0]
)
plt.title("WEBACIELO - Inasistencia por edad")
plt.xlabel("Grupo de edad")
plt.ylabel("Inasistencia (%)")
plt.tight_layout()
plt.savefig(os.path.join(BASE, "02_edad.png"), dpi=150)
plt.close()

# 3. SMS
sms = sorted(avanzado["por_sms"], key=lambda x: x["categoria"])
plt.figure(figsize=(8, 5))
plt.bar(
    ["Sin SMS" if x["categoria"] == "0" else "Con SMS" for x in sms],
    [x["porcentaje_inasistencia"] for x in sms],
    color=[COLORES[1], COLORES[2]]
)
plt.title("WEBACIELO - Inasistencia según SMS")
plt.ylabel("Inasistencia (%)")
plt.tight_layout()
plt.savefig(os.path.join(BASE, "03_sms.png"), dpi=150)
plt.close()

# 4. Día de la semana
orden = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
nombres = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
dias = {x["categoria"]: x for x in avanzado["por_dia_semana"]}

etiquetas = [nombres[i] for i, dia in enumerate(orden) if dia in dias]
valores = [dias[dia]["porcentaje_inasistencia"] for dia in orden if dia in dias]

plt.figure(figsize=(10, 5))
plt.bar(etiquetas, valores, color=COLORES[1])
plt.title("WEBACIELO - Inasistencia por día")
plt.ylabel("Inasistencia (%)")
plt.xticks(rotation=20)
plt.tight_layout()
plt.savefig(os.path.join(BASE, "04_dias.png"), dpi=150)
plt.close()

print("¡Gráficas generadas correctamente!")
for archivo in sorted(os.listdir(BASE)):
    if archivo.endswith(".png"):
        print(archivo)

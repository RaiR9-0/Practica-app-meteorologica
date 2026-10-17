# Aplicación Web de Mapa Meteorológico Integral

Práctica de la asignatura **IAW** (Mtro. René Peña Martínez).
Autor: **Jorge Francisco**.

**Sitio en vivo:** https://rair9-0.github.io/Practica-app-meteorologica/

## ¿Qué hace?

1. El usuario escribe un lugar (ciudad, municipio, país…).
2. La app lo geocodifica con **Nominatim (OpenStreetMap)** y obtiene su descripción oficial, latitud y longitud.
3. Con esas coordenadas consulta el clima **actual y real** en **Open-Meteo**: temperatura, sensación térmica, humedad, viento, presión y condición.
4. Muestra un **mapa de OpenStreetMap** centrado en la ubicación.

## APIs utilizadas

| API | Uso | Requiere key |
|-----|-----|--------------|
| [Nominatim](https://nominatim.openstreetmap.org/ui/search.html) | Geocodificación (lugar → coordenadas) | No |
| [Open-Meteo](https://open-meteo.com/) | Clima actual por coordenadas | No |
| [OpenStreetMap](https://www.openstreetmap.org/) | Mapa embebido | No |

## Estructura

```
index.html   → estructura de la página (header, buscador, tarjeta y contacto)
style.css    → tema visual "radar nocturno", responsive
app.js       → consumo asíncrono de las APIs y renderizado en el DOM
```

## Ejecutar en local

Basta con abrir `index.html` en el navegador o servir la carpeta:

```bash
python -m http.server 5500
```

## Historial de commits

https://github.com/RaiR9-0/Practica-app-meteorologica/commits/main

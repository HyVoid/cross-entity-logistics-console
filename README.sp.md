[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Convierte operaciones logísticas fragmentadas en una única vista de ganancias

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Type-Decision%20Support-orange.svg)

**Rastrea el despacho de aduanas, la ejecución de la flota y la rentabilidad de los contenedores en un espacio de trabajo ligero—gratis, sin instalación, en formato de navegador u hoja de cálculo.**

**Sin registro. Sin instalación. Gratis en tu navegador.**

Prueba la versión de navegador gratis. Si necesitas la versión de Excel, puedes comprarla con una garantía de devolución de 30 días sin preguntas.
>
> 🌐 Abrir en el navegador → [*aquí*](https://hyvoid.github.io/cross-entity-logistics-console/)  
> 📥 Descargar Excel → *próximamente*

---

## Qué te ayuda a seguir

- La ganancia total generada entre el despacho de aduanas y las operaciones de flota desde una única vista.
- Contenedores liberados por la aduana pero aún en espera de despacho.
- La rentabilidad de cada contenedor en lugar de resultados departamentales desconectados.
- Rankings de contribución de clientes basados en la ganancia real de extremo a extremo.
- Tendencias de rentabilidad de vehículos a través de múltiples asignaciones de transporte.
- Envíos con pérdidas antes de que desaparezcan dentro de los números agregados.

---

## Por qué lo construí

Muchas empresas de logística operan según dos realidades separadas.

El equipo de aduanas rastrea declaraciones, liberaciones e ingresos de agencia.

El equipo de transporte rastrea despachos, conductores y gastos de entrega.

La dirección recibe informes separados de cada lado y asume que el negocio en general está sano.

El problema es que la rentabilidad no existe dentro de los departamentos. Existe a nivel de contenedor.

Un contenedor que genera excelentes márgenes de aduana puede luego absorber gastos inesperados de combustible, dietas de conductores y retrasos de entrega que eliminan la ganancia por completo. A la inversa, un trabajo de aduana aparentemente mediocre puede volverse muy rentable tras una ejecución de transporte eficiente.

Construí esto porque el fracaso analítico era recurrente:

- Los equipos optimizaban sus propias métricas.
- Los líderes tomaban decisiones con números incompletos.
- Las pérdidas permanecían invisibles hasta la conciliación de fin de mes.

Antes:

> "El negocio de despacho ganó dinero."
>
> "El negocio de flota se comportó razonablemente bien."

Después:

> "El contenedor MSKU1234567 generó 30.000 KES durante el despacho de aduana pero perdió 25.000 KES durante el transporte, resultando en solo 5.000 KES de contribución neta."

Esa perspectiva cambia las decisiones.

En lugar de construir otro reemplazo de ERP, este libro productiviza un marco de razonamiento:

**Sigue el contenedor. Consolida la economía. Revela las excepciones con la antelación suficiente para actuar.**

---

## Problemas logísticos comunes que resuelve

| Problema | Sin esta herramienta | Con esta herramienta |
|---|---|---|
| Aduana y transporte operan por separado | Los departamentos informan de forma independiente | Una vista de ganancia a nivel de contenedor |
| Los contenedores liberados permanecen inactivos | Los retrasos de despacho permanecen ocultos | Las excepciones "liberado-pero-no-despachado" surgen de inmediato |
| La rentabilidad de la flota no está clara | Los costos de vehículos se mezclan | La contribución del vehículo se vuelve medible |
| La rentabilidad del cliente está distorsionada | Los rankings de ingresos ignoran los costos de ejecución | Los rankings de clientes reflejan la ganancia real |
| Los envíos con pérdidas pasan desapercibidos | Los problemas surgen en las revisiones de fin de mes | Las pérdidas disparan alertas operativas |
| La calidad de los datos se deteriora | Aparecen distintas convenciones de nomenclatura | La validación controlada impone consistencia |

---

## Para quién es

Esta herramienta está diseñada para:

- Agencias de despacho de aduana que operan sus propias flotas de transporte.
- Transitarios que gestionan la ejecución de contenedores de extremo a extremo.
- Pequeñas y medianas empresas de logística que necesitan visibilidad operativa sin la complejidad de un ERP.
- Propietarios y gerentes de operaciones que actualmente concilian la información manualmente.

Esto **no** está diseñado para implementaciones de ERP multinacionales que requieren flujos de trabajo de aprovisionamiento, módulos contables e integraciones empresariales.

No se necesita experiencia en hojas de cálculo. Abre la versión de navegador y empieza a rastrear de inmediato, o usa el libro de Excel sin conexión.

---

## Acerca de

Construyo rastreadores ligeros y herramientas de apoyo a la decisión para situaciones con demasiadas piezas en movimiento para tenerlas en la cabeza.

La pregunta central es siempre la misma:

> ¿Qué información necesita existir en un solo lugar para tomar la próxima decisión con confianza?

Este panel de control logístico es un ejemplo de ese enfoque: convertir registros operativos dispersos en sistemas de razonamiento reutilizables en lugar de crear otra plataforma que mantener.

---

## Detalles técnicos

<details>
<summary>Para revisores técnicos, practicantes de Excel y colaboradores</summary>

---

### Arquitectura del libro

| Capa | Hoja | Rol |
|---|---|---|
| Salida de decisión | 00_Dashboard | Informes y alertas de KPI para el CEO |
| Datos maestros | 01_Master_Data | Clientes, vehículos, conductores, diccionarios de estado |
| Entrada operativa | 02_Clearing_Agency | Flujo de aduana y registro financiero |
| Entrada operativa | 03_Fleet_Operations | Despacho y ejecución del transporte |
| Motor de cálculo | 04_Consolidation_Engine | Consolidación a nivel de contenedor |
| Gobernanza | 05_User_Guide | Estándares y orientación de mantenimiento |

#### Flujo de datos

```text
Master Data
     ↓
Clearing Agency ──┐
                  │
Fleet Operations ├──→ Consolidation Engine
                  │
                  ↓
             Dashboard
```

#### Lógica de clave primaria

```text
Container Number

Clearing Agency:
Primary Key (PK)

Fleet Operations:
Foreign Key (FK)

Consolidation:
Aggregation Dimension
```

---

### Tres trampas que atrapan incluso a operadores logísticos experimentados

#### Trampa 1: ganancia de departamento ≠ ganancia de envío

Se tomó una decisión.

> "El negocio de despacho es rentable."

La falla inadvertida:

Se excluyeron los costos de transporte.

| Vista errónea | Vista correcta |
|---|---|
| Solo ganancia de aduana | Ganancia del contenedor de extremo a extremo |
| Informes departamentales | Economía del envío |
| Confianza falsa | Contribución precisa |

Resultado corregido:

La dirección interviene sobre envíos específicos con pérdidas en lugar de culpar a departamentos enteros.

<details>
<summary>Fórmulas</summary>

```excel
Clearance Profit
= Agency Revenue - Agency Cost

Fleet Profit
= Freight Revenue - Fuel Cost - Trip Expense

Total Profit
= Clearance Profit + Fleet Profit
```

</details>

---

#### Trampa 2: liberado no significa entregado

Se tomó una decisión.

> "Las operaciones avanzan con normalidad."

La falla inadvertida:

Los contenedores liberados permanecieron sin despachar.

| Vista errónea | Vista correcta |
|---|---|
| Liberado por aduana | Completado operativamente |
| Estado supuesto | Estado verificado |
| Retraso oculto | Retraso escalado |

Resultado corregido:

Los gerentes se enfocan de inmediato en los cuellos de botella del despacho.

<details>
<summary>Fórmulas</summary>

```excel
=IF(
 Clearance<>"Released",
 "Clearing",
 IF(Delivery="未派车","Awaiting Dispatch",Delivery)
)
```

</details>

---

#### Trampa 3: clientes de altos ingresos pueden destruir el margen

Se tomó una decisión.

> "Los clientes más grandes merecen prioridad."

La falla inadvertida:

Los rankings de ingresos ignoraron los costos de ejecución.

| Vista errónea | Vista correcta |
|---|---|
| Ranking de ingresos | Ranking de ganancias |
| Enfoque en el volumen | Enfoque en la contribución |
| Esfuerzo mal asignado | Optimización de recursos |

Resultado corregido:

La atención comercial se desplaza hacia las relaciones rentables.

<details>
<summary>Fórmulas</summary>

```excel
=QUERY(
 Consolidation!A:H,
 "SELECT B,SUM(H)
 GROUP BY B
 ORDER BY SUM(H) DESC"
)
```

</details>

---

### Escenario de ejemplo

Un contenedor llega a Mombasa.

#### Entradas

```text
Container:
MSKU1234567

Agency Revenue:
KES 120,000

Agency Cost:
KES 90,000

Freight Revenue:
KES 60,000

Fuel:
KES 20,000

Trip Expenses:
KES 5,000
```

#### Cálculos intermedios

```text
Clearance Profit
= 120,000 − 90,000
= KES 30,000

Fleet Profit
= 60,000 − 20,000 − 5,000
= KES 35,000

Total Profit
= 30,000 + 35,000
= KES 65,000
```

#### Interpretación

El envío generó ganancias saludables en ambas entidades.

Si los gastos de transporte hubieran aumentado a 55.000 KES en su lugar, el mismo envío habría contribuido solo con 15.000 KES en total.

#### Recomendación

Monitorea la rentabilidad de los contenedores de forma continua en lugar de depender de resúmenes de fin de mes.

#### Implicación de decisión

La eficiencia del despacho influye directamente en la rentabilidad comercial.

---

### Referencia de fórmulas

<details>
<summary>Motor de consolidación</summary>

```excel
Unique Containers
=UNIQUE(Clearing!A2:A)

Client Lookup
=XLOOKUP(...)

Fleet Profit
=SUMIFS(...)
 -SUMIFS(...)
 -SUMIFS(...)
```

</details>

<details>
<summary>KPI del panel</summary>

```excel
Total Profit
=SUM(H:H)

Average Profit
=AVERAGE(H:H)

Clearance Total
=SUM(F:F)

Fleet Total
=SUM(G:G)
```

</details>

<details>
<summary>Lógica de estado</summary>

```excel
Overall Status
=IF(...)
```

</details>

---

### Reglas de validación

| Campo | Regla | Comportamiento ante error |
|---|---|---|
| Número de contenedor | 4 letras + 7 dígitos | Rechazar entrada inválida |
| Cliente | Debe existir en la lista maestra | Impedir el envío |
| Placa del vehículo | Debe existir en la lista maestra | Rechazar valores personalizados |
| Conductor | Debe existir en la lista maestra | Rechazar valores personalizados |
| Estado KRA | Lista controlada | Restringir la entrada |
| Estado KEBS | Lista controlada | Restringir la entrada |
| Estado de despacho | Lista controlada | Restringir la entrada |
| Estado de entrega | Lista controlada | Restringir la entrada |
| Columnas de fórmulas | Rangos protegidos | Solo lectura |
| Panel | Hoja completa protegida | Solo lectura |

</details>

---

## Otras herramientas de esta serie

- Financial Dual-Track Budget Control Dashboard — planificación de efectivo personal y empresarial.
- Lawn Care Operations Console — coordinación de equipos de campo y rentabilidad del servicio.
- CRM Decision Support Trackers — gestión de clientes operativa sin complejidad de ERP.

Perfil de GitHub: *Añade el enlace del perfil aquí*

---

## Licencia

Este proyecto está licenciado bajo la **Apache License 2.0**.

Puedes usar, modificar y distribuir esta obra de acuerdo con los términos de la Apache License 2.0.

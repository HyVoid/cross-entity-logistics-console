[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Verwandeln Sie fragmentierte Logistikabläufe in eine Gewinnsicht

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Type-Decision%20Support-orange.svg)

**Verfolgen Sie Zollabfertigung, Flottenbetrieb und Containerrentabilität in einem leichten Arbeitsbereich—kostenlos nutzbar, ohne Installation, entweder im Browser oder im Tabellenkalkulationsformat.**

**Keine Registrierung. Keine Installation. Kostenlos in Ihrem Browser.**

Testen Sie die Browserversion kostenlos. Wenn Sie die Excel-Version benötigen, können Sie sie mit einer 30-tägigen Geld-zurück-Garantie ohne Fragen erwerben.
>
> 🌐 Im Browser öffnen → [*hier*](https://hyvoid.github.io/cross-entity-logistics-console/)  
> 📥 Excel herunterladen → *demnächst*

---

## Was es Ihnen beim Verfolgen hilft

- Den gesamten Gewinn aus Zollabfertigung und Flottenbetrieb aus einer einzigen Sicht.
- Vom Zoll freigegebene Container, die noch auf den Versand warten.
- Individuelle Containerrentabilität statt getrennter Abteilungsergebnisse.
- Kundenbeitrags-Rankings basierend auf dem tatsächlichen End-to-End-Gewinn.
- Fahrzeugrentabilitätstrends über mehrere Transportaufträge hinweg.
- Verlustbringende Sendungen, bevor sie in aggregierten Zahlen verschwinden.

---

## Warum ich das gebaut habe

Viele Logistikunternehmen operieren in zwei getrennten Realitäten.

Das Zollteam verfolgt Erklärungen, Freigaben und Agenturumsatz.

Das Transportteam verfolgt Versand, Fahrer und Lieferkosten.

Das Management erhält von jeder Seite getrennte Berichte und nimmt an, das Gesamtgeschäft sei gesund.

Das Problem ist, dass Rentabilität nicht innerhalb von Abteilungen existiert. Sie existiert auf Containerebene.

Ein Container, der ausgezeichnete Zollmargen erzielt, kann später unerwartete Kraftstoffkosten, Fahrerzulagen und Lieferverzögerungen absorbieren, die den Gewinn völlig eliminieren. Umgekehrt kann ein zunächst mittelmäßig wirkender Zollauftrag nach effizienter Transportdurchführung hochprofitabel werden.

Ich habe das gebaut, weil das analytische Versagen wiederkehrend war:

- Teams optimierten ihre eigenen Kennzahlen.
- Führungskräfte trafen Entscheidungen mit unvollständigen Zahlen.
- Verluste blieben bis zur Monatsendabstimmung unsichtbar.

Vorher:

> "Das Clearing-Geschäft hat Geld verdient."
>
> "Das Flottengeschäft hat sich recht ordentlich entwickelt."

Nachher:

> "Container MSKU1234567 erzielte KES 30.000 während der Zollabfertigung, verlor aber KES 25.000 während des Transports, was nur einen Nettobeitrag von KES 5.000 ergab."

Diese Erkenntnis verändert Entscheidungen.

Anstatt einen weiteren ERP-Ersatz zu bauen, produktisiert diese Arbeitsmappe ein Reasoning-Framework:

**Folgen Sie dem Container. Konsolidieren Sie die Ökonomie. Legen Sie Ausnahmen früh genug offen, um zu handeln.**

---

## Häufige Logistikprobleme, die das löst

| Problem | Ohne dieses Tool | Mit diesem Tool |
|---|---|---|
| Zoll und Transport arbeiten getrennt | Abteilungen berichten unabhängig | Eine Gewinnsicht auf Containerebene |
| Freigegebene Container stehen still | Versandverzögerungen bleiben verborgen | "Freigegeben-aber-unversandt"-Ausnahmen treten sofort hervor |
| Flottenrentabilität ist unklar | Fahrzeugkosten verschwimmen ineinander | Fahrzeugbeitrag wird messbar |
| Kundenrentabilität ist verzerrt | Umsatzrankings ignorieren Ausführungskosten | Kundenrankings spiegeln tatsächlichen Gewinn wider |
| Verlustbringende Sendungen bleiben unbemerkt | Probleme treten bei Monatsendprüfungen auf | Verluste lösen betriebliche Alarme aus |
| Datenqualität verschlechtert sich | Unterschiedliche Namenskonventionen treten auf | Kontrollierte Validierung erzwingt Konsistenz |

---

## Für wen sich das eignet

Dieses Tool ist konzipiert für:

- Zollabfertigungsagenturen, die eigene Transportflotten betreiben.
- Spediteure, die End-to-End-Containerabwicklung verwalten.
- Kleine und mittlere Logistikunternehmen, die Betriebstransparenz ohne ERP-Komplexität brauchen.
- Inhaber und Betriebsleiter, die Informationen derzeit manuell abstimmen.

Dies ist **nicht** für multinationale ERP-Implementierungen konzipiert, die Beschaffungs-Workflows, Buchhaltungsmodule und Unternehmensintegrationen erfordern.

Es sind keine Tabellenkalkulations-Kenntnisse erforderlich. Öffnen Sie die Browserversion und beginnen Sie sofort mit der Verfolgung, oder nutzen Sie die Excel-Arbeitsmappe offline.

---

## Über mich

Ich baue leichte Tracker und Entscheidungs-Unterstützungstools für Situationen mit zu vielen beweglichen Teilen, um sie im Kopf zu behalten.

Die zentrale Frage ist immer dieselbe:

> Welche Informationen müssen an einem Ort existieren, um die nächste Entscheidung sicher zu treffen?

Dieses Logistik-Kontrolldashboard ist ein Beispiel für diesen Ansatz: verstreute Betriebsaufzeichnungen in wiederverwendbare Reasoning-Systeme zu verwandeln, statt eine weitere pflegebedürftige Plattform zu schaffen.

---

## Technische Details

<details>
<summary>Für technische Prüfer, Excel-Praktiker und Mitarbeiter</summary>

---

### Arbeitsmappen-Architektur

| Ebene | Blatt | Rolle |
|---|---|---|
| Entscheidungsausgabe | 00_Dashboard | CEO-KPI-Berichterstattung und Alarme |
| Stammdaten | 01_Master_Data | Kunden, Fahrzeuge, Fahrer, Statuswörterbücher |
| Betriebliche Eingabe | 02_Clearing_Agency | Zoll-Workflow und finanzielle Erfassung |
| Betriebliche Eingabe | 03_Fleet_Operations | Versand und Transportdurchführung |
| Berechnungs-Engine | 04_Consolidation_Engine | Konsolidierung auf Containerebene |
| Governance | 05_User_Guide | Standards und Wartungshinweise |

#### Datenfluss

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

#### Primärschlüssel-Logik

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

### Drei Fallen, die selbst erfahrene Logistikbetreiber fangen

#### Falle 1: Abteilungsgewinn ≠ Sendungsgewinn

Eine Entscheidung wurde getroffen.

> "Das Clearing-Geschäft ist profitabel."

Der unbemerkte Fehler:

Transportkosten wurden ausgeschlossen.

| Falsche Sicht | Richtige Sicht |
|---|---|
| Nur Zollgewinn | End-to-End-Containergewinn |
| Abteilungsberichterstattung | Sendungsökonomie |
| Falsches Vertrauen | Genauer Beitrag |

Korrigiertes Ergebnis:

Das Management greift bei bestimmten verlustbringenden Sendungen ein, statt ganze Abteilungen zu beschuldigen.

<details>
<summary>Formeln</summary>

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

#### Falle 2: Freigegeben bedeutet nicht geliefert

Eine Entscheidung wurde getroffen.

> "Der Betrieb läuft normal."

Der unbemerkte Fehler:

Freigegebene Container blieben unversandt.

| Falsche Sicht | Richtige Sicht |
|---|---|
| Vom Zoll freigegeben | Betrieblich abgeschlossen |
| Status angenommen | Status verifiziert |
| Verzögerung verborgen | Verzögerung eskaliert |

Korrigiertes Ergebnis:

Manager konzentrieren sich sofort auf Versand-Engpässe.

<details>
<summary>Formeln</summary>

```excel
=IF(
 Clearance<>"Released",
 "Clearing",
 IF(Delivery="未派车","Awaiting Dispatch",Delivery)
)
```

</details>

---

#### Falle 3: Kunden mit hohem Umsatz können die Marge zerstören

Eine Entscheidung wurde getroffen.

> "Die größten Kunden verdienen Priorität."

Der unbemerkte Fehler:

Umsatzrankings ignorierten Ausführungskosten.

| Falsche Sicht | Richtige Sicht |
|---|---|
| Umsatzranking | Gewinnranking |
| Volumenfokus | Beitragsfokus |
| Fehlgeleiteter Aufwand | Ressourcenoptimierung |

Korrigiertes Ergebnis:

Die kommerzielle Aufmerksamkeit verschiebt sich hin zu profitablen Beziehungen.

<details>
<summary>Formeln</summary>

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

### Beispielszenario

Ein Container kommt in Mombasa an.

#### Eingaben

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

#### Zwischenberechnungen

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

#### Interpretation

Die Sendung erzielte über beide Einheiten hinweg gesunde Gewinne.

Wären die Transportkosten stattdessen auf KES 55.000 gestiegen, hätte dieselbe Sendung insgesamt nur KES 15.000 beigetragen.

#### Empfehlung

Überwachen Sie die Containerrentabilität kontinuierlich, statt sich auf Monatsendzusammenfassungen zu verlassen.

#### Entscheidungsauswirkung

Die Versand-Effizienz beeinflusst die kommerzielle Rentabilität direkt.

---

### Formelreferenz

<details>
<summary>Konsolidierungs-Engine</summary>

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
<summary>Dashboard-KPIs</summary>

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
<summary>Status-Logik</summary>

```excel
Overall Status
=IF(...)
```

</details>

---

### Validierungsregeln

| Feld | Regel | Fehlerverhalten |
|---|---|---|
| Container-Nummer | 4 Buchstaben + 7 Ziffern | Ungültige Eingabe abweisen |
| Kunde | Muss in Stammliste existieren | Absenden verhindern |
| Fahrzeugkennzeichen | Muss in Stammliste existieren | Eigene Werte abweisen |
| Fahrer | Muss in Stammliste existieren | Eigene Werte abweisen |
| KRA-Status | Kontrollierte Liste | Eingabe beschränken |
| KEBS-Status | Kontrollierte Liste | Eingabe beschränken |
| Clearance-Status | Kontrollierte Liste | Eingabe beschränken |
| Lieferstatus | Kontrollierte Liste | Eingabe beschränken |
| Formelspalten | Geschützte Bereiche | Schreibgeschützt |
| Dashboard | Gesamtes Blatt geschützt | Schreibgeschützt |

</details>

---

## Weitere Tools dieser Serie

- Financial Dual-Track Budget Control Dashboard — persönliche und geschäftliche Finanzplanung.
- Lawn Care Operations Console — Koordination von Außendienstteams und Dienstleistungsrentabilität.
- CRM Decision Support Trackers — betriebliches Kundenmanagement ohne ERP-Komplexität.

GitHub-Profil: *Profil-Link hier hinzufügen*

---

## Lizenz

Dieses Projekt ist unter der **Apache License 2.0** lizenziert.

Sie dürfen dieses Werk gemäß den Bedingungen der Apache License 2.0 verwenden, modifizieren und verteilen.

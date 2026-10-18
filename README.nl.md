[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Verander gefragmenteerde logistieke operaties in één winstbeeld

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Type-Decision%20Support-orange.svg)

**Houd douanegoedkeuring, vlootuitvoering en containerwinstgevendheid bij in één lichte werkruimte—gratis te gebruiken, zonder installatie, in browser- of spreadsheetformaat.**

**Geen registratie. Geen installatie. Gratis in uw browser.**

Probeer de browserversie gratis. Als u de Excel-versie nodig heeft, kunt u die kopen met een geld-terug-garantie van 30 dagen zonder vragen.
>
> 🌐 Open in browser → [*hier*](https://hyvoid.github.io/cross-entity-logistics-console/)  
> 📥 Download Excel → *binnenkort*

---

## Wat het helpt bijhouden

- De totale winst gegenereerd over douanegoedkeuring en vlootoperaties vanuit één enkel beeld.
- Containers vrijgegeven door de douane maar nog wachtend op verzending.
- Individuele containerwinstgevendheid in plaats van losgekoppelde afdelingsresultaten.
- Klantenbijdraagrankings op basis van werkelijke end-to-end winst.
- Voertuigwinstgevendheidstrends over meerdere transportopdrachten.
- Verlieslatende zendingen voordat ze verdwijnen in geaggregeerde cijfers.

---

## Waarom ik dit heb gebouwd

Veel logistieke bedrijven opereren in twee gescheiden realiteiten.

Het douaneteam volgt declaraties, vrijgevingen en agentschapsinkomsten.

Het transportteam volgt verzendingen, chauffeurs en bezorgkosten.

Het management ontvangt gescheiden rapporten van elke kant en neemt aan dat het totale bedrijf gezond is.

Het probleem is dat winstgevendheid niet binnen afdelingen bestaat. Het bestaat op containerniveau.

Een container die uitstekende douanemarges genereert, kan later onverwachte brandstofkosten, chauffeursvergoedingen en bezorgvertragingen absorberen die de winst volledig uitroeien. Omgekeerd kan een schijnbaar middelmatige douanetaak zeer winstgevend worden na efficiënte transportuitvoering.

Ik bouwde dit omdat het analytische falen terugkerend was:

- Teams optimaliseerden hun eigen metrics.
- Leiders namen beslissingen met onvolledige cijfers.
- Verliezen bleven onzichtbaar tot de maandeindafstemming.

Voor:

> "Het clearingbedrijf verdient geld."
>
> "Het vlootbedrijf presteerde redelijk goed."

Na:

> "Container MSKU1234567 genereerde KES 30.000 tijdens douanegoedkeuring maar verloor KES 25.000 tijdens transport, wat slechts een nettobijdrage van KES 5.000 opleverde."

Dat inzicht verandert beslissingen.

In plaats van een andere ERP-vervanger te bouwen, productaliseert dit werkboek een redeneerframework:

**Volg de container. Consolideer de economie. Breng uitzonderingen tijdig naar boven om te handelen.**

---

## Veelvoorkomende logistieke problemen die dit oplost

| Probleem | Zonder deze tool | Met deze tool |
|---|---|---|
| Douane en transport werken gescheiden | Afdelingen rapporteren onafhankelijk | Eén winstbeeld op containerniveau |
| Vrijgegeven containers staan stil | Verzendvertragingen blijven verborgen | "Vrijgegeven-maar-niet-verzonden"-uitzonderingen komen direct naar boven |
| Vlootwinstgevendheid is onduidelijk | Voertuigkosten vloeien ineen | Voertuigbijdrage wordt meetbaar |
| Klantwinstgevendheid is vertekend | Omzetrankings negeren uitvoerkosten | Klantrankings weerspiegelen werkelijke winst |
| Verlieslatende zendingen blijven onopgemerkt | Problemen komen naar boven bij maandeindreviews | Verliezen triggeren operationele alerts |
| Gegevenskwaliteit verslechtert | Verschillende naamgevingsconventies verschijnen | Gecontroleerde validatie dwingt consistentie af |

---

## Voor wie dit is

Deze tool is ontworpen voor:

- Douanegoedkeuringsagentschappen die hun eigen transportvloot runnen.
- Freight forwarders die end-to-end containeruitvoering beheren.
- Kleine en middelgrote logistieke bedrijven die operationele zichtbaarheid nodig hebben zonder ERP-complexiteit.
- Eigenaren en operationsmanagers die informatie momenteel handmatig afstemmen.

Dit is **niet** ontworpen voor multinationale ERP-implementaties die inkoopworkflows, boekhoudmodules en bedrijfsintegraties vereisen.

Geen spreadsheetexpertise nodig. Open de browserversie en begin direct met volgen, of gebruik het Excel-werkboek offline.

---

## Over

Ik bouw lichte trackers en beslissingsondersteuningstools voor situaties met te veel bewegende delen om in uw hoofd te houden.

De centrale vraag is altijd dezelfde:

> Welke informatie moet op één plek bestaan om de volgende beslissing zelfverzekerd te nemen?

Dit logistieke controledashboard is één voorbeeld van die aanpak: verspreide operationele records omzetten in herbruikbare redeneersystemen in plaats van een ander platform om te onderhouden.

---

## Technische details

<details>
<summary>Voor technische reviewers, Excel-beoefenaars en medewerkers</summary>

---

### Werkboekarchitectuur

| Laag | Blad | Rol |
|---|---|---|
| Beslissingsoutput | 00_Dashboard | CEO-KPI-rapportage en alerts |
| Stamgegevens | 01_Master_Data | Klanten, voertuigen, chauffeurs, statuswoordenboeken |
| Operationele invoer | 02_Clearing_Agency | Douaneworkflow en financiële registratie |
| Operationele invoer | 03_Fleet_Operations | Verzending en transportuitvoering |
| Rekenengine | 04_Consolidation_Engine | Consolidatie op containerniveau |
| Governance | 05_User_Guide | Normen en onderhoudsrichtlijnen |

#### Gegevensstroom

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

#### Primaire-sleutellogica

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

### Drie valkuilen die zelfs ervaren logistiekoperators vangen

#### Valkuil 1: afdelingswinst ≠ zendingwinst

Een beslissing werd genomen.

> "Het clearingbedrijf is winstgevend."

Het onopgemerkte gebrek:

Transportkosten werden uitgesloten.

| Verkeerd beeld | Juist beeld |
|---|---|
| Alleen douanewinst | End-to-end containerwinst |
| Afdelingsrapportage | Zendingseconomie |
| Vals vertrouwen | Nauwkeurige bijdrage |

Gecorrigeerd resultaat:

Het management grijpt in op specifieke verlieslatende zendingen in plaats van hele afdelingen de schuld te geven.

<details>
<summary>Formules</summary>

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

#### Valkuil 2: vrijgegeven betekent niet afgeleverd

Een beslissing werd genomen.

> "De operaties verlopen normaal."

Het onopgemerkte gebrek:

Vrijgegeven containers bleven onverzonden.

| Verkeerd beeld | Juist beeld |
|---|---|
| Door douane vrijgegeven | Operationeel voltooid |
| Status verondersteld | Status geverifieerd |
| Vertraging verborgen | Vertraging geëscaleerd |

Gecorrigeerd resultaat:

Managers richten zich direct op verzendknelpunten.

<details>
<summary>Formules</summary>

```excel
=IF(
 Clearance<>"Released",
 "Clearing",
 IF(Delivery="未派车","Awaiting Dispatch",Delivery)
)
```

</details>

---

#### Valkuil 3: klanten met hoge omzet kunnen de marge vernietigen

Een beslissing werd genomen.

> "De grootste klanten verdienen prioriteit."

Het onopgemerkte gebrek:

Omzetrankings negeerden uitvoerkosten.

| Verkeerd beeld | Juist beeld |
|---|---|
| Omzetranking | Winstranking |
| Volumefocus | Bijdragefocus |
| Verkeerd toegekende inspanning | Resource-optimalisatie |

Gecorrigeerd resultaat:

Commerciële aandacht verschuift naar winstgevende relaties.

<details>
<summary>Formules</summary>

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

### Voorbeeldscenario

Een container arriveert in Mombasa.

#### Invoer

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

#### Tussenberekeningen

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

#### Interpretatie

De zending genereerde gezonde winsten over beide entiteiten.

Waren transportkosten in plaats daarvan gestegen naar KES 55.000, dan had dezelfde zending slechts KES 15.000 in totaal bijgedragen.

#### Aanbeveling

Monitor containerwinstgevendheid continu in plaats van te vertrouwen op maandeindsamenvattingen.

#### Beslissingsimplicatie

Verzendingsefficiëntie beïnvloedt commerciële winstgevendheid direct.

---

### Formelereferentie

<details>
<summary>Consolidatie-engine</summary>

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
<summary>Dashboard-KPI's</summary>

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
<summary>Statuslogica</summary>

```excel
Overall Status
=IF(...)
```

</details>

---

### Validatieregels

| Veld | Regel | Foutgedrag |
|---|---|---|
| Containernummer | 4 letters + 7 cijfers | Ongeldige invoer afwijzen |
| Klant | Moet in stamlijst bestaan | Indiening voorkomen |
| Kentekenplaat | Moet in stamlijst bestaan | Aangepaste waarden afwijzen |
| Chauffeur | Moet in stamlijst bestaan | Aangepaste waarden afwijzen |
| KRA-status | Gecontroleerde lijst | Invoer beperken |
| KEBS-status | Gecontroleerde lijst | Invoer beperken |
| Goedkeuringsstatus | Gecontroleerde lijst | Invoer beperken |
| Bezorgstatus | Gecontroleerde lijst | Invoer beperken |
| Formulekolommen | Beveiligde bereiken | Alleen-lezen |
| Dashboard | Geheel blad beveiligd | Alleen-lezen |

</details>

---

## Andere tools in deze serie

- Financial Dual-Track Budget Control Dashboard — persoonlijke en zakelijke kasplanning.
- Lawn Care Operations Console — coördinatie van veldteams en servicewinstgevendheid.
- CRM Decision Support Trackers — operationeel klantbeheer zonder ERP-complexiteit.

GitHub-profiel: *Voeg profiellink hier toe*

---

## Licentie

Dit project is gelicentieerd onder de **Apache License 2.0**.

U mag dit werk gebruiken, wijzigen en distribueren in overeenstemming met de voorwaarden van de Apache License 2.0.

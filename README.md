
# Turn Fragmented Logistics Operations Into One Profit View

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Type-Decision%20Support-orange.svg)

**Track customs clearance, fleet execution, and container profitability in one lightweight workspace—free to use, with no installation required in either browser or spreadsheet format.**

> **No signup. No installation. Free.**
>
> 🌐 Open in Browser → *Add HTML live demo link here*  
> 📥 Download Excel → *Add GitHub Release or Gumroad link here*

---

## Screenshots

### Browser Version
<!-- screenshot: browser version -->

*Shows the full operational funnel from customs release to final delivery, highlighting bottlenecks requiring management attention.*

### Excel Version
<!-- screenshot: excel version -->

*Shows consolidated container-level profitability with operational status and exception monitoring.*

---

## What It Helps You Track

- Total profit generated across customs clearance and fleet operations from a single view.
- Containers released by customs but still waiting for dispatch.
- Individual container profitability instead of disconnected departmental results.
- Customer contribution rankings based on actual end-to-end profit.
- Vehicle profitability trends across multiple transport assignments.
- Loss-making shipments before they disappear inside aggregate numbers.

---

## Why I Built This

Many logistics businesses operate two separate realities.

The customs team tracks declarations, releases, and agency revenue.

The transport team tracks dispatches, drivers, and delivery expenses.

Management receives separate reports from each side and assumes the overall business is healthy.

The problem is that profitability does not exist inside departments. It exists at the container level.

A container that generates excellent customs margins may later absorb unexpected fuel expenses, driver allowances, and delivery delays that eliminate profit entirely. Conversely, an apparently mediocre customs job may become highly profitable after efficient transportation execution.

I built this because the analytical failure was recurring:

- Teams optimized their own metrics.
- Leaders made decisions using incomplete numbers.
- Losses remained invisible until month-end reconciliation.

Before:

> "The clearing business made money."
>
> "The fleet business performed reasonably well."

After:

> "Container MSKU1234567 generated KES 30,000 during customs clearance but lost KES 25,000 during transport, resulting in only KES 5,000 net contribution."

That insight changes decisions.

Instead of building another ERP replacement, this workbook productizes a reasoning framework:

**Follow the container. Consolidate the economics. Surface exceptions early enough to act.**

---

## Common Logistics Problems This Solves

| Problem | Without This Tool | With This Tool |
|---|---|---|
| Customs and transport operate separately | Departments report independently | One container-level profit view |
| Released containers sit idle | Dispatch delays remain hidden | Released-but-undispatched exceptions surface immediately |
| Fleet profitability is unclear | Vehicle costs blend together | Vehicle contribution becomes measurable |
| Customer profitability is distorted | Revenue rankings ignore execution costs | Customer rankings reflect actual profit |
| Loss-making shipments go unnoticed | Problems emerge during month-end reviews | Losses trigger operational alerts |
| Data quality deteriorates | Different naming conventions appear | Controlled validation enforces consistency |

---

## Who This Is For

This tool is designed for:

- Customs clearing agencies operating their own transport fleets.
- Freight forwarders managing end-to-end container execution.
- Small and mid-sized logistics businesses needing operational visibility without ERP complexity.
- Owners and operations managers who currently reconcile information manually.

This is **not** designed for multinational ERP implementations requiring procurement workflows, accounting modules, and enterprise integrations.

No spreadsheet expertise is needed. Open the browser version and start tracking immediately, or use the Excel workbook offline.

---

## About

I build lightweight trackers and decision-support tools for situations with too many moving parts to hold in your head.

The central question is always the same:

> What information needs to exist in one place to make the next decision confidently?

This logistics control dashboard is one example of that approach: turning scattered operational records into reusable reasoning systems rather than creating another platform to maintain.

---

## Technical Details

<details>
<summary>For technical reviewers, Excel practitioners, and collaborators</summary>

---

### Workbook Architecture

| Layer | Sheet | Role |
|---|---|---|
| Decision Output | 00_Dashboard | CEO KPI reporting and alerts |
| Master Data | 01_Master_Data | Customers, vehicles, drivers, status dictionaries |
| Operational Input | 02_Clearing_Agency | Customs workflow and financial recording |
| Operational Input | 03_Fleet_Operations | Dispatch and transport execution |
| Calculation Engine | 04_Consolidation_Engine | Container-level consolidation |
| Governance | 05_User_Guide | Standards and maintenance guidance |

#### Data Flow

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

#### Primary Key Logic

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

### Three Traps That Catch Even Experienced Logistics Operators

#### Trap 1: Department Profit ≠ Shipment Profit

A decision was made.

> "The clearing business is profitable."

The unnoticed flaw:

Transport costs were excluded.

| Wrong View | Correct View |
|---|---|
| Customs profit only | End-to-end container profit |
| Department reporting | Shipment economics |
| False confidence | Accurate contribution |

Corrected outcome:

Management intervenes on specific loss-making shipments instead of blaming entire departments.

<details>
<summary>Formulas</summary>

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

#### Trap 2: Released Does Not Mean Delivered

A decision was made.

> "Operations are moving normally."

The unnoticed flaw:

Released containers remained undispatched.

| Wrong View | Correct View |
|---|---|
| Customs released | Operationally completed |
| Status assumed | Status verified |
| Delay hidden | Delay escalated |

Corrected outcome:

Managers focus immediately on dispatch bottlenecks.

<details>
<summary>Formulas</summary>

```excel
=IF(
 Clearance<>"Released",
 "Clearing",
 IF(Delivery="未派车","Awaiting Dispatch",Delivery)
)
```

</details>

---

#### Trap 3: High Revenue Customers Can Destroy Margin

A decision was made.

> "Largest customers deserve priority."

The unnoticed flaw:

Revenue rankings ignored execution costs.

| Wrong View | Correct View |
|---|---|
| Revenue ranking | Profit ranking |
| Volume focus | Contribution focus |
| Misallocated effort | Resource optimization |

Corrected outcome:

Commercial attention shifts toward profitable relationships.

<details>
<summary>Formulas</summary>

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

### Example Scenario

A container arrives in Mombasa.

#### Inputs

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

#### Intermediate Calculations

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

The shipment generated healthy profits across both entities.

Had transport expenses increased to KES 55,000 instead, the same shipment would contribute only KES 15,000 overall.

#### Recommendation

Monitor container profitability continuously rather than relying on month-end summaries.

#### Decision Implication

Dispatch efficiency directly influences commercial profitability.

---

### Formula Reference

<details>
<summary>Consolidation Engine</summary>

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
<summary>Dashboard KPIs</summary>

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
<summary>Status Logic</summary>

```excel
Overall Status
=IF(...)
```

</details>

---

### Validation Rules

| Field | Rule | Error Behavior |
|---|---|---|
| Container Number | 4 letters + 7 digits | Reject invalid entry |
| Customer | Must exist in master list | Prevent submission |
| Vehicle Plate | Must exist in master list | Reject custom values |
| Driver | Must exist in master list | Reject custom values |
| KRA Status | Controlled list | Restrict entry |
| KEBS Status | Controlled list | Restrict entry |
| Clearance Status | Controlled list | Restrict entry |
| Delivery Status | Controlled list | Restrict entry |
| Formula Columns | Protected ranges | Read-only |
| Dashboard | Entire sheet protected | Read-only |

</details>

---

## Other Tools in This Series

- Financial Dual-Track Budget Control Dashboard — personal and business cash planning.
- Lawn Care Operations Console — field crew coordination and service profitability.
- CRM Decision Support Trackers — operational customer management without ERP complexity.

GitHub Profile: *Add profile link here*

---

## License

This project is licensed under the **Apache License 2.0**.

You may use, modify, and distribute this work in accordance with the terms of the Apache License 2.0.

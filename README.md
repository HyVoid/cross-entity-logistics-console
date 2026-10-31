[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Turn Fragmented Logistics Operations Into One Profit View

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Type-Decision%20Support-orange.svg)

**Track customs clearance, fleet execution, and container profitability in one lightweight workspace—free to use, with no installation required in either browser or spreadsheet format.**

**No signup. No installation. Free in your browser.**

Try the browser version for free. If you need the Excel version, you can buy it with a 30-day, no-questions-asked money-back guarantee.
>
> 🌐 Open in Browser → [*here*](https://hyvoid.github.io/cross-entity-logistics-console/)  
> 📥 Download Excel → *coming soon*

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

- **[rolling-cashflow-forecast](https://github.com/HyVoid/rolling-cashflow-forecast)** — Why is cash always tight? — Forecast future liquidity under changing operational and financial assumptions.
- **[Multi-Currency-Trade-Financial-Analyzer](https://github.com/HyVoid/Multi-Currency-Trade-Financial-Analyzer)** — Which trade flows are actually profitable after currency effects? — Measure multi-currency trade profitability across cross-border operations.
- **[RTL_Loan_Sizer_Pricer](https://github.com/HyVoid/RTL_Loan_Sizer_Pricer)** — What financing structure is supportable under different borrower and collateral scenarios? — Compare lending scenarios using risk-adjusted financing assumptions.
- **[Personal-Business-Dual-Track-Budget-Manager](https://github.com/HyVoid/Personal-Business-Dual-Track-Budget-Manager)** — Where is personal and business cash being mixed or misallocated? — Separate personal and business cash flows into independently tracked budget tracks.
- **[Multifamily-Value-Add-Acquisition-Model](https://github.com/HyVoid/Multifamily-Value-Add-Acquisition-Model)** — Does this real estate acquisition still create equity value after renovation and operating assumptions? — Evaluate multifamily acquisition returns under renovation financing and operating scenarios.
- **[Real-Estate-Valuation-all-in-one-calculator](https://github.com/HyVoid/Real-Estate-Valuation-all-in-one-calculator)** — What is a property worth under different valuation methods? — Calculate property value across multiple valuation methods with tax and capital expenditure modeling.
- **[multi-entity-expense-allocation](https://github.com/HyVoid/multi-entity-expense-allocation)** — Are shared costs being allocated fairly across entities or are some assets overburdened while others escape their true cost exposure? — Distribute supplier invoices across multiple legal entities and operating assets using configurable allocation methodologies.
- **[investment-pool-nav-excel-template](https://github.com/HyVoid/investment-pool-nav-excel-template)** — What is each participant actually owed based on their entry timing and current pool value? — Track investment pool ownership continuously using NAV-based unit accounting.
- **[shopify-cash-flow-forecast-excel-toolkit](https://github.com/HyVoid/shopify-cash-flow-forecast-excel-toolkit)** — Which operational commitments will create a cash problem in the next twelve weeks? — Connect Shopify sales bank transactions advertising spend and inventory purchasing into a unified cash flow decision framework.
- **[Revenue-Management-Decision-Engine](https://github.com/HyVoid/Revenue-Management-Decision-Engine)** — Has enough meaningful information changed to justify a pricing adjustment? — Govern pricing recommendations through configurable guard rails that prevent unnecessary revenue volatility.
- **[amazon-wbr-sqp-analytics-template](https://github.com/HyVoid/amazon-wbr-sqp-analytics-template)** — What actually changed in the business this period and which products or keywords drove the change? — Transform Amazon Seller Central SQP and Sellerboard exports into standardized executive business reviews.
- **[food-manufacturing-cost-calculator-excel](https://github.com/HyVoid/food-manufacturing-cost-calculator-excel)** — Which products are actually profitable after all manufacturing costs are allocated and which are destroying margin? — Allocate factory labor utilities overhead and material costs to every SKU for true unit manufacturing economics.
- **[ecommerce-profit-calculator-excel](https://github.com/HyVoid/ecommerce-profit-calculator-excel)** — Which orders are actually profitable after all hidden costs and where is money leaking across channels and currencies? — Reconstruct true order-level profitability by reconciling sales payouts shipping costs payment fees and marketplace commissions across multi-channel e-commerce operations.
- **[construction-job-costing-excel-template](https://github.com/HyVoid/construction-job-costing-excel-template)** — Which contractor projects and customers are actually profitable after all job costs? — Connect lead estimation, job execution, and actual cost tracking into a unified contractor profitability framework.
- **[Flora-Pastry-Coffee-Shop-Operating-Control-System](https://github.com/HyVoid/Flora-Pastry-Coffee-Shop-Operating-Control-System)** — Is the shop genuinely profitable after all ingredient, labor, and operating costs? — Connect recipe costing, sales, inventory consumption, and operating expenses into a unified profitability and cash flow framework.
- **[freight-forwarder-job-costing-excel](https://github.com/HyVoid/freight-forwarder-job-costing-excel)** — Which freight bookings are actually profitable after all costs, fees, and currency conversion? — Measure booking-level freight profitability by reconciling revenue, COGS, bank fees, and container costs across mixed-currency transactions.
- **[family-loan-tracker-excel](https://github.com/HyVoid/family-loan-tracker-excel)** — What is actually owed today after years of transfers and accrued interest? — Reconcile long-term fund transfers and interest accruals into a current outstanding balance.
- **[3-statement-financial-model-excel](https://github.com/HyVoid/3-statement-financial-model-excel)** — What will our financial statements look like under different operating and financing scenarios? — Forecast integrated financial statements by linking revenue, expenses, working capital, and debt into a unified model.
- **[assisted-living-cost-allocation-excel](https://github.com/HyVoid/assisted-living-cost-allocation-excel)** — How much of each building's reported margin is actually generated by that building versus by the way corporate costs were allocated? — Allocate shared expenses across operating units while preserving source transactions and reconciling unit-level results to company totals.
- **[real-estate-development-feasibility-excel](https://github.com/HyVoid/real-estate-development-feasibility-excel)** — At what maximum land acquisition price does this development project become a bankable investment? — Evaluate residential development opportunities by screening land comparables, estimating construction costs, and calculating profit-on-cost thresholds.
- **[uk-residential-costing-software](https://github.com/HyVoid/uk-residential-costing-software)** — Will this construction project actually hit its target margin once site logistics, waste factors, and trade rate changes are accounted for? — Separate physical building quantities from volatile trade rates and site preliminaries to cascade commercial markups across tender budgets and client quotations.
- **[b2b-pricing-landed-cost-excel-model](https://github.com/HyVoid/b2b-pricing-landed-cost-excel-model)** — Which wholesale prices and customer segments actually preserve margin once freight, duties, payment terms, and FX are fully costed? — Calculate SKU-level landed costs, cost-to-serve, and pocket-margin price waterfalls to simulate cross-border wholesale profitability.
- **[custom-label-pricing-calculator](https://github.com/HyVoid/custom-label-pricing-calculator)** — What should we charge for a custom label order at each quantity tier to stay competitive and profitable? — Calculate parametric label pricing by modeling substrate square-inch costs, setup charges, and quantity-tier discount breaks against competitor benchmarks.
- **[landed-cost-calculator-retail-deduction-excel](https://github.com/HyVoid/landed-cost-calculator-retail-deduction-excel)** — What is the true net margin on each SKU once actual landed costs and retailer deductions are accounted for? — Reconcile PO-estimated landed costs against actual freight, duty, FX, and drayage charges while auditing retailer remittance deductions to expose SKU-level net margin.
- **[saas-finance-mrr-burn-rate-excel](https://github.com/HyVoid/saas-finance-mrr-burn-rate-excel)** — Can we make this week's hiring, marketing, and vendor commitments without running out of cash before the books close? — Track weekly cash burn pacing, MRR/ARR waterfall variance, retention metrics, and payroll costs against budget before month-end close.
- **[startup-financial-model-excel](https://github.com/HyVoid/startup-financial-model-excel)** — Will our growth plan run out of cash before cohort monetization catches up? — Forecast multi-year cash burn, runway, unit economics, and fundraising dilution from bottom-up cohort and headcount assumptions.
- **[shopify-pnl-reconciliation-excel](https://github.com/HyVoid/shopify-pnl-reconciliation-excel)** — Is each Shopify storefront actually profitable once true SKU-level costs, shared expenses, and bank charges are reconciled? — Reconcile multi-store Shopify sales exports against SKU-level COGS, allocated multi-currency OPEX, and bank statements to produce a trustworthy monthly P&L.
- **[travel-agency-accounting-excel-template](https://github.com/HyVoid/travel-agency-accounting-excel-template)** — Which tour bookings actually generate net profit and positive cash flow after supplier costs and B2B collections? — Calculate per-booking tour job costs, gross margins, AR/AP settlement, and operating cash flow across multiple currencies.

GitHub Profile: *Add profile link here*

---

## License

This project is licensed under the **Apache License 2.0**.

You may use, modify, and distribute this work in accordance with the terms of the Apache License 2.0.

import { MasterData, ClearingAgencyItem, FleetOperationsItem } from './types';

export const DEFAULT_MASTER_DATA: MasterData = {
  clients: [
    "Alpine Agro-Exports Ltd",
    "Mombasa Global Importers",
    "East Africa Tea Traders",
    "Great Rift Manufacturing",
    "Apex Electronics Kenya"
  ],
  vehicles: [
    "KCC 841D (Heavy Haul)",
    "KCD 902Y (Flatbed)",
    "KDA 112V (Containerized)",
    "KDM 764A (Tractor Trailer)"
  ],
  drivers: [
    "John Ochieno",
    "Peter Kamau Mwangi",
    "Sylvester Kiprop",
    "Ali Hassan"
  ],
  kraStatuses: [
    "Pending",
    "Document Lodged",
    "Assessed",
    "Paid",
    "Released"
  ],
  kebsStatuses: [
    "Not Applicable",
    "Pending",
    "Inspected",
    "Certified"
  ],
  clearanceStatuses: [
    "Pending",
    "Customs Clearing",
    "Released"
  ],
  deliveryStatuses: [
    "Pending Dispatch",
    "In Transit",
    "Delivered",
    "Returned"
  ]
};

export const DEFAULT_CLEARING_AGENCY: ClearingAgencyItem[] = [
  {
    containerNo: "MSKU9280145",
    client: "Alpine Agro-Exports Ltd",
    entryNumber: "ENT/2026/0591",
    kraStatus: "Released",
    kebsStatus: "Certified",
    clearanceStatus: "Released",
    releaseDate: "2026-06-12",
    agencyRevenue: 450000,
    agencyCost: 150000
  },
  {
    containerNo: "MAEU1029481",
    client: "East Africa Tea Traders",
    entryNumber: "ENT/2026/0612",
    kraStatus: "Released",
    kebsStatus: "Certified",
    clearanceStatus: "Released",
    releaseDate: "2026-06-15",
    agencyRevenue: 520000,
    agencyCost: 190000
  },
  {
    containerNo: "HLXU4810294",
    client: "Mombasa Global Importers",
    entryNumber: "ENT/2026/1024",
    kraStatus: "Paid",
    kebsStatus: "Inspected",
    clearanceStatus: "Customs Clearing",
    releaseDate: "",
    agencyRevenue: 380000,
    agencyCost: 210000
  },
  {
    containerNo: "COSU2910481",
    client: "Great Rift Manufacturing",
    entryNumber: "ENT/2026/0948",
    kraStatus: "Document Lodged",
    kebsStatus: "Pending",
    clearanceStatus: "Pending",
    releaseDate: "",
    agencyRevenue: 600000,
    agencyCost: 350000
  },
  {
    containerNo: "ZIMU9028471",
    client: "Apex Electronics Kenya",
    entryNumber: "ENT/2026/1102",
    kraStatus: "Pending",
    kebsStatus: "Not Applicable",
    clearanceStatus: "Pending",
    releaseDate: "",
    agencyRevenue: 410000,
    agencyCost: 120000
  }
];

export const DEFAULT_FLEET_OPERATIONS: FleetOperationsItem[] = [
  {
    dispatchId: "DISP-20260613-001",
    containerNo: "MSKU9280145",
    vehiclePlate: "KCC 841D (Heavy Haul)",
    driverName: "John Ochieno",
    dispatchDate: "2026-06-13",
    fuelCost: 65000,
    tripExpense: 20000,
    freightRevenue: 180000,
    deliveryStatus: "Delivered",
    deliveryDate: "2026-06-14"
  },
  {
    dispatchId: "DISP-20260616-002",
    containerNo: "MAEU1029481",
    vehiclePlate: "KCD 902Y (Flatbed)",
    driverName: "Peter Kamau Mwangi",
    dispatchDate: "2026-06-16",
    fuelCost: 75000,
    tripExpense: 25000,
    freightRevenue: 220000,
    deliveryStatus: "Delivered",
    deliveryDate: "2026-06-18"
  },
  {
    dispatchId: "DISP-20260618-003",
    containerNo: "HLXU4810294",
    vehiclePlate: "KDA 112V (Containerized)",
    driverName: "Sylvester Kiprop",
    dispatchDate: "2026-06-19",
    fuelCost: 80000,
    tripExpense: 15000,
    freightRevenue: 195000,
    deliveryStatus: "In Transit",
    deliveryDate: ""
  },
  {
    dispatchId: "DISP-20260620-004",
    containerNo: "COSU2910481",
    vehiclePlate: "KDM 764A (Tractor Trailer)",
    driverName: "Ali Hassan",
    dispatchDate: "2026-06-21",
    fuelCost: 0,
    tripExpense: 0,
    freightRevenue: 250000,
    deliveryStatus: "Pending Dispatch",
    deliveryDate: ""
  }
];

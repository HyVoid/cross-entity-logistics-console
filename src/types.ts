export interface MasterData {
  clients: string[];
  vehicles: string[];
  drivers: string[];
  kraStatuses: string[];
  kebsStatuses: string[];
  clearanceStatuses: string[];
  deliveryStatuses: string[];
}

export interface ClearingAgencyItem {
  containerNo: string; // Key, PK
  client: string;
  entryNumber: string;
  kraStatus: string;
  kebsStatus: string;
  clearanceStatus: string;
  releaseDate: string; // YYYY-MM-DD
  agencyRevenue: number;
  agencyCost: number;
  // agencyProfit is calculated block: agencyRevenue - agencyCost
}

export interface FleetOperationsItem {
  dispatchId: string; // PK
  containerNo: string; // FK to ClearingAgencyItem
  vehiclePlate: string;
  driverName: string;
  dispatchDate: string;
  fuelCost: number;
  tripExpense: number;
  freightRevenue: number;
  deliveryStatus: string;
  deliveryDate: string;
}

export interface ConsolidationRow {
  containerNo: string;
  clientName: string;
  clearanceStatus: string;
  deliveryStatus: string;
  overallStatus: string; // Logic built: if clearanceStatus !== 'Released' then 'Customs Clearing', etc.
  clearanceProfit: number;
  fleetProfit: number;
  totalProfit: number;
}

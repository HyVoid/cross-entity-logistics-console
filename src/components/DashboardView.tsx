import React from 'react';
import { ClearingAgencyItem, FleetOperationsItem } from '../types';
import { Ship, Truck, Coins, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface DashboardProps {
  clearanceItems: ClearingAgencyItem[];
  fleetItems: FleetOperationsItem[];
}

export default function DashboardView({ clearanceItems, fleetItems }: DashboardProps) {
  // Step 1: Calculate Consolidated statistics
  // Group by Container Number
  const containerKeys = Array.from(new Set([
    ...clearanceItems.map(c => c.containerNo),
    ...fleetItems.map(f => f.containerNo)
  ])).filter(Boolean);

  let totalClearanceProfitSum = 0;
  let totalFleetProfitSum = 0;
  let consolidatedTotalProfitSum = 0;

  const containerProfitMap = containerKeys.reduce((acc, cNo) => {
    // Clearance Profit
    const clearance = clearanceItems.find(c => c.containerNo === cNo);
    const clearanceProfit = clearance ? (clearance.agencyRevenue - clearance.agencyCost) : 0;

    // Fleet Profit
    const matchingDispatches = fleetItems.filter(f => f.containerNo === cNo);
    const fleetRevenue = matchingDispatches.reduce((sum, f) => sum + f.freightRevenue, 0);
    const fleetCost = matchingDispatches.reduce((sum, f) => sum + f.fuelCost + f.tripExpense, 0);
    const fleetProfit = fleetRevenue - fleetCost;

    const totalProfit = clearanceProfit + fleetProfit;

    totalClearanceProfitSum += clearanceProfit;
    totalFleetProfitSum += fleetProfit;
    consolidatedTotalProfitSum += totalProfit;

    acc[cNo] = {
      client: clearance?.client || (matchingDispatches[0]?.driverName ? "Unmapped Client" : "Unknown"),
      clearanceStatus: clearance?.clearanceStatus || "Pending",
      deliveryStatus: matchingDispatches[0]?.deliveryStatus || "No Dispatch",
      clearanceProfit,
      fleetProfit,
      totalProfit
    };
    return acc;
  }, {} as Record<string, { client: string, clearanceStatus: string, deliveryStatus: string, clearanceProfit: number, fleetProfit: number, totalProfit: number }>);

  const containerCount = containerKeys.length;
  const averageProfitPerContainer = containerCount > 0 ? (consolidatedTotalProfitSum / containerCount) : 0;

  // Step 2: Funnel Statistics
  // 1) In transit: Clearance is Released, Fleet Delivery is 'In Transit'
  const inTransitCount = Object.values(containerProfitMap).filter(v => 
    v.clearanceStatus === "Released" && v.deliveryStatus === "In Transit"
  ).length;

  // 2) Pending Dispatch: Clearance is Released, but Fleet Delivery is 'No Dispatch' or 'Pending Dispatch'
  const pendingDispatchCount = Object.values(containerProfitMap).filter(v => 
    v.clearanceStatus === "Released" && (v.deliveryStatus === "No Dispatch" || v.deliveryStatus === "Pending Dispatch")
  ).length;

  // 3) Cleared / Completed Deliveries
  const completedCount = Object.values(containerProfitMap).filter(v => 
    v.deliveryStatus === "Delivered"
  ).length;

  // 4) Under Customs Clearance (Clearance Status not Released yet)
  const clearingCount = Object.values(containerProfitMap).filter(v => 
    v.clearanceStatus !== "Released"
  ).length;

  // Step 3: Breakdown calculations
  // 1) Customer Contribution
  const clientSummary: Record<string, number> = {};
  Object.values(containerProfitMap).forEach(v => {
    if (v.client) {
      clientSummary[v.client] = (clientSummary[v.client] || 0) + v.totalProfit;
    }
  });
  const clientBreakdown = Object.entries(clientSummary)
    .map(([client, profit]) => ({ client, profit }))
    .sort((a, b) => b.profit - a.profit);

  const maxClientProfit = clientBreakdown.length > 0 ? Math.max(...clientBreakdown.map(c => Math.abs(c.profit))) : 1;

  // 2) Vehicle Cumulative Margin
  const vehicleSummary: Record<string, number> = {};
  fleetItems.forEach(f => {
    if (f.vehiclePlate) {
      const margin = f.freightRevenue - (f.fuelCost + f.tripExpense);
      vehicleSummary[f.vehiclePlate] = (vehicleSummary[f.vehiclePlate] || 0) + margin;
    }
  });
  const vehicleBreakdown = Object.entries(vehicleSummary)
    .map(([vehicle, profit]) => ({ vehicle, profit }))
    .sort((a, b) => b.profit - a.profit);

  const maxVehicleProfit = vehicleBreakdown.length > 0 ? Math.max(...vehicleBreakdown.map(v => Math.abs(v.profit))) : 1;

  // Step 4: Formatting utility
  const formatKES = (value: number) => {
    const isNeg = value < 0;
    return `${isNeg ? '-' : ''}KES ${Math.abs(Math.round(value)).toLocaleString('en-US')}`;
  };

  // Step 5: High-value active business insights (recommendations)
  const generateInsights = () => {
    const alerts: string[] = [];
    if (pendingDispatchCount > 0) {
      alerts.push(`There are ${pendingDispatchCount} container(s) released (Released) from customs but not yet dispatched. Please urge the fleet scheduler to coordinate vehicles.`);
    }
    if (clearingCount > 0) {
      alerts.push(`Currently, ${clearingCount} container(s) are in the customs clearing process. Please monitor KRA and KEBS approval progress closely to avoid expensive port staging fees.`);
    }
    const negativeProfitContainers = Object.entries(containerProfitMap).filter(([_, v]) => v.totalProfit < 0);
    if (negativeProfitContainers.length > 0) {
      alerts.push(`Risk Alert: Detected ${negativeProfitContainers.length} container(s) operating at a loss (e.g., container ${negativeProfitContainers[0][0]} has a combined profit of ${formatKES(negativeProfitContainers[0][1].totalProfit)}). Review transport fuel consumption and customs clearing fees.`);
    }
    return alerts;
  };

  const activeInsights = generateInsights();

  return (
    <div className="space-y-10 animate-fade-up">
      {/* SECTION 1: Page Header with custom metrics timestamp */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="serif-heading text-4xl mb-1 text-[#051C2C] font-bold">Logistics Operational Console</h1>
          <p className="text-[13px] text-gray-500 font-light">
            Real-time multi-entity logistics consolidation, clearance, and transportation fleet analysis.
          </p>
        </div>
        <div className="flex gap-8 shrink-0">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-widest font-semibold opacity-50 mb-1">Consolidated Volume</div>
            <div className="serif-heading text-3xl text-[#051C2C] font-bold">{containerCount}<span className="text-sm font-sans font-normal opacity-60 ml-1">UNITS</span></div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-widest font-semibold opacity-50 mb-1">Active Pipeline</div>
            <div className="serif-heading text-3xl text-[#2251FF] font-bold">{(clearingCount + pendingDispatchCount + inTransitCount)}<span className="text-sm font-sans font-normal opacity-60 ml-1">ACTIVE</span></div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Highlight KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Group Total Profit */}
        <div className="custom-card p-6 border-b-2 border-r border-gray-100 relative overflow-hidden" id="kpi-group-profit">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Consolidated Net Profit</span>
            <Coins className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="custom-kpi-val text-brand" style={{ color: 'var(--color-primary)' }}>
            {formatKES(consolidatedTotalProfitSum)}
          </div>
          <div className="mt-2 text-xs flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Dual-Entity Consolidated Book</span>
            <span>Target Achieved 100%</span>
          </div>
          {/* Subtle brand bottom edge accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--color-accent)' }}></div>
        </div>

        {/* KPI 2: Total Clearance Profit */}
        <div className="custom-card p-6 border-b-2 border-r border-gray-100 relative overflow-hidden" id="kpi-clearance-profit">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Clearing Agency Income</span>
            <Ship className="w-5 h-5 text-sky-800" />
          </div>
          <div className="custom-kpi-val" style={{ color: 'var(--color-primary)' }}>
            {formatKES(totalClearanceProfitSum)}
          </div>
          <div className="mt-2 text-xs flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Revenue minus filing costs</span>
            <span>Margin Share {(consolidatedTotalProfitSum > 0 ? (totalClearanceProfitSum / consolidatedTotalProfitSum) * 100 : 0).toFixed(0)}%</span>
          </div>
        </div>

        {/* KPI 3: Total Fleet Profit */}
        <div className="custom-card p-6 border-b-2 border-r border-gray-100 relative overflow-hidden" id="kpi-fleet-profit">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Trucking Fleet Income</span>
            <Truck className="w-5 h-5 text-emerald-800" />
          </div>
          <div className="custom-kpi-val" style={{ color: 'var(--color-primary)' }}>
            {formatKES(totalFleetProfitSum)}
          </div>
          <div className="mt-2 text-xs flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Freight minus fuel & road tolls</span>
            <span>Margin Share {(consolidatedTotalProfitSum > 0 ? (totalFleetProfitSum / consolidatedTotalProfitSum) * 100 : 0).toFixed(0)}%</span>
          </div>
        </div>

        {/* KPI 4: Average Profit per Container */}
        <div className="custom-card p-6 border-b-2 border-r border-gray-100 relative overflow-hidden" id="kpi-avg-profit">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Average Unit Margin</span>
            <FileSpreadsheet className="w-5 h-5 text-violet-800" />
          </div>
          <div className="custom-kpi-val" style={{ color: 'var(--color-primary)' }}>
            {formatKES(averageProfitPerContainer)}
          </div>
          <div className="mt-2 text-xs flex justify-between" style={{ color: 'var(--color-muted)' }}>
            <span>Per-Container metric basis</span>
            <span>Sample size: {containerCount} Unit(s)</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Active Business Insight Block */}
      <div className="p-5 rounded-lg border-l-4 shadow-sm" style={{ backgroundColor: 'var(--insight-bg)', borderLeftColor: 'var(--color-accent)' }} id="operational-insights">
        <h3 className="serif-heading text-lg font-semibold mb-3 flex items-center gap-2 text-[#051C2C]">
          <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          System Operational Insights & Risks (Operational Funnel & Alerts)
        </h3>
        {activeInsights.length === 0 ? (
          <p className="text-sm font-light text-gray-600">
            ✓ All logistics processes are safe and clear. No port blockage, customs delays, or combined business losses detected.
          </p>
        ) : (
          <ul className="space-y-2">
            {activeInsights.map((insight, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-accent)' }}></span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SECTION 4: Dual Layout charts / grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Client Contributions and Operational Funnel (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer profit bar block */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100" id="client-breakdown-card">
            <h3 className="serif-heading mb-6 flex justify-between items-center text-base font-semibold tracking-tight text-[#051C2C]">
              <span>Key Client Profit Contribution (Client Value Contribution)</span>
              <span className="text-xs font-normal font-sans" style={{ color: 'var(--color-muted)' }}>Sorted by consolidated net profit</span>
            </h3>
            
            {clientBreakdown.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No matched records found. Please enter containers of clients inside operational views.</p>
            ) : (
              <div className="space-y-5">
                {clientBreakdown.map((item, idx) => {
                  const percentage = Math.round((Math.abs(item.profit) / maxClientProfit) * 100) || 1;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-700">{item.client}</span>
                        <span className="font-mono font-semibold" style={{ color: item.profit < 0 ? 'var(--color-negative)' : 'var(--color-primary)' }}>
                          {formatKES(item.profit)}
                        </span>
                      </div>
                      
                      {/* Magnitude Data bar */}
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(5, 28, 44, 0.05)' }}>
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: item.profit < 0 ? 'var(--color-negative)' : 'var(--color-accent)' 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Operational Funnel and stats */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100" id="operational-funnel-card">
            <h3 className="serif-heading mb-6 text-base font-semibold tracking-tight text-[#051C2C]">
              Cargo Container Operational Pipeline (Operational Phase Funnel)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-2xl font-bold font-heading text-slate-800">{clearingCount}</div>
                <div className="text-[11px] font-sans text-gray-500 uppercase tracking-wider mt-1">Customs Clearing</div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-2xl font-bold font-heading text-indigo-800">{pendingDispatchCount}</div>
                <div className="text-[11px] font-sans text-gray-500 uppercase tracking-wider mt-1">Pending Vehicle</div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-2xl font-bold font-heading text-blue-800">{inTransitCount}</div>
                <div className="text-[11px] font-sans text-gray-500 uppercase tracking-wider mt-1">Fleet In Transit</div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-2xl font-bold font-heading text-emerald-800">{completedCount}</div>
                <div className="text-[11px] font-sans text-gray-500 uppercase tracking-wider mt-1">Delivered Securely</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-50 rounded text-[11px] text-gray-500 leading-relaxed text-center font-light">
              Once a container's clearance is marked Released, it is sent to the Pending Dispatch pipeline. After the shipping fleet completes delivery (Delivered), the system validates it as Delivered Securely.
            </div>
          </div>

        </div>

        {/* Right Column: Fleet Vehicle Profitability (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 h-full" id="vehicle-profitability-card">
            <h3 className="serif-heading mb-6 flex justify-between items-center text-base font-semibold tracking-tight text-[#051C2C]">
              <span>Heavy Truck Cumulative Net Margin (Vehicle Cumulative Profit)</span>
              <span className="text-xs font-normal font-sans" style={{ color: 'var(--color-muted)' }}>Financial Net</span>
            </h3>

            {vehicleBreakdown.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No fleet scheduling or dispatch data found. Log carrier dispatch entries first.</p>
            ) : (
              <div className="space-y-6">
                {vehicleBreakdown.map((item, idx) => {
                  const percentage = Math.round((Math.abs(item.profit) / maxVehicleProfit) * 100) || 1;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
                            PLATE
                          </span>
                          <span className="font-semibold text-gray-700">{item.vehicle}</span>
                        </div>
                        <span className="font-mono font-semibold" style={{ color: item.profit < 0 ? 'var(--color-negative)' : 'var(--color-accent)' }}>
                          {formatKES(item.profit)}
                        </span>
                      </div>

                      {/* Magnitude Data bar */}
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(5, 28, 44, 0.05)' }}>
                        <div 
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: item.profit < 0 ? 'var(--color-negative)' : 'var(--color-accent)' 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ClearingAgencyItem, FleetOperationsItem, ConsolidationRow } from '../types';
import { ShieldAlert, AlertTriangle, Lock, Search } from 'lucide-react';

interface ConsolidationEngineProps {
  clearanceItems: ClearingAgencyItem[];
  fleetItems: FleetOperationsItem[];
}

export default function ConsolidationEngineView({ clearanceItems, fleetItems }: ConsolidationEngineProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Fixed simulated current date for East Africa operations checking (matches metadata 2026-06-21)
  const simulatedCurrentDate = new Date("2026-06-21");

  // Retrieve distinct container numbers from clearance tab (primary master controller)
  const containerKeys = Array.from(new Set(clearanceItems.map(c => c.containerNo))).filter(Boolean);

  // Generate formula-driven consolidated rows
  const consolidatedRows: (ConsolidationRow & { 
    releaseDate: string, 
    daysDelayed: number,
    hasAgeAlert: boolean
  })[] = containerKeys.map(cNo => {
    // 1) XLOOKUP for Clearance details
    const clearance = clearanceItems.find(c => c.containerNo === cNo);
    const clientName = clearance ? clearance.client : 'Unmatched';
    const clearanceStatus = clearance ? clearance.clearanceStatus : 'Pending';
    const releaseDate = clearance ? clearance.releaseDate : '';

    // 2) SUMIFS for Fleet Operations
    const matchingTransports = fleetItems.filter(f => f.containerNo === cNo);
    const hasDispatchObj = matchingTransports.length > 0;
    
    // If there is no dispatched truck, delivery status defaults to 'No Dispatch'
    const deliveryStatus = hasDispatchObj ? matchingTransports[0].deliveryStatus : 'No Dispatch';

    // 3) Calculate overall logic status:
    // If clearance status not Released, overall status is 'Clearing'. 
    // If released, but deliveryStatus is 'No Dispatch', overall status is 'Pending Delivery'. 
    // Otherwise match active fleet transport deliveryStatus.
    let overallStatus = 'Clearing';
    if (clearanceStatus === 'Released') {
      if (deliveryStatus === 'No Dispatch' || deliveryStatus === 'Pending Dispatch') {
        overallStatus = 'Pending Delivery';
      } else {
        overallStatus = deliveryStatus;
      }
    }

    // 4) Calculated profits
    const clearanceProfit = clearance ? (clearance.agencyRevenue - clearance.agencyCost) : 0;
    
    const fleetRevenueSum = matchingTransports.reduce((sum, f) => sum + f.freightRevenue, 0);
    const fleetCostSum = matchingTransports.reduce((sum, f) => sum + f.fuelCost + f.tripExpense, 0);
    const fleetProfit = fleetRevenueSum - fleetCostSum;

    const totalProfit = clearanceProfit + fleetProfit;

    // 5) Age latency warning check: 
    // If clearance released over 3 days, but delivery status is still 'No Dispatch' or 'Pending Dispatch'
    let daysDelayed = 0;
    let hasAgeAlert = false;
    if (clearanceStatus === 'Released' && releaseDate && (deliveryStatus === 'No Dispatch' || deliveryStatus === 'Pending Dispatch')) {
      const rDate = new Date(releaseDate);
      if (!isNaN(rDate.getTime())) {
        const diffTime = simulatedCurrentDate.getTime() - rDate.getTime();
        daysDelayed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (daysDelayed > 3) {
          hasAgeAlert = true;
        }
      }
    }

    return {
      containerNo: cNo,
      clientName,
      clearanceStatus,
      deliveryStatus,
      overallStatus,
      clearanceProfit,
      fleetProfit,
      totalProfit,
      releaseDate,
      daysDelayed,
      hasAgeAlert
    };
  });

  // Filter keys matching search term
  const filteredRows = consolidatedRows.filter(row => 
    row.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.overallStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatKES = (val: number) => {
    const isNeg = val < 0;
    return `${isNeg ? '-' : ''}KES ${Math.abs(Math.round(val)).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="serif-heading text-4xl mb-1 text-[#051C2C] font-bold">04_Consolidation_Engine</h1>
          <p className="text-[13px] text-gray-500 font-light">
            Automated reconciliation ledger matching clearances to deliveries with dual-entity revenue-cost transparency.
          </p>
        </div>

        {/* Lock indicator */}
        <div className="px-3 py-1.5 bg-slate-900 text-white rounded-md flex items-center gap-1.5 shadow-sm text-xs border border-slate-800 shrink-0 select-none">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sans font-medium tracking-wide">Workbook Formulas ACTIVE · READ-ONLY</span>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 max-w-md" id="consolidation-filter-box">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full text-xs border border-gray-200 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-blue-600"
            placeholder="Search container ID, client name, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden" id="consolidation-table-box">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1250px]">
            {/* Table Head */}
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)', borderBottom: '2px solid var(--table-header-sep)' }}>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[150px]">Container # (Key)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[200px]">Importer Entity</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[145px]">Clearance Status (Agency)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[145px]">Inland Transit Status (Fleet)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[145px]">Composite Status Indicator</th>
                <th className="custom-table-header px-4 py-3 text-xs text-right text-gray-700 w-[150px]">Agency Margin (A)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-right text-gray-700 w-[150px]">Fleet Margin (B)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-right text-gray-700 w-[165px]">Composite Net Income (A+B)</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-gray-400 font-light">
                    No matching consolidated records found. Please ensure port containers are logged in 02_Clearing_Agency.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  // Determine anomalous states
                  const isLoss = row.totalProfit < 0;
                  const isDelayedAge = row.hasAgeAlert;
                  
                  // Row background matching the visual requirements:
                  let rowBg = '';
                  let borderStyle = 'var(--color-border)';
                  let tooltip = '';

                  if (isLoss) {
                    rowBg = 'var(--anomaly-bg)'; // Light red highlight for losses
                    tooltip = 'Accumulated Net Loss Warning';
                  } else if (isDelayedAge) {
                    rowBg = 'var(--color-input-bg)'; // Light yellow for 3+ day delayed dispatches
                    tooltip = `Port Dispatch Latency Warning (Released ${row.daysDelayed} days ago, pending fleet dispatch)`;
                  }

                  return (
                    <tr 
                      key={idx}
                      className="border-b transition-all group relative border-gray-100"
                      style={{ 
                        backgroundColor: rowBg || '',
                        borderBottomColor: borderStyle
                      }}
                    >
                      {/* Container No (Key) */}
                      <td className="px-4 py-3 font-mono font-bold text-xs text-gray-700 flex items-center gap-1.5">
                        {row.containerNo}
                        {isLoss && <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-bounce shrink-0" title="Loss Warning" />}
                        {isDelayedAge && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" title={tooltip} />}
                      </td>

                      {/* Client (LOOKUP) */}
                      <td className="px-4 py-3 text-xs truncate text-gray-600">
                        {row.clientName}
                      </td>

                      {/* Clearance status (LOOKUP) */}
                      <td className="px-4 py-3 text-xs font-medium">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          row.clearanceStatus === 'Released' 
                            ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 font-light border border-amber-200'
                        }`}>
                          {row.clearanceStatus}
                        </span>
                      </td>

                      {/* Delivery status (LOOKUP) */}
                      <td className="px-4 py-3 text-xs font-medium">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          row.deliveryStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                            : row.deliveryStatus === 'No Dispatch'
                              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200'
                              : 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                        }`}>
                          {row.deliveryStatus}
                        </span>
                      </td>

                      {/* Overall logical status calculation */}
                      <td className="px-4 py-3 text-xs font-semibold">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                          row.overallStatus === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : row.overallStatus === 'Pending Delivery' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-800'
                        }`}>
                          {row.overallStatus}
                        </span>
                      </td>

                      {/* Clearance Profit (Lookup) */}
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                        {formatKES(row.clearanceProfit)}
                      </td>

                      {/* Fleet operations profit (SUMIFS calculated) */}
                      <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                        {formatKES(row.fleetProfit)}
                      </td>

                      {/* Consolidated aggregate profit margin */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-xs">
                        <span style={{ color: isLoss ? 'var(--color-negative)' : 'var(--color-accent)' }}>
                          {formatKES(row.totalProfit)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warnings & Help legends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Loss Legend */}
        <div className="p-4 bg-red-50 rounded-lg flex gap-3 text-xs text-rose-900 border border-rose-200 font-light leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold text-rose-950 font-heading">【Marginal Combined Loss Protection】</h5>
            <p>When a container's combined net margin (Customs Clearing Fee minus Agency Cost, added to Inland Fleet profit margin) is negative, the row automatically flags deep soft-red <code>(var(--anomaly-bg))</code>, prompting managers to review carrier expenses, excess tolls, or middleman fees.</p>
          </div>
        </div>

        {/* Delay Legend */}
        <div className="p-4 bg-amber-50 rounded-lg flex gap-3 text-xs text-amber-900 border border-amber-200 font-light leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold text-amber-950 font-heading">【Port Dispatch Latency Alarm】</h5>
            <p>If the customs release date (Release Date) exceeds 3 operational days, but the trucking fleet indicates no active dispatch, the row highlights soft-yellow warning, alerting supervisors to schedule carriers immediately to prevent expensive port holding demurrages.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

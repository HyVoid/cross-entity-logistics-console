import React from 'react';
import { Database, ShieldCheck, Layers, HelpCircle, PlayCircle } from 'lucide-react';

export default function UserGuideView() {
  return (
    <div className="space-y-8 animate-fade-up max-w-5xl">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="serif-heading text-4xl mb-1 text-[#051C2C] font-bold">User Guide & Description</h1>
        <p className="text-[13px] text-gray-500 font-light">
          Comprehensive documentation of structural variables, cascading formulas, and browser local storage configurations.
        </p>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Core Logic Rules */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 space-y-4">
          <h3 className="custom-section-title text-base flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-indigo-700" />
            Cascading Calculation Rules
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            The console connects two separate profit centers (Customs Clearing Agency and Fleet Transportation) using a unique primary key: the <strong>Container Number</strong>.
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-md border-l-2 border-slate-400 text-xs text-gray-700 space-y-1">
              <span className="font-semibold text-slate-900 block">【Formula I】Clearing Agency Margin</span>
              <code className="text-blue-700 block font-mono">Profit = Clearing Revenue - Clearing Cost</code>
              <span className="text-gray-500 text-[10px]">When a row is added or edited in [02_Clearing_Agency], margins are calculated instantly.</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border-l-2 border-slate-400 text-xs text-gray-700 space-y-1">
              <span className="font-semibold text-slate-900 block">【Formula II】Fleet Transport Profit</span>
              <code className="text-blue-700 block font-mono">Profit = Freight Revenue - Fuel Cost - Trip Expense</code>
              <span className="text-gray-500 text-[10px]">Managed via trucks fuel & toll expenses inside [03_Fleet_Operations]; supports multi-trip aggregation.</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border-l-2 border-slate-400 text-xs text-gray-700 space-y-1">
              <span className="font-semibold text-slate-900 block">【Formula III】Consolidated Revenue</span>
              <code className="text-blue-700 block font-mono">Total Profit = Clearance Profit + Fleet Profit</code>
              <span className="text-gray-500 text-[10px]">Automatically aggregates both clearing agency outcomes and fleet transport outcomes across matching container keys in [04_Consolidation_Engine].</span>
            </div>
          </div>
        </div>

        {/* Operating Guide Steps */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 space-y-4">
          <h3 className="custom-section-title text-base flex items-center gap-2 mb-2">
            <PlayCircle className="w-5 h-5 text-emerald-700" />
            Standard Operating Procedure Steps
          </h3>
          
          <ol className="relative border-l border-gray-100 space-y-5 text-xs text-gray-600 font-light pl-4 ml-2">
            <li className="relative">
              <span className="absolute -left-[21px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-[9px] text-white font-bold select-none">
                1
              </span>
              <div className="space-y-1">
                <span className="font-semibold text-gray-800">Maintain Constant Master Data</span>
                <p>Navigate to <code>01_Master_Data</code> to input your client entities registry, heavy truck license plates list, registered drivers registry, and active business status options dictionary.</p>
              </div>
            </li>

            <li className="relative">
              <span className="absolute -left-[21px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-[9px] text-white font-bold select-none">
                2
              </span>
              <div className="space-y-1">
                <span className="font-semibold text-gray-800">Register Port Containers</span>
                <p>Use <code>02_Clearing_Agency</code> to log arriving shipping containers (e.g., MSKU9280145) alongside Customs Entry document numbers, linking them to clients, KRA tax status and KEBS inspection statuses.</p>
              </div>
            </li>

            <li className="relative">
              <span className="absolute -left-[21px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-[9px] text-white font-bold select-none">
                3
              </span>
              <div className="space-y-1">
                <span className="font-semibold text-gray-800">Dispatch Fleet Vehicles</span>
                <p>Go to <code>03_Fleet_Operations</code> to allocate heavy haul trucks. Automatically bind cargo containers released from the port, logging transit dates, fuel spend, and road toll expenses.</p>
              </div>
            </li>

            <li className="relative">
              <span className="absolute -left-[21px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-[9px] text-white font-bold select-none">
                4
              </span>
              <div className="space-y-1">
                <span className="font-semibold text-gray-800">Monitor Consolidated Books & Decisions</span>
                <p>Go to <code>04_Consolidation_Engine</code> to spot shipping container margins, track yellow "Port Latency" delays and deep-red "Net Margin Loss" rows. Reach your operational decisions here, summarized visually on <code>00_Dashboard</code>.</p>
              </div>
            </li>
          </ol>
        </div>

      </div>

      {/* Persistence and security lockouts */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 space-y-4">
        <h3 className="custom-section-title text-base flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-700" />
          Data Persistence & Secure Backup Mechanism
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 font-light">
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-800 block">Automatic Local Storage Persistence</span>
            <p className="leading-relaxed">All ledger updates and records are automatically serialized and saved to your browser's local cache storage within <strong>50ms</strong>. Input data persists across power shutdowns, page reloads, and closed browser tabs.</p>
          </div>

          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-800 block">Export Ledger Databases</span>
            <p className="leading-relaxed">Clicking the <strong>Export Backup</strong> action downloads a complete diagnostic JSON document containing all master tables, customs agency records, and transport dispatches for archiving or transferring devices.</p>
          </div>

          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-800 block">Hassle-Free Restoration & Data Reset</span>
            <p className="leading-relaxed">To replicate accounts across other screens, trigger <strong>Import</strong> to restore your files. Tap the <strong>Reset Database</strong> action to instantly revert accounts back to default East African clearing and heavy truck dispatch simulations.</p>
          </div>
        </div>
      </div>

      {/* Safety Compliance Certification */}
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex gap-3 text-xs text-emerald-900 font-light">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-semibold text-emerald-950 font-heading text-sm">Algebraic Mathematical Integrity Assurance</h5>
          <p className="mt-1 leading-relaxed">
            The calculations operating within this Consolidation Engine are parsed natively by hardcoded browser engines, fully locked away from direct manual formula tinkering or drag mistakes common in traditional spreadsheet models. This prevents financial discrepancies, tax report slip-ups, and balance leaks.
          </p>
        </div>
      </div>
    </div>
  );
}

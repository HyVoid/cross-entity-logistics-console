import React, { useState, useEffect, useRef } from 'react';
import { MasterData, ClearingAgencyItem, FleetOperationsItem } from './types';
import { 
  DEFAULT_MASTER_DATA, 
  DEFAULT_CLEARING_AGENCY, 
  DEFAULT_FLEET_OPERATIONS 
} from './defaultData';
import { safeLocalStorage, safeConfirm, safeAlert } from './utils/safeWindow';

// import Components
import DashboardView from './components/DashboardView';
import MasterDataView from './components/MasterDataView';
import ClearingAgencyView from './components/ClearingAgencyView';
import FleetOperationsView from './components/FleetOperationsView';
import ConsolidationEngineView from './components/ConsolidationEngineView';
import UserGuideView from './components/UserGuideView';

// import Icons
import { 
  LayoutDashboard, 
  Settings, 
  Ship, 
  Truck, 
  Layers, 
  HelpCircle, 
  Download, 
  Upload, 
  RotateCcw,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

type ActiveTab = '00_Dashboard' | '01_Master_Data' | '02_Clearing_Agency' | '03_Fleet_Operations' | '04_Consolidation_Engine' | '05_User_Guide';

export default function App() {
  // ────────────────────────────────────────────────────────
  // 1. STATE INITIALIZATION & LOCALSTORAGE AUTO-LOAD
  // ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('00_Dashboard');
  const [lastSaved, setLastSaved] = useState<string>('');
  
  const [masterData, setMasterData] = useState<MasterData>(() => {
    try {
      const saved = safeLocalStorage.getItem('LOGISTICS_MASTER_DATA');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.clients) && Array.isArray(parsed.vehicles) && Array.isArray(parsed.drivers)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse master data from localStorage:", e);
    }
    return DEFAULT_MASTER_DATA;
  });

  const [clearanceItems, setClearanceItems] = useState<ClearingAgencyItem[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('LOGISTICS_CLEARANCE_ITEMS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse clearance items from localStorage:", e);
    }
    return DEFAULT_CLEARING_AGENCY;
  });

  const [fleetItems, setFleetItems] = useState<FleetOperationsItem[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('LOGISTICS_FLEET_ITEMS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse fleet items from localStorage:", e);
    }
    return DEFAULT_FLEET_OPERATIONS;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time formatting helper
  const getFormattedDateTime = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ` +
           `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  // Safe initialize timestamp
  useEffect(() => {
    const savedTime = safeLocalStorage.getItem('LOGISTICS_LAST_SAVED');
    if (savedTime) {
      setLastSaved(savedTime);
    } else {
      const now = getFormattedDateTime();
      setLastSaved(now);
      safeLocalStorage.setItem('LOGISTICS_LAST_SAVED', now);
    }
  }, []);

  // ────────────────────────────────────────────────────────
  // 2. AUTO-SAVE MECHANISM
  // ────────────────────────────────────────────────────────
  useEffect(() => {
    safeLocalStorage.setItem('LOGISTICS_MASTER_DATA', JSON.stringify(masterData));
    const now = getFormattedDateTime();
    setLastSaved(now);
    safeLocalStorage.setItem('LOGISTICS_LAST_SAVED', now);
  }, [masterData]);

  useEffect(() => {
    safeLocalStorage.setItem('LOGISTICS_CLEARANCE_ITEMS', JSON.stringify(clearanceItems));
    const now = getFormattedDateTime();
    setLastSaved(now);
    safeLocalStorage.setItem('LOGISTICS_LAST_SAVED', now);
  }, [clearanceItems]);

  useEffect(() => {
    safeLocalStorage.setItem('LOGISTICS_FLEET_ITEMS', JSON.stringify(fleetItems));
    const now = getFormattedDateTime();
    setLastSaved(now);
    safeLocalStorage.setItem('LOGISTICS_LAST_SAVED', now);
  }, [fleetItems]);

  // ────────────────────────────────────────────────────────
  // 3. EXPORT, IMPORT, AND RESET BACKUP LOGICS
  // ────────────────────────────────────────────────────────
  
  // Export backup download as a unified JSON payload
  const handleExportBackup = () => {
    const payload = {
      version: '1.0',
      exportedAt: getFormattedDateTime(),
      masterData,
      clearanceItems,
      fleetItems
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Logistics_Console_Backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import file triggered via hidden input
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.masterData || !parsed.clearanceItems || !parsed.fleetItems) {
          safeAlert('Import failed: The backup file is missing critical data sections (masterData, clearanceItems, or fleetItems)!');
          return;
        }

        // Apply backup states loaded
        setMasterData(parsed.masterData);
        setClearanceItems(parsed.clearanceItems);
        setFleetItems(parsed.fleetItems);

        const now = getFormattedDateTime();
        setLastSaved(now);
        safeLocalStorage.setItem('LOGISTICS_LAST_SAVED', now);

        safeAlert(`Backup loaded successfully! Restored system records exported at ${parsed.exportedAt || 'unknown time'}.`);
      } catch (err) {
        safeAlert('Import failed: JSON syntax parsing error. Please select a valid console backup file.');
      }
    };
    reader.readAsText(file);
    
    // Clear value to allow re-upload same file
    if (e.target) {
      e.target.value = '';
    }
  };

  // Reset to initial clean values
  const handleResetData = () => {
    const confirmReset = safeConfirm('⚠ Warning: This will erase all current browser data records and reset to the default East Africa maritime clearing and fleet freight samples. This action cannot be undone. Do you wish to proceed?');
    if (confirmReset) {
      setMasterData(DEFAULT_MASTER_DATA);
      setClearanceItems(DEFAULT_CLEARING_AGENCY);
      setFleetItems(DEFAULT_FLEET_OPERATIONS);
      
      const now = getFormattedDateTime();
      setLastSaved(now);
      safeLocalStorage.setItem('LOGISTICS_LAST_SAVED', now);
      
      safeAlert('Database reset completed successfully.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-family" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* ────────────────────────────────────────────────────────
          §1 LIGHT STICKY HEADER (56px Height, border-bottom)
          ──────────────────────────────────────────────────────── */}
      <header 
        className="sticky top-0 z-50 bg-white border-b px-10 flex items-center justify-between transition-all" 
        style={{ 
          height: 'var(--nav-height)', 
          borderColor: 'var(--color-border)', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
        }}
      >
        {/* Left segment: Logo, Brand Text */}
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#051C2C] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <span className="font-bold tracking-tight text-lg" style={{ color: 'var(--color-primary)' }}>
              FINCORE<span className="font-light opacity-50">.io</span>
            </span>
          </div>

          {/* Navigation Tab strip */}
          <nav className="hidden lg:flex items-center h-full gap-6">
            <button
              onClick={() => setActiveTab('00_Dashboard')}
              className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 gap-1.5 cursor-pointer ${
                activeTab === '00_Dashboard' 
                  ? 'border-[#2251FF] text-[#2251FF] font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('01_Master_Data')}
              className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 gap-1.5 cursor-pointer ${
                activeTab === '01_Master_Data' 
                  ? 'border-[#2251FF] text-[#2251FF] font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>01_Master_Data</span>
            </button>

            <button
              onClick={() => setActiveTab('02_Clearing_Agency')}
              className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 gap-1.5 cursor-pointer ${
                activeTab === '02_Clearing_Agency' 
                  ? 'border-[#2251FF] text-[#2251FF] font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-slate-800'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>02_Clearing_Agency</span>
            </button>

            <button
              onClick={() => setActiveTab('03_Fleet_Operations')}
              className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 gap-1.5 cursor-pointer ${
                activeTab === '03_Fleet_Operations' 
                  ? 'border-[#2251FF] text-[#2251FF] font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>03_Fleet_Operations</span>
            </button>

            <button
              onClick={() => setActiveTab('04_Consolidation_Engine')}
              className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 gap-1.5 cursor-pointer ${
                activeTab === '04_Consolidation_Engine' 
                  ? 'border-[#2251FF] text-[#2251FF] font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>04_Consolidation_Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('05_User_Guide')}
              className={`h-full flex items-center text-[13px] font-medium transition-all border-b-2 gap-1.5 cursor-pointer ${
                activeTab === '05_User_Guide' 
                  ? 'border-[#2251FF] text-[#2251FF] font-semibold' 
                  : 'border-transparent text-gray-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>05_User_Guide</span>
            </button>
          </nav>
        </div>

        {/* Right segment: Workbook controls */}
        <div className="flex items-center gap-6">
          {/* Backup Actions / Saving State indicator */}
          <div className="flex items-center gap-4">
            {/* Last Saved Text */}
            <div className="hidden md:flex flex-col text-right pr-2">
              <span className="text-[10px] text-gray-400 font-light select-none">Automated Sync Enabled</span>
              <span className="text-[11px] font-mono text-gray-500 font-semibold">Last saved: {lastSaved}</span>
            </div>

            {/* Actions toolbar */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportBackup}
                className="text-[13px] font-medium px-4 py-1.5 rounded bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="导出备份 (Export payload)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Backup</span>
              </button>
              <button
                onClick={handleImportClick}
                className="text-[13px] font-medium px-4 py-1.5 rounded text-white bg-[#051C2C] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                title="导入备份 (Import payload)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={handleResetData}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                title="系统重置 (Reset database)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              {/* Hidden Import file picker trigger */}
              <input 
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleImportFileChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE Navigation tabs drawer drawer */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between overflow-x-auto gap-4 select-none">
        <select 
          className="text-xs font-semibold text-gray-700 bg-slate-50 border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as ActiveTab)}
        >
          <option value="00_Dashboard">00_Dashboard (Dashboard Panel)</option>
          <option value="01_Master_Data">01_Master_Data (Master Data Registry)</option>
          <option value="02_Clearing_Agency">02_Clearing_Agency (Customs Clearing Log)</option>
          <option value="03_Fleet_Operations">03_Fleet_Operations (Fleet Dispatch & Transports)</option>
          <option value="04_Consolidation_Engine">04_Consolidation_Engine (Consolidated Books)</option>
          <option value="05_User_Guide">05_User_Guide (Help & Operational Guide)</option>
        </select>
        <span className="text-[10px] font-mono text-gray-400 font-medium shrink-0">
          Saved: {lastSaved.split(' ')?.[1] || lastSaved}
        </span>
      </div>

      {/* ────────────────────────────────────────────────────────
          §2 MAIN CONTENT BODY (Centered in max-width 1400px container, with 40px margin)
          ──────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-10 py-10">
        
        {/* Render views dynamically based on Selected tab */}
        {activeTab === '00_Dashboard' && (
          <DashboardView 
            clearanceItems={clearanceItems}
            fleetItems={fleetItems}
          />
        )}

        {activeTab === '01_Master_Data' && (
          <MasterDataView
            data={masterData}
            onChange={setMasterData}
          />
        )}

        {activeTab === '02_Clearing_Agency' && (
          <ClearingAgencyView
            items={clearanceItems}
            masterData={masterData}
            onChange={setClearanceItems}
          />
        )}

        {activeTab === '03_Fleet_Operations' && (
          <FleetOperationsView
            items={fleetItems}
            clearanceItems={clearanceItems}
            masterData={masterData}
            onChange={setFleetItems}
          />
        )}

        {activeTab === '04_Consolidation_Engine' && (
          <ConsolidationEngineView
            clearanceItems={clearanceItems}
            fleetItems={fleetItems}
          />
        )}

        {activeTab === '05_User_Guide' && (
          <UserGuideView />
        )}

      </main>

      {/* Footer copyright */}
      <footer className="bg-slate-900 text-slate-500 py-6 text-center text-xs font-light border-t border-slate-800 mt-12">
        <p>© 2026 Consolidated Logistics SaaS Platform. All Rights Authorized. Formulas are secured under Excel protection criteria.</p>
      </footer>
    </div>
  );
}

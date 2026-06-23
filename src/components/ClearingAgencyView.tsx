import React, { useState } from 'react';
import { ClearingAgencyItem, MasterData } from '../types';
import { PlusCircle, Trash2, Search, Ship, Filter, AlertCircle } from 'lucide-react';
import { safeConfirm } from '../utils/safeWindow';

interface ClearingAgencyProps {
  items: ClearingAgencyItem[];
  masterData: MasterData;
  onChange: (newItems: ClearingAgencyItem[]) => void;
}

export default function ClearingAgencyView({ items, masterData, onChange }: ClearingAgencyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('ALL');
  
  // New element form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContainer, setNewContainer] = useState<ClearingAgencyItem>({
    containerNo: '',
    client: (masterData?.clients && masterData.clients[0]) || '',
    entryNumber: '',
    kraStatus: (masterData?.kraStatuses && masterData.kraStatuses[0]) || 'Pending',
    kebsStatus: (masterData?.kebsStatuses && masterData.kebsStatuses[0]) || 'Pending',
    clearanceStatus: (masterData?.clearanceStatuses && masterData.clearanceStatuses[0]) || 'Pending',
    releaseDate: '',
    agencyRevenue: 0,
    agencyCost: 0
  });

  const [formError, setFormError] = useState('');

  // Validate format e.g. 4 letters followed by 7 digits, e.g. MSKU1234567
  const validateContainerNo = (cno: string) => {
    return /^[A-Z]{4}\d{7}$/.test(cno.toUpperCase().trim());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedCno = newContainer.containerNo.trim().toUpperCase();
    if (!trimmedCno) {
      setFormError('Please enter the container number!');
      return;
    }

    if (!validateContainerNo(trimmedCno)) {
      setFormError('Invalid container format! Correct format is: 4 uppercase letters + 7 digits, e.g. MSKU9280145');
      return;
    }

    // Check PK duplicate
    if (items.some(item => item.containerNo.toUpperCase() === trimmedCno)) {
      setFormError(`Container number "${trimmedCno}" already exists! Customs primary keys must be unique.`);
      return;
    }

    if (!newContainer.client) {
      setFormError('Please register your first client in 01_Master_Data before creating shipping logs!');
      return;
    }

    const createdItem: ClearingAgencyItem = {
      ...newContainer,
      containerNo: trimmedCno,
      agencyRevenue: Number(newContainer.agencyRevenue) || 0,
      agencyCost: Number(newContainer.agencyCost) || 0
    };

    const updatedItems = [...items, createdItem];
    onChange(updatedItems);

    // Reset Form
    setNewContainer({
      containerNo: '',
      client: masterData.clients[0] || '',
      entryNumber: '',
      kraStatus: masterData.kraStatuses[0] || 'Pending',
      kebsStatus: masterData.kebsStatuses[0] || 'Pending',
      clearanceStatus: masterData.clearanceStatuses[0] || 'Pending',
      releaseDate: '',
      agencyRevenue: 0,
      agencyCost: 0
    });
    setFormError('');
    setShowAddForm(false);
  };

  // Live propagate update inside cell inputs
  const handleUpdateField = (containerNo: string, field: keyof ClearingAgencyItem, value: any) => {
    const originalIndex = items.findIndex(item => item.containerNo === containerNo);
    if (originalIndex === -1) return;

    const updated = [...items];
    let parsedValue = value;
    
    // Numeric parser
    if (field === 'agencyRevenue' || field === 'agencyCost') {
      parsedValue = Number(value) || 0;
    }

    updated[originalIndex] = {
      ...updated[originalIndex],
      [field]: parsedValue
    };
    onChange(updated);
  };

  const handleDelete = (containerNo: string) => {
    const confirmed = safeConfirm(`Are you sure you want to delete the clearing entry for container "${containerNo}"? This will cause the corresponding inland trucking fleet dispatch slips to lose their keys.`);
    if (confirmed) {
      const filtered = items.filter(item => item.containerNo !== containerNo);
      onChange(filtered);
    }
  };

  // Filters logic
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.entryNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = filterClient === 'ALL' || item.client === filterClient;

    return matchesSearch && matchesClient;
  });

  const maxRevenue = items.length > 0 ? Math.max(...items.map(i => i.agencyRevenue)) : 1;

  const formatKES = (val: number) => {
    return `KES ${Math.round(val).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="serif-heading text-4xl mb-1 text-[#051C2C] font-bold">02_Clearing_Agency Registry</h1>
          <p className="text-[13px] text-gray-500 font-light">
            Registry sheet of port arrival containers, customs clearances (KRA/KEBS), and direct agency gross margins.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-sm"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Collapse Form' : 'Register New Port Container'}</span>
        </button>
      </div>

      {/* FORM: Create container */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 animate-fade-up max-w-4xl" id="add-clearing-box">
          <h3 className="font-heading font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Ship className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            Register Customs Clearance (Unique Primary Key Record)
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Container No */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                  Container No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSKU9280145"
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600"
                  style={{ backgroundColor: 'var(--color-input-bg)' }}
                  value={newContainer.containerNo}
                  onChange={(e) => setNewContainer({ ...newContainer, containerNo: e.target.value })}
                  required
                />
              </div>

              {/* Client select */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Associate Importer Client</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newContainer.client}
                  onChange={(e) => setNewContainer({ ...newContainer, client: e.target.value })}
                >
                  {masterData.clients.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Entry Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Customs Entry Doc #</label>
                <input
                  type="text"
                  placeholder="e.g. ENT/2026/0948"
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600"
                  style={{ backgroundColor: 'var(--color-input-bg)' }}
                  value={newContainer.entryNumber}
                  onChange={(e) => setNewContainer({ ...newContainer, entryNumber: e.target.value })}
                  required
                />
              </div>

              {/* Release Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Customs Release Date</label>
                <input
                  type="date"
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newContainer.releaseDate}
                  onChange={(e) => setNewContainer({ ...newContainer, releaseDate: e.target.value })}
                />
              </div>

              {/* KRA Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">KRA Milestone Phase</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newContainer.kraStatus}
                  onChange={(e) => setNewContainer({ ...newContainer, kraStatus: e.target.value })}
                >
                  {masterData.kraStatuses.map((k, i) => (
                    <option key={i} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* KEBS Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">KEBS Inspection Status</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newContainer.kebsStatus}
                  onChange={(e) => setNewContainer({ ...newContainer, kebsStatus: e.target.value })}
                >
                  {masterData.kebsStatuses.map((kb, i) => (
                    <option key={i} value={kb}>{kb}</option>
                  ))}
                </select>
              </div>

              {/* Clearance Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Clearance Status</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newContainer.clearanceStatus}
                  onChange={(e) => setNewContainer({ ...newContainer, clearanceStatus: e.target.value })}
                >
                  {masterData.clearanceStatuses.map((cs, i) => (
                    <option key={i} value={cs}>{cs}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Agency Revenue */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Revenue (KES)</label>
                  <input
                    type="number"
                    className="w-full text-xs border border-gray-200 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
                    style={{ backgroundColor: 'var(--color-input-bg)' }}
                    value={newContainer.agencyRevenue || ''}
                    onChange={(e) => setNewContainer({ ...newContainer, agencyRevenue: Number(e.target.value) })}
                  />
                </div>
                {/* Agency Cost */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Handling Cost (KES)</label>
                  <input
                    type="number"
                    className="w-full text-xs border border-gray-200 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
                    style={{ backgroundColor: 'var(--color-input-bg)' }}
                    value={newContainer.agencyCost || ''}
                    onChange={(e) => setNewContainer({ ...newContainer, agencyCost: Number(e.target.value) })}
                  />
                </div>
              </div>

            </div>

            {formError && (
              <div className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setFormError(''); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Create Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER CONTROL PANEL */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4" id="clearing-filter-bar">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full text-xs border border-gray-200 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-blue-600"
            placeholder="Search container ID, and Customs Entry doc number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Client filter select */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Client:</span>
          </div>
          <select
            className="text-xs border border-gray-200 px-3 py-1.5 rounded focus:outline-none focus:border-blue-600 bg-white"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="ALL">All Registered Clients</option>
            {masterData.clients.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* WORKBOOK Interactive Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden" id="clearing-table-box">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1250px]">
            {/* Table Head */}
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)', borderBottom: '2px solid var(--table-header-sep)' }}>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[140px]">Container # (PK)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[185px]">Importer Client</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[140px]">Customs Entry #</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[140px]">KRA Milestone</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[140px]">KEBS Inspector</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[140px]">Clearance Status</th>
                <th className="custom-table-header px-4 py-3 text-xs text-gray-700 w-[135px]">Release Date</th>
                <th className="custom-table-header px-4 py-3 text-xs text-right text-gray-700 w-[150px]">Clearing Revenue (KES)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-right text-gray-700 w-[150px]">Ledger Cost (KES)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-right text-gray-700 w-[155px]">Agency Margin (KES)</th>
                <th className="custom-table-header px-4 py-3 text-xs text-center text-gray-700 w-[70px]">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-xs text-gray-400 font-light">
                    No matching cargo customs clearing records found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const profit = item.agencyRevenue - item.agencyCost;
                  const dataBarPercentage = maxRevenue > 0 ? (Math.min(item.agencyRevenue, maxRevenue) / maxRevenue) * 100 : 0;
                  
                  return (
                    <tr 
                      key={item.containerNo} 
                      className="border-b transition-colors hover:bg-slate-50/50"
                      style={{ 
                        borderBottomColor: 'var(--color-border)',
                        backgroundColor: profit < 0 ? 'var(--anomaly-bg)' : '' 
                      }}
                    >
                      {/* PK: Container No (Read-only as PK) */}
                      <td className="px-4 py-2 font-mono font-bold text-gray-700 text-xs">
                        {item.containerNo}
                      </td>

                      {/* Dropdown Client Select */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs border border-transparent hover:border-gray-300 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.client}
                          onChange={(e) => handleUpdateField(item.containerNo, 'client', e.target.value)}
                        >
                          {masterData.clients.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>

                      {/* Entry Number (Editable: Yellow bg marker) */}
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full text-xs border border-transparent focus:outline-none focus:border-blue-600 rounded p-1 transition-all font-mono font-semibold"
                          style={{ backgroundColor: 'var(--color-input-bg)' }}
                          value={item.entryNumber}
                          onChange={(e) => handleUpdateField(item.containerNo, 'entryNumber', e.target.value)}
                        />
                      </td>

                      {/* Dropdown KRA Status */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs border border-transparent hover:border-gray-300 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.kraStatus}
                          onChange={(e) => handleUpdateField(item.containerNo, 'kraStatus', e.target.value)}
                        >
                          {masterData.kraStatuses.map((k, i) => (
                            <option key={i} value={k}>{k}</option>
                          ))}
                        </select>
                      </td>

                      {/* Dropdown KEBS Status */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs border border-transparent hover:border-gray-300 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.kebsStatus}
                          onChange={(e) => handleUpdateField(item.containerNo, 'kebsStatus', e.target.value)}
                        >
                          {masterData.kebsStatuses.map((kb, i) => (
                            <option key={i} value={kb}>{kb}</option>
                          ))}
                        </select>
                      </td>

                      {/* Dropdown Clearance Status */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs font-semibold border border-transparent hover:border-gray-300 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.clearanceStatus}
                          onChange={(e) => handleUpdateField(item.containerNo, 'clearanceStatus', e.target.value)}
                        >
                          {masterData.clearanceStatuses.map((cs, i) => (
                            <option key={i} value={cs}>{cs}</option>
                          ))}
                        </select>
                      </td>

                      {/* Release date Date picker */}
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          className="w-full text-xs border border-transparent focus:outline-none focus:border-blue-600 rounded p-1 bg-transparent text-gray-600"
                          value={item.releaseDate}
                          onChange={(e) => handleUpdateField(item.containerNo, 'releaseDate', e.target.value)}
                        />
                      </td>

                      {/* Numeric Editable Revenue (Yellow background) */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          className="w-full text-right text-xs font-mono font-semibold border border-transparent focus:outline-none focus:border-blue-600 rounded p-1"
                          style={{ backgroundColor: 'var(--color-input-bg)' }}
                          value={item.agencyRevenue}
                          onChange={(e) => handleUpdateField(item.containerNo, 'agencyRevenue', e.target.value)}
                        />
                        {/* Magnitude data bar */}
                        <div className="w-full h-1 mt-1 rounded bg-gray-100 overflow-hidden relative">
                          <div 
                            className="h-full bg-blue-600" 
                            style={{ width: `${dataBarPercentage}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Numeric Editable Cost (Yellow background) */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          className="w-full text-right text-xs font-mono font-semibold border border-transparent focus:outline-none focus:border-blue-600 rounded p-1"
                          style={{ backgroundColor: 'var(--color-input-bg)' }}
                          value={item.agencyCost}
                          onChange={(e) => handleUpdateField(item.containerNo, 'agencyCost', e.target.value)}
                        />
                      </td>

                      {/* Non-editable calculated profit! (Transparent read-only block) */}
                      <td className="px-4 py-2 text-right font-mono font-bold text-xs">
                        <span style={{ color: profit < 0 ? 'var(--color-negative)' : 'var(--color-primary)' }}>
                          {formatKES(profit)}
                        </span>
                      </td>

                      {/* Action Delete */}
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(item.containerNo)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete cargo clearing entry"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

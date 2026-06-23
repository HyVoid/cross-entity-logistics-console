import React, { useState } from 'react';
import { FleetOperationsItem, ClearingAgencyItem, MasterData } from '../types';
import { PlusCircle, Trash2, Search, Truck, Filter, AlertCircle } from 'lucide-react';
import { safeConfirm } from '../utils/safeWindow';

interface FleetOperationsProps {
  items: FleetOperationsItem[];
  clearanceItems: ClearingAgencyItem[];
  masterData: MasterData;
  onChange: (newItems: FleetOperationsItem[]) => void;
}

export default function FleetOperationsView({ items, clearanceItems, masterData, onChange }: FleetOperationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // Auto generate daily dispatch code helper
  const generateNewId = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const prefix = `DISP-${year}${month}${date}-`;
    
    // Count existing for today
    const count = items.filter(i => i.dispatchId.startsWith(prefix)).length;
    const suffix = String(count + 1).padStart(3, '0');
    return `${prefix}${suffix}`;
  };

  const [newDispatch, setNewDispatch] = useState<FleetOperationsItem>({
    dispatchId: '',
    containerNo: (clearanceItems && clearanceItems[0]?.containerNo) || '',
    vehiclePlate: (masterData?.vehicles && masterData.vehicles[0]) || '',
    driverName: (masterData?.drivers && masterData.drivers[0]) || '',
    dispatchDate: new Date().toISOString().substring(0, 10),
    fuelCost: 0,
    tripExpense: 0,
    freightRevenue: 0,
    deliveryStatus: (masterData?.deliveryStatuses && masterData.deliveryStatuses[0]) || 'Pending Dispatch',
    deliveryDate: ''
  });

  const [formError, setFormError] = useState('');

  // When form opens, refresh the dispatch ID
  const handleOpenAddForm = () => {
    const nextFormState = !showAddForm;
    setShowAddForm(nextFormState);
    if (nextFormState) {
      setNewDispatch(prev => ({
        ...prev,
        dispatchId: generateNewId(),
        containerNo: (clearanceItems && clearanceItems[0]?.containerNo) || ''
      }));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedId = newDispatch.dispatchId.trim();
    if (!trimmedId) {
      setFormError('Dispatch ID cannot be empty!');
      return;
    }

    if (items.some(item => item.dispatchId.toUpperCase() === trimmedId.toUpperCase())) {
      setFormError(`Dispatch ID "${trimmedId}" already exists! Dispatch primary keys must be unique.`);
      return;
    }

    if (!newDispatch.containerNo) {
      setFormError('No container is available to bind to transport! Please go to [02_Clearing_Agency] to create at least one container record first.');
      return;
    }

    const createdItem: FleetOperationsItem = {
      ...newDispatch,
      fuelCost: Number(newDispatch.fuelCost) || 0,
      tripExpense: Number(newDispatch.tripExpense) || 0,
      freightRevenue: Number(newDispatch.freightRevenue) || 0
    };

    const updated = [...items, createdItem];
    onChange(updated);

    // Reset Form
    setNewDispatch({
      dispatchId: '',
      containerNo: clearanceItems[0]?.containerNo || '',
      vehiclePlate: masterData.vehicles[0] || '',
      driverName: masterData.drivers[0] || '',
      dispatchDate: new Date().toISOString().substring(0, 10),
      fuelCost: 0,
      tripExpense: 0,
      freightRevenue: 0,
      deliveryStatus: masterData.deliveryStatuses[0] || 'Pending Dispatch',
      deliveryDate: ''
    });
    setFormError('');
    setShowAddForm(false);
  };

  const handleUpdateField = (dispatchId: string, field: keyof FleetOperationsItem, value: any) => {
    const originalIndex = items.findIndex(item => item.dispatchId === dispatchId);
    if (originalIndex === -1) return;

    const updated = [...items];
    let parsedValue = value;

    if (field === 'fuelCost' || field === 'tripExpense' || field === 'freightRevenue') {
      parsedValue = Number(value) || 0;
    }

    updated[originalIndex] = {
      ...updated[originalIndex],
      [field]: parsedValue
    };
    onChange(updated);
  };

  const handleDelete = (dispatchId: string) => {
    const confirmed = safeConfirm(`Are you sure you want to delete the dispatch record "${dispatchId}"? This will immediately affect fleet vehicle cost calculations in consolidated metrics.`);
    if (confirmed) {
      const filtered = items.filter(item => item.dispatchId !== dispatchId);
      onChange(filtered);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.dispatchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.containerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicle = filterVehicle === 'ALL' || item.vehiclePlate === filterVehicle;

    return matchesSearch && matchesVehicle;
  });

  const formatKES = (val: number) => {
    return `KES ${Math.round(val).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="serif-heading text-4xl mb-1 text-[#051C2C] font-bold">03_Fleet_Operations Dispatch</h1>
          <p className="text-[13px] text-gray-500 font-light">
            Dispatch planner and heavy-fleet transport log tracking freight revenues, fuel costs, and delivery stages.
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="px-4 py-2 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-sm"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Collapse Form' : 'Add New Dispatch'}</span>
        </button>
      </div>

      {/* Form: Add Fleet Dispatch */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 animate-fade-up max-w-4xl" id="add-dispatch-box">
          <h3 className="font-heading font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            Inland Heavy Carrier Logistics Dispatch (Dispatch Record)
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Dispatch ID  */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                  Dispatch ID (Dispatch PK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. DISP-20261102-001"
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600"
                  style={{ backgroundColor: 'var(--color-input-bg)' }}
                  value={newDispatch.dispatchId}
                  onChange={(e) => setNewDispatch({ ...newDispatch, dispatchId: e.target.value })}
                  required
                />
              </div>

              {/* Container No FK */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                  Container No (ForeignKey) <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white font-mono"
                  value={newDispatch.containerNo}
                  onChange={(e) => setNewDispatch({ ...newDispatch, containerNo: e.target.value })}
                >
                  {clearanceItems.length === 0 ? (
                    <option value="">(No container available for allocation)</option>
                  ) : (
                    clearanceItems.map((cli, i) => (
                      <option key={i} value={cli.containerNo}>
                        {cli.containerNo} ({cli.client})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Vehicle Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Heavy Carrier Truck Assigned</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newDispatch.vehiclePlate}
                  onChange={(e) => setNewDispatch({ ...newDispatch, vehiclePlate: e.target.value })}
                >
                  {masterData.vehicles.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Driver Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Responsible Truck Driver</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newDispatch.driverName}
                  onChange={(e) => setNewDispatch({ ...newDispatch, driverName: e.target.value })}
                >
                  {masterData.drivers.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Dispatch date YYYY-MM-DD */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Inland Transport Departure Date</label>
                <input
                  type="date"
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white"
                  value={newDispatch.dispatchDate}
                  onChange={(e) => setNewDispatch({ ...newDispatch, dispatchDate: e.target.value })}
                  required
                />
              </div>

              {/* Delivery Date YYYY-MM-DD */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Delivered & Unloaded Date</label>
                <input
                  type="date"
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white font-mono"
                  value={newDispatch.deliveryDate}
                  onChange={(e) => setNewDispatch({ ...newDispatch, deliveryDate: e.target.value })}
                />
              </div>

              {/* Delivery Status */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">Transit Status Milestone</label>
                <select
                  className="w-full text-xs border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-blue-600 bg-white font-semibold"
                  value={newDispatch.deliveryStatus}
                  onChange={(e) => setNewDispatch({ ...newDispatch, deliveryStatus: e.target.value })}
                >
                  {masterData.deliveryStatuses.map((ds, i) => (
                    <option key={i} value={ds}>{ds}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {/* Fuel Cost */}
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider font-mono">Fuel (KES)</label>
                  <input
                    type="number"
                    className="w-full text-xs border border-gray-200 px-1 py-2 rounded focus:outline-none focus:border-blue-600"
                    style={{ backgroundColor: 'var(--color-input-bg)' }}
                    value={newDispatch.fuelCost || ''}
                    onChange={(e) => setNewDispatch({ ...newDispatch, fuelCost: Number(e.target.value) })}
                  />
                </div>
                {/* Trip Expense */}
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider font-mono">Road/Toll (KES)</label>
                  <input
                    type="number"
                    className="w-full text-xs border border-gray-200 px-1 py-2 rounded focus:outline-none focus:border-blue-600"
                    style={{ backgroundColor: 'var(--color-input-bg)' }}
                    value={newDispatch.tripExpense || ''}
                    onChange={(e) => setNewDispatch({ ...newDispatch, tripExpense: Number(e.target.value) })}
                  />
                </div>
                {/* Freight Revenue */}
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider font-mono">Freight Rev (KES)</label>
                  <input
                    type="number"
                    className="w-full text-xs border border-gray-200 px-1 py-2 rounded focus:outline-none focus:border-blue-600"
                    style={{ backgroundColor: 'var(--color-input-bg)' }}
                    value={newDispatch.freightRevenue || ''}
                    onChange={(e) => setNewDispatch({ ...newDispatch, freightRevenue: Number(e.target.value) })}
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
                Dispatch Trucking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER CONTROL PANEL */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4" id="fleet-filter-bar">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full text-xs border border-gray-200 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-blue-600"
            placeholder="Search dispatch primary key, container number, truck plates, driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Vehicle filter select */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Truck:</span>
          </div>
          <select
            className="text-xs border border-gray-200 px-3 py-1.5 rounded focus:outline-none focus:border-blue-600 bg-white"
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
          >
            <option value="ALL">All Transported Vehicles</option>
            {masterData.vehicles.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
        </div>

      </div>

      {/* WORKBOOK Interactive Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden" id="fleet-table-box">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1250px]">
            {/* Table Head */}
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)', borderBottom: '2px solid var(--table-header-sep)' }}>
                <th className="custom-table-header px-4 py-3 text-xs w-[180px] text-gray-700">Dispatch ID (Dispatch PK)</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[140px] text-gray-700">Container # (ForeignKey)</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[180px] text-gray-700">Assigned Truck Plate</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[150px] text-gray-700">Carrier Driver Name</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[120px] text-gray-700">Departure Date</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[110px] text-right text-gray-700">Fuel Cost (KES)</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[110px] text-right text-gray-700">Trip Expense (KES)</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[130px] text-right text-gray-700">Freight Revenue (KES)</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[130px] text-gray-700">Transit Status</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[120px] text-gray-700">Unloaded Date</th>
                <th className="custom-table-header px-4 py-3 text-xs w-[70px] text-center text-gray-700">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-xs text-gray-400 font-light">
                    No matching fleet logistical dispatch records found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const subMargin = item.freightRevenue - (item.fuelCost + item.tripExpense);
                  return (
                    <tr 
                      key={item.dispatchId}
                      className="border-b transition-all hover:bg-slate-50/50"
                      style={{ 
                        borderBottomColor: 'var(--color-border)',
                        backgroundColor: subMargin < 0 ? 'var(--anomaly-bg)' : '' 
                      }}
                    >
                      {/* PK Dispatch key */}
                      <td className="px-4 py-2 font-mono font-bold text-gray-700 text-xs text-ellipsis overflow-hidden">
                        {item.dispatchId}
                      </td>

                      {/* FK Container No selection */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs font-mono border border-transparent hover:border-gray-200 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.containerNo}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'containerNo', e.target.value)}
                        >
                          {clearanceItems.map((cli, i) => (
                            <option key={i} value={cli.containerNo}>{cli.containerNo}</option>
                          ))}
                        </select>
                      </td>

                      {/* Dropdown Vehicle selectors */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs border border-transparent hover:border-gray-200 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.vehiclePlate}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'vehiclePlate', e.target.value)}
                        >
                          {masterData.vehicles.map((v, i) => (
                            <option key={i} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>

                      {/* Dropdown Driver selectors */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs border border-transparent hover:border-gray-200 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.driverName}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'driverName', e.target.value)}
                        >
                          {masterData.drivers.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                          ))}
                        </select>
                      </td>

                      {/* Dispatch date String/Date */}
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          className="w-full text-xs border border-transparent focus:outline-none focus:border-blue-600 rounded p-1 bg-transparent text-gray-600"
                          value={item.dispatchDate}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'dispatchDate', e.target.value)}
                        />
                      </td>

                      {/* Fuel Cost numeric input (Yellow highlight #FFFDE7) */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          className="w-full text-right text-xs font-mono font-semibold border border-transparent focus:outline-none focus:border-blue-600 rounded p-1"
                          style={{ backgroundColor: 'var(--color-input-bg)' }}
                          value={item.fuelCost}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'fuelCost', e.target.value)}
                        />
                      </td>

                      {/* Trip expense numeric input */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          className="w-full text-right text-xs font-mono font-semibold border border-transparent focus:outline-none focus:border-blue-600 rounded p-1"
                          style={{ backgroundColor: 'var(--color-input-bg)' }}
                          value={item.tripExpense}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'tripExpense', e.target.value)}
                        />
                      </td>

                      {/* Freight revenue numeric input */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          className="w-full text-right text-xs font-mono font-semibold border border-transparent focus:outline-none focus:border-blue-600 rounded p-1"
                          style={{ backgroundColor: 'var(--color-input-bg)' }}
                          value={item.freightRevenue}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'freightRevenue', e.target.value)}
                        />
                      </td>

                      {/* Delivery Status dropdown */}
                      <td className="px-3 py-2">
                        <select
                          className="w-full text-xs font-semibold border border-transparent hover:border-gray-200 focus:border-blue-600 bg-transparent rounded focus:outline-none p-1 transition-all"
                          value={item.deliveryStatus}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'deliveryStatus', e.target.value)}
                        >
                          {masterData.deliveryStatuses.map((ds, i) => (
                            <option key={i} value={ds}>{ds}</option>
                          ))}
                        </select>
                      </td>

                      {/* Delivery date Date-select */}
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          className="w-full text-xs border border-transparent focus:outline-none focus:border-blue-600 rounded p-1 bg-transparent text-gray-600 font-mono"
                          value={item.deliveryDate}
                          onChange={(e) => handleUpdateField(item.dispatchId, 'deliveryDate', e.target.value)}
                        />
                      </td>

                      {/* Action dispatch record delete */}
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(item.dispatchId)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete trucking log dispatch record"
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

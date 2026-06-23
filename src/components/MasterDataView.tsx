import React, { useState } from 'react';
import { MasterData } from '../types';
import { Plus, Trash2, ShieldAlert, Award, FileSpreadsheet, Truck, UserCheck, Users, Milestone } from 'lucide-react';
import { safeAlert, safeConfirm } from '../utils/safeWindow';

interface MasterDataProps {
  data: MasterData;
  onChange: (newData: MasterData) => void;
}

type ParameterType = 'clients' | 'vehicles' | 'drivers' | 'kraStatuses' | 'kebsStatuses' | 'clearanceStatuses' | 'deliveryStatuses';

export default function MasterDataView({ data, onChange }: MasterDataProps) {
  const [inputs, setInputs] = useState<Record<ParameterType, string>>({
    clients: '',
    vehicles: '',
    drivers: '',
    kraStatuses: '',
    kebsStatuses: '',
    clearanceStatuses: '',
    deliveryStatuses: ''
  });

  const handleAdd = (type: ParameterType) => {
    const value = inputs[type].trim();
    if (!value) return;

    // Check duplicates
    if (data[type].includes(value)) {
      safeAlert(`"${value}" is already present in the master list.`);
      return;
    }

    const updatedList = [...data[type], value];
    onChange({
      ...data,
      [type]: updatedList
    });

    setInputs({
      ...inputs,
      [type]: ''
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: ParameterType) => {
    if (e.key === 'Enter') {
      handleAdd(type);
    }
  };

  const handleRemove = (type: ParameterType, index: number, value: string) => {
    const confirmRemove = safeConfirm(`Are you sure you want to remove "${value}"? This might cause missing references in active logs or consolidated views.`);
    if (!confirmRemove) return;

    const updatedList = data[type].filter((_, i) => i !== index);
    onChange({
      ...data,
      [type]: updatedList
    });
  };

  // Helper section rendering
  const renderParamSection = (
    title: string, 
    type: ParameterType, 
    placeholder: string, 
    icon: React.ReactNode,
    desc: string
  ) => {
    const items = data[type] || [];
    return (
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex flex-col justify-between h-full hover:shadow-md transition-all">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-md text-white shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
              {icon}
            </span>
            <h4 className="font-heading font-medium text-base text-slate-800">{title}</h4>
          </div>
          <p className="text-[11px] text-gray-500 font-light mb-4 leading-relaxed">{desc}</p>
          
          <div className="max-h-56 overflow-y-auto mb-4 pr-1 space-y-1">
            {items.length === 0 ? (
              <p className="text-xs text-center py-4 text-gray-400 font-light">No available records</p>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs px-2.5 py-1.5 bg-gray-50 rounded-md group hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-600 font-mono truncate max-w-[80%]">{item}</span>
                  <button 
                    onClick={() => handleRemove(type, idx, item)}
                    className="text-gray-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action input footer */}
        <div className="border-t border-gray-100 pt-3 flex gap-1.5">
          <input
            type="text"
            className="flex-1 text-xs border border-gray-200 px-2.5 py-1.5 rounded-md focus:outline-none focus:border-blue-600 placeholder-gray-400 font-sans"
            style={{ backgroundColor: 'var(--color-input-bg)' }}
            placeholder={placeholder}
            value={inputs[type]}
            onChange={(e) => setInputs({ ...inputs, [type]: e.target.value })}
            onKeyPress={(e) => handleKeyPress(e, type)}
          />
          <button
            onClick={() => handleAdd(type)}
            className="text-white px-2.5 py-1.5 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center shrink-0 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-fade-up">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="serif-heading text-4xl mb-1 text-[#051C2C] font-bold">01_Master_Data Parameters</h1>
        <p className="text-[13px] text-gray-500 font-light">
          Configure client entities, heavy fleet vehicle registries, driver databases, and customs dictionary variables.
        </p>
      </div>

      {/* Grid parameter matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {renderParamSection(
          "Registered Client Database", 
          "clients", 
          "Add new client entity...", 
          <Users className="w-4 h-4" />,
          "Beneficiary owners or corporate importer entities logged inside customs declarations."
        )}

        {renderParamSection(
          "Heavy Vehicle fleet registry", 
          "vehicles", 
          "Add K plate/truck type...", 
          <Truck className="w-4 h-4" />,
          "Registered heavy duty trucks and specialized haul flatbeds authorized for transit."
        )}

        {renderParamSection(
          "Authorized Driver List", 
          "drivers", 
          "Add heavy vehicle driver...", 
          <UserCheck className="w-4 h-4" />,
          "Licensed operators responsible for heavy-container local and cross-state deliveries."
        )}

        {renderParamSection(
          "KRA Milestone Dictionary", 
          "kraStatuses", 
          "Add KRA tax status...", 
          <Milestone className="w-4 h-4" />,
          "Import duty filing steps verified by Kenya Revenue Authority."
        )}

        {renderParamSection(
          "KEBS Certification Registry", 
          "kebsStatuses", 
          "Add KEBS mark...", 
          <Award className="w-4 h-4" />,
          "Physical standard marks authorized by Kenya Bureau of Standards (KEBS)."
        )}

        {renderParamSection(
          "Customs Clearance Summary Status", 
          "clearanceStatuses", 
          "Add clearance phase...", 
          <FileSpreadsheet className="w-4 h-4" />,
          "Port-level operational steps determining whether cargo is released for inland transit."
        )}

        {renderParamSection(
          "Inland Transport Status", 
          "deliveryStatuses", 
          "Add transit tracking phase...", 
          <ShieldAlert className="w-4 h-4" />,
          "Live route phases of cargo containers from loading terminals to unloading facilities."
        )}

      </div>

      {/* Important instructions */}
      <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500 text-xs text-amber-900 leading-relaxed font-light flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <strong>Cascading Dependency Guard:</strong> Updates here immediately populate selectors across workbook tabs (such as Client Dropdowns in Customs Agency and Truck List in Fleet Dispatch). Before deleting or modifying a constant, ensure it is not referenced in active container pipelines.
        </div>
      </div>
    </div>
  );
}

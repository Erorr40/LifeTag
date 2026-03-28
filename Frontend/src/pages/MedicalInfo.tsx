import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, X } from 'lucide-react';

export default function MedicalInfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    bloodType: '',
    conditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    emergencyContacts: [] as { name: '', phone: '' }[],
    notes: '',
  });

  const [tempInput, setTempInput] = useState({
    condition: '', medication: '', allergy: '', contactName: '', contactPhone: ''
  });

  const handleCreate = async () => {
    try {
      await fetch('http://localhost:3001/api/save-medical-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType: 'Medical', ...formData }),
      });
      navigate('/pin-protection');
    } catch (e) {
      navigate('/pin-protection');
    }
  };

  const addArrayItem = (field: 'conditions' | 'medications' | 'allergies', value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const removeArrayItem = (field: 'conditions' | 'medications' | 'allergies', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addContact = () => {
    if (!tempInput.contactName || !tempInput.contactPhone) return;
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: tempInput.contactName, phone: tempInput.contactPhone }]
    }));
    setTempInput(p => ({ ...p, contactName: '', contactPhone: '' }));
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] h-screen relative">
      <div className="w-full h-full overflow-y-auto p-6 pb-32 no-scrollbar">    
        <div className="mt-4 mb-4 flex justify-center">
          <Shield size={32} className="text-blue-500 bg-blue-50 p-1.5 rounded-full" />
        </div>

        <div className="flex gap-1.5 mb-6 justify-center">
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 text-center mb-6">Medical Information</h2>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              type="text"
              placeholder="e.g John Doe"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Date of Birth</label>
            <input
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              type="date"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Blood Type</label>
            <select
              value={formData.bloodType}
              onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none appearance-none">
              <option value="">Select...</option>
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
            </select>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Medical Conditions</label>
            <div className="flex gap-2 mb-2">
              <input value={tempInput.condition} onChange={e=>setTempInput(p=>({...p, condition: e.target.value}))} className="flex-1 border rounded-xl px-3 py-1.5 text-xs" placeholder="Add condition"/>
              <button onClick={() => { addArrayItem('conditions', tempInput.condition); setTempInput(p=>({...p, condition: ''})) }} className="bg-blue-50 text-blue-600 px-3 rounded-xl text-xs font-medium">Add</button>
            </div>
            {formData.conditions.map((item, i) => (
               <div key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl mb-1 text-xs">
                 <span>{item}</span>
                 <button onClick={() => removeArrayItem('conditions', i)}><X size={14} className="text-red-400"/></button>
               </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Medications</label>
             <div className="flex gap-2 mb-2">
              <input value={tempInput.medication} onChange={e=>setTempInput(p=>({...p, medication: e.target.value}))} className="flex-1 border rounded-xl px-3 py-1.5 text-xs" placeholder="Add medication"/>
              <button onClick={() => { addArrayItem('medications', tempInput.medication); setTempInput(p=>({...p, medication: ''})) }} className="bg-blue-50 text-blue-600 px-3 rounded-xl text-xs font-medium">Add</button>
            </div>
            {formData.medications.map((item, i) => (
               <div key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl mb-1 text-xs">
                 <span>{item}</span>
                 <button onClick={() => removeArrayItem('medications', i)}><X size={14} className="text-red-400"/></button>
               </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Allergies</label>
             <div className="flex gap-2 mb-2">
              <input value={tempInput.allergy} onChange={e=>setTempInput(p=>({...p, allergy: e.target.value}))} className="flex-1 border rounded-xl px-3 py-1.5 text-xs" placeholder="Add allergy"/>
              <button onClick={() => { addArrayItem('allergies', tempInput.allergy); setTempInput(p=>({...p, allergy: ''})) }} className="bg-blue-50 text-blue-600 px-3 rounded-xl text-xs font-medium">Add</button>
            </div>
            {formData.allergies.map((item, i) => (
               <div key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl mb-1 text-xs">
                 <span>{item}</span>
                 <button onClick={() => removeArrayItem('allergies', i)}><X size={14} className="text-red-400"/></button>
               </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Contacts</label>
             <div className="flex gap-2 mb-2">
              <input value={tempInput.contactName} onChange={e=>setTempInput(p=>({...p, contactName: e.target.value}))} className="flex-1 border rounded-xl px-3 py-1.5 text-xs" placeholder="Name"/>
              <input value={tempInput.contactPhone} onChange={e=>setTempInput(p=>({...p, contactPhone: e.target.value}))} className="flex-1 border rounded-xl px-3 py-1.5 text-xs" placeholder="Phone"/>
              <button onClick={addContact} className="bg-blue-50 text-blue-600 px-3 rounded-xl text-xs font-medium">Add</button>
            </div>
            {formData.emergencyContacts.map((item, i) => (
               <div key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl mb-1 text-xs">
                 <span>{item.name} - {item.phone}</span>
                 <button onClick={() => setFormData(p => ({...p, emergencyContacts: p.emergencyContacts.filter((_, idx)=> idx !== i)}))}><X size={14} className="text-red-400"/></button>
               </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#f8fbff] via-[#f8fbff] to-transparent">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-white text-gray-700 font-medium py-3 rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleCreate}
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

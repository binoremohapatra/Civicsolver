import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HardHat, Truck, Star, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { assignTechnician } from "../api/complaintService";

// ✅ ROSTER MATCHING YOUR SPRING BOOT BACKEND
const TECH_ROSTER = [
  { id: 'T-001', name: 'Rajesh Kumar', role: 'Senior Electrician', rating: 4.9, eta: '15 mins', status: 'AVAILABLE', dept: 'Electrical' },
  { id: 'T-002', name: 'Deepak Roy', role: 'Electrical Specialist', rating: 4.5, eta: '20 mins', status: 'AVAILABLE', dept: 'Electrical' },
  { id: 'T-003', name: 'Sunil Gupta', role: 'Water Works Engineer', rating: 4.6, eta: '25 mins', status: 'AVAILABLE', dept: 'Water' },
  { id: 'T-004', name: 'Vikram Singh', role: 'Road Maintenance Lead', rating: 4.7, eta: '35 mins', status: 'BUSY', dept: 'Roads' },
  { id: 'T-006', name: 'Amit Verma', role: 'Sanitation Supervisor', rating: 4.8, eta: '10 mins', status: 'AVAILABLE', dept: 'Sanitation' },
  { id: 'T-008', name: 'Insp. Gadget', role: 'Public Safety Officer', rating: 5.0, eta: '05 mins', status: 'AVAILABLE', dept: 'Safety' },
  { id: 'T-011', name: 'Suresh Gupta', role: 'General Support', rating: 4.3, eta: '45 mins', status: 'AVAILABLE', dept: 'General' },
];

const TechnicianDispatch = ({ complaint, onAssigned }) => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 SMART SORT: Recommend techs based on Complaint Category
  const sortedTechs = useMemo(() => {
    if (!complaint?.category) return TECH_ROSTER;

    const category = complaint.category.toLowerCase();
    
    return [...TECH_ROSTER].sort((a, b) => {
      // Map Complaint Category to Dept
      let targetDept = 'General';
      if (category.includes('light') || category.includes('power')) targetDept = 'Electrical';
      if (category.includes('road') || category.includes('pothole')) targetDept = 'Roads';
      if (category.includes('water') || category.includes('leak')) targetDept = 'Water';
      if (category.includes('garbage') || category.includes('sanitation')) targetDept = 'Sanitation';

      const aMatch = a.dept === targetDept;
      const bMatch = b.dept === targetDept;

      if (aMatch && !bMatch) return -1; // a comes first
      if (!aMatch && bMatch) return 1;  // b comes first
      return 0; // maintain order
    });
  }, [complaint]);

  // ✅ UI: Already Assigned
  if (complaint.assignedOfficer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 min-h-[400px]">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <Truck className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white">Unit Dispatched</h3>
        <p className="text-slate-400 mt-2 text-lg">
          Officer <span className="text-emerald-300 font-mono font-bold">{complaint.assignedOfficer}</span> is currently handling this case.
        </p>
      </div>
    );
  }

  const handleDispatch = async () => {
    if (!selectedTech) return;
    setLoading(true);

    try {
      // ✅ HIT BACKEND: Manual Override
      await assignTechnician(complaint.id, selectedTech.name);
      
      toast.success("Unit Dispatched", { description: `${selectedTech.name} assigned successfully.` });
      if (onAssigned) onAssigned();
      
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Could not update assignment.";
      toast.error("Dispatch Failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="text-blue-400" /> Dispatch Unit
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Category: <span className="text-indigo-400 font-bold uppercase">{complaint.category || 'General'}</span>
          </p>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="grid gap-3 mb-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {sortedTechs.map((tech, index) => {
           // Logic to show "Recommended" badge for top matches
           const isRecommended = index === 0 && tech.status === 'AVAILABLE';

           return (
            <motion.div
              key={tech.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => tech.status === 'AVAILABLE' && setSelectedTech(tech)}
              className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedTech?.id === tech.id
                  ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
              } ${tech.status !== 'AVAILABLE' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-indigo-400">
                  <Sparkles className="w-3 h-3" /> BEST MATCH
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${selectedTech?.id === tech.id ? 'bg-blue-500' : 'bg-slate-800'}`}>
                    <HardHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{tech.name}</h4>
                    <p className="text-xs text-slate-400">{tech.role}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-amber-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {tech.rating}
                  </div>
                  <div className={`flex items-center gap-1 text-xs mt-1 font-mono ${
                    tech.status === 'AVAILABLE' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tech.status === 'AVAILABLE' ? <Clock className="w-3 h-3" /> : null} 
                    {tech.status === 'AVAILABLE' ? tech.eta : tech.status}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <button
          onClick={handleDispatch}
          disabled={!selectedTech || loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                     text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {loading ? "Dispatching..." : <><CheckCircle className="w-5 h-5" /> Confirm & Dispatch</>}
        </button>
      </div>
    </div>
  );
};

export default TechnicianDispatch;
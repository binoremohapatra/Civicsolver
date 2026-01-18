import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle, AlertTriangle, Zap, Brain, Cpu, LogOut, Loader2, Calendar, User, ChevronLeft, ChevronRight, Truck, HardHat } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ✅ REAL API IMPORTS
import { fetchDashboardData, logoutOfficer } from '../api/complaintService';

// ✅ COMPONENT IMPORTS
import ResolutionConsole from '../components/ResolutionConsole';
import AppealTribunal from '../components/AppealTribunal';
import TechnicianDispatch from '../components/TechnicianDispatch'; 
import MatrixRain from '../components/MatrixRain';
import HolographicCard from '../components/HolographicCard';
import DNAHelix from '../components/DNAHelix';

function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dispatch'); 
  
  // ✅ STATE
  const [complaints, setComplaints] = useState([]); 
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    resolved: 0,
    pending: 0
  });

  const [currentUser] = useState({ 
    role: localStorage.getItem('role') || 'OFFICER',
  });

  // 🛠️ HELPER: Fixes "Invalid Date"
  const formatDate = (dateArray) => {
    if (!dateArray) return "N/A";
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString();
    }
    return new Date(dateArray).toLocaleDateString();
  };

  // 1. FETCH REAL BACKEND DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData() || []; 
        console.log("🔥 LIVE DATA RECEIVED:", data);
        
        setComplaints(data);

        setStats({
          totalCases: data.length,
          activeCases: data.filter(c => c.currentStatus === 'OPEN' || c.currentStatus === 'IN_PROGRESS' || c.currentStatus === 'ASSIGNED').length,
          resolved: data.filter(c => c.currentStatus === 'CLOSED' || c.currentStatus === 'RESOLVED').length,
          pending: data.filter(c => c.appealStatus === 'PENDING').length,
        });

        if (data.length > 0) {
           setSelectedComplaint(data[0]);
        }

      } catch (err) {
        console.error("Sync Error:", err);
        toast.error('Neural Link Failed', { description: 'Could not fetch secure files.' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logoutOfficer();
    navigate('/');
  };

  const nextCase = () => {
    if (currentIndex < complaints.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedComplaint(complaints[newIndex]);
    }
  };

  const prevCase = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedComplaint(complaints[newIndex]);
    }
  };

  // ✅ NEW: View Options Configuration
  const viewOptions = [
    { id: 'dispatch', label: 'Dispatch', icon: Truck },
    { id: 'resolution', label: 'Resolution', icon: Zap },
    { id: 'appeal', label: 'Appeals', icon: Brain }
  ];

  // 3D Orb Component
  const FloatingOrb3D = ({ delay, size, color, duration, x, y, z }) => (
    <motion.div
      className="absolute rounded-full"
      style={{ width: size, height: size, left: x, top: y, filter: `blur(${z * 2}px)` }}
      animate={{
        x: [0, 100 * z, 0], y: [0, 150 * z, 0], scale: [1, 1.3, 1],
        opacity: [0.1, 0.4, 0.1], rotateZ: [0, 360],
      }}
      transition={{ duration: duration, delay: delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}dd, ${color}44, transparent)`,
          boxShadow: `0 0 ${z * 30}px ${color}66`,
        }}
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden font-sans text-slate-200">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <MatrixRain opacity={0.15} />
        <FloatingOrb3D delay={0} size="500px" color="#14b8a6" duration={20} x="5%" y="10%" z={1.5} />
        <FloatingOrb3D delay={2} size="600px" color="#f59e0b" duration={25} x="75%" y="50%" z={2} />
        <motion.div className="absolute inset-0"
          style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20, 184, 166, 0.02) 2px, rgba(20, 184, 166, 0.02) 4px)' }}
          animate={{ y: [0, 100, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10">
        
        {/* --- HEADER --- */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-slate-800/50 backdrop-blur-2xl bg-slate-900/20 relative overflow-hidden"
        >
          <div className="max-w-[1600px] mx-auto px-6 py-6 relative z-10">
            <div className="flex items-center justify-between">
              <HolographicCard>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/50 backdrop-blur-xl">
                  <Shield className="w-10 h-10 text-teal-400" />
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                      CivicSolver
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      <p className="text-sm text-slate-400 font-mono">QUANTUM OFFICER NEXUS</p>
                    </div>
                  </div>
                </div>
              </HolographicCard>

              <div className="flex items-center gap-4">
                <HolographicCard>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/50 backdrop-blur-xl">
                    <Cpu className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                    <div>
                      <p className="text-xs text-slate-500 font-mono">QUANTUM CORE</p>
                      <p className="text-sm text-cyan-400 font-mono font-bold">ONLINE</p>
                    </div>
                  </div>
                </HolographicCard>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all group">
                   <LogOut className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* --- LOADING --- */}
        {loading ? (
            <div className="h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-teal-400 animate-spin" />
                <p className="mt-4 font-mono text-teal-400 animate-pulse">ESTABLISHING SECURE UPLINK...</p>
            </div>
        ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-[1600px] mx-auto px-6 py-8"
            >
              {/* --- STATS --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Cases', value: stats.totalCases, icon: Shield, color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.3)' },
                  { label: 'Active', value: stats.activeCases, icon: Zap, color: 'from-amber-500 to-yellow-500', iconColor: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.3)' },
                  { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400', glow: 'rgba(16, 185, 129, 0.3)' },
                  { label: 'Pending', value: stats.pending, icon: AlertTriangle, color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400', glow: 'rgba(139, 92, 246, 0.3)' },
                ].map((stat, idx) => (
                  <HolographicCard key={idx}>
                    <motion.div whileHover={{ scale: 1.05, y: -5 }} className="relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 overflow-hidden">
                      <div className="absolute -inset-2 rounded-2xl opacity-20 group-hover:opacity-100 blur-xl transition-opacity" style={{ background: stat.glow }} />
                      <div className="flex items-start justify-between mb-4 relative z-10">
                          <stat.icon className={`w-10 h-10 ${stat.iconColor}`} />
                          <div className="w-12 h-12 opacity-30"><DNAHelix /></div>
                      </div>
                      <p className="text-5xl font-black text-white mb-2 relative z-10">{stat.value}</p>
                      <p className="text-sm text-slate-400 font-mono uppercase tracking-wider relative z-10">{stat.label}</p>
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className={`mt-3 h-1 rounded-full bg-gradient-to-r ${stat.color} relative z-10`} />
                    </motion.div>
                  </HolographicCard>
                ))}
              </div>

              {/* --- VIEW TOGGLE WITH SHINE EFFECT --- */}
              <motion.div className="relative mb-8">
                <HolographicCard intensity={2}>
                  <div className="flex gap-4 p-2 rounded-2xl bg-slate-900/30 backdrop-blur-xl border border-slate-700/50">
                    {viewOptions.map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`group relative flex-1 overflow-hidden p-6 rounded-xl transition-all duration-300 ${
                          activeView === view.id 
                            ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-2 border-teal-400/50 shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
                            : 'bg-slate-900/40 border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                          {/* ✨ SHINE EFFECT ✨ */}
                          <motion.div
                            className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{
                              repeat: Infinity,
                              repeatType: "loop",
                              duration: 2.5,
                              repeatDelay: 3,
                              ease: "easeInOut"
                            }}
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                              skewX: '-20deg'
                            }}
                          />

                          {/* Icon & Label */}
                          <div className="relative flex items-center justify-center gap-4 z-10">
                            <view.icon 
                              className={`w-6 h-6 transition-colors duration-300 ${
                                activeView === view.id ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'text-slate-400 group-hover:text-slate-200'
                              }`} 
                            />
                            <h3 className={`text-xl font-bold transition-colors duration-300 ${
                              activeView === view.id ? 'text-teal-300' : 'text-slate-300 group-hover:text-white'
                            }`}>
                              {view.label}
                            </h3>
                          </div>
                          
                          {/* Active Glow Bar */}
                          {activeView === view.id && (
                            <motion.div 
                              layoutId="activeGlow"
                              className="absolute bottom-0 left-0 right-0 h-1 bg-teal-400 shadow-[0_0_10px_#2dd4bf]" 
                            />
                          )}
                      </button>
                    ))}
                  </div>
                </HolographicCard>
              </motion.div>

              {/* --- CONSOLE AREA --- */}
              <motion.div className="relative">
                <HolographicCard intensity={2}>
                  <div className="relative p-8 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border-2 border-slate-700/50 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        
                       {complaints.length === 0 ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
                             <AlertTriangle className="w-16 h-16 mb-4 opacity-50" />
                             <p className="font-mono text-lg">NO SECURE FILES FOUND IN REGISTRY</p>
                          </motion.div>
                       ) : (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                             {/* LEFT: Case Details */}
                             <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
                                   <h2 className="text-2xl font-bold text-white">Case File: #{selectedComplaint?.id}</h2>
                                   
                                   {/* NAVIGATION BUTTONS */}
                                   <div className="flex gap-2">
                                      <button onClick={prevCase} disabled={currentIndex===0} className="p-2 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                                      <button onClick={nextCase} disabled={currentIndex===complaints.length-1} className="p-2 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
                                   </div>
                                </div>

                                <div className="space-y-4">
                                   <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                      <p className="text-xs text-slate-500 uppercase">Subject</p>
                                      <p className="text-xl font-bold text-white">{selectedComplaint?.title}</p>
                                   </div>
                                   <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                      <p className="text-xs text-slate-500 uppercase">Description</p>
                                      <p className="text-slate-300">{selectedComplaint?.description}</p>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-slate-950/50 p-3 rounded-lg flex items-center gap-3">
                                         <User className="text-slate-500"/>
                                         <div><p className="text-xs text-slate-500">Citizen ID</p><p className="text-sm font-mono">{selectedComplaint?.userId}</p></div>
                                      </div>
                                      <div className="bg-slate-950/50 p-3 rounded-lg flex items-center gap-3">
                                         <Calendar className="text-slate-500"/>
                                         <div><p className="text-xs text-slate-500">Date</p><p className="text-sm font-mono">{formatDate(selectedComplaint?.createdAt)}</p></div>
                                      </div>
                                   </div>

                                   {/* Assigned Unit Status */}
                                   <div className="bg-slate-950/50 p-3 rounded-lg flex items-center gap-3 border border-slate-800">
                                      <div className={`p-2 rounded-full ${selectedComplaint?.assignedOfficer ? 'bg-blue-500/20' : 'bg-slate-800'}`}>
                                        <HardHat className={`w-5 h-5 ${selectedComplaint?.assignedOfficer ? 'text-blue-400' : 'text-slate-500'}`} />
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned Unit</p>
                                        <p className={`text-sm font-mono font-bold ${selectedComplaint?.assignedOfficer ? 'text-blue-300' : 'text-slate-600'}`}>
                                          {selectedComplaint?.assignedOfficer || "AWAITING DISPATCH"}
                                        </p>
                                      </div>
                                    </div>
                                </div>
                             </div>

                             {/* RIGHT: Action Console (Switches based on Active View) */}
                             <div className="border-l border-slate-700 pl-8">
                                {activeView === 'dispatch' && (
                                   <TechnicianDispatch 
                                      complaint={selectedComplaint} 
                                      onAssigned={() => toast.success("Technician Assigned")}
                                   />
                                )}
                                {activeView === 'resolution' && (
                                   <ResolutionConsole 
                                      complaintId={selectedComplaint?.id}
                                      currentStatus={selectedComplaint?.currentStatus}
                                      onResolved={() => toast.success("Protocol Complete")}
                                   />
                                )}
                                {activeView === 'appeal' && (
                                   <AppealTribunal 
                                      complaint={selectedComplaint}
                                      currentUserId={currentUser.role} 
                                   />
                                )}
                             </div>
                          </div>
                       )}
                    </AnimatePresence>
                  </div>
                </HolographicCard>
              </motion.div>

            </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
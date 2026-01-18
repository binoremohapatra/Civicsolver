import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import apiClient from '../api/axiosConfig';

// --- PARTICLE COMPONENT (The "Three" Animation Background) ---
const BackgroundParticles = () => {
  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-teal-500/30 rounded-full"
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 20}vh`, `${p.y}vh`], // Float up and down
            opacity: [0, 0.8, 0], // Fade in and out
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/0 to-[#0F172A] z-0" />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!officerId || !password) {
      toast.error('Missing credentials');
      return;
    }

    setLoading(true);

    const payload = {
      serviceId: officerId.trim(),
      password: password.trim(),
    };

    try {
      const res = await apiClient.post('/auth/officer-login', payload);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Access Denied', {
        description: err?.response?.data?.message || 'Invalid Service ID or Password',
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] flex items-center justify-center overflow-hidden">
      
      {/* 1. ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>
      <BackgroundParticles />

      {/* 2. MAIN LOGIN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "out" }}
        className="relative z-10 w-[400px]"
      >
        <form
          onSubmit={handleLogin}
          autoComplete="off"
          className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Glass Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50" />

          <div className="flex flex-col items-center justify-center mb-8">
            {/* 3. 3D ROTATING SHIELD LOGO */}
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                y: [0, -5, 0] // Floating effect
              }}
              transition={{
                rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center shadow-lg mb-4 perspective-1000"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Shield className="w-10 h-10 text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
              
              {/* Fake 3D Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none" />
            </motion.div>

            <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Officer Portal
            </h1>
            <p className="text-slate-500 text-sm mt-1">Secure Access Gateway</p>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Service ID</label>
              <Input
                placeholder="OFF-456"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                autoComplete="off"
                className="mt-1 bg-slate-950/50 border-slate-800 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all h-12 text-lg tracking-widest font-mono"
              />
            </div>

            <div className="group">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="mt-1 bg-slate-950/50 border-slate-800 focus:border-teal-500/50 focus:ring-teal-500/20 transition-all h-12"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-8 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 transition-all active:scale-[0.98] border border-teal-500/20"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Authenticate System'}
          </Button>
        </form>
        
        {/* Footer Text */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Authorized personnel only. All actions are logged on blockchain.
        </p>
      </motion.div>

      <Toaster theme="dark" position="top-center" />
    </div>
  );
};

export default Login;
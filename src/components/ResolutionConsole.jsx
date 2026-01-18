import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  Lock, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Siren,
  KeyRound 
} from 'lucide-react';
import { toast } from 'sonner';

// Real API Imports
import { requestClosureOTP, verifyAndCloseComplaint } from '../api/complaintService';

// Visual Components 
import BiometricScanner from './BiometricScanner'; 

const ResolutionConsole = ({ complaintId, currentStatus, onResolved }) => {
  const [status, setStatus] = useState('IDLE'); // IDLE, SCANNING, OTP_SENT, VERIFYING, SUCCESS, ERROR
  const [otp, setOtp] = useState('');

  // 1. Sync state when props change
  useEffect(() => {
    const isAlreadyResolved = ['RESOLVED', 'CLOSED', 'COMPLETED'].includes(currentStatus?.toUpperCase());
    if (isAlreadyResolved) {
        setStatus('SUCCESS_STATIC');
    } else {
        setStatus('IDLE');
    }
  }, [currentStatus, complaintId]);

  // --- REAL ACTION: REQUEST OTP ---
  const handleInitiateProtocol = async () => {
    setStatus('SCANNING'); 

    // Fake delay for the cool biometric animation
    await new Promise(r => setTimeout(r, 2000));

    try {
      await requestClosureOTP(complaintId);
      setStatus('OTP_SENT');
      toast.success("Protocol Initiated", { description: "Secure OTP sent to citizen." });
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
      toast.error("Server Error", { description: "Failed to initiate protocol." });
    }
  };

  // --- REAL ACTION: VERIFY & CLOSE ---
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.warning("Input Required", { description: "Enter valid 6-digit secure key." });
      return;
    }

    setStatus('VERIFYING');

    try {
      await verifyAndCloseComplaint(complaintId, otp);
      setStatus('SUCCESS');
      toast.success("Complaint Closed", { description: "Blockchain transaction confirmed." });
      if (onResolved) onResolved();
    } catch (error) {
      console.error(error);
      setStatus('OTP_SENT'); // Go back to input to try again
      toast.error("Verification Failed", { description: "Invalid or expired OTP." });
    }
  };

  // --- VIEW: ALREADY RESOLVED ---
  if (status === 'SUCCESS_STATIC') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white tracking-wide">CASE RESOLVED</h2>
        <div className="mt-4 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700 font-mono text-xs text-emerald-400">
           STATUS: ARCHIVED_ON_CHAIN
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center relative min-h-[400px] overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* --- STATE 1: IDLE (OFFICER OVERRIDE) --- */}
        {status === 'IDLE' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 z-10"
          >
            <div className="relative group cursor-pointer" onClick={handleInitiateProtocol}>
              <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all duration-500" />
              <div className="relative w-36 h-36 rounded-full border border-teal-500/30 flex items-center justify-center bg-slate-900/80 backdrop-blur-md shadow-[0_0_30px_rgba(20,184,166,0.1)] group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 rounded-full border-t-2 border-teal-500 animate-[spin_3s_linear_infinite]" />
                <Fingerprint className="w-16 h-16 text-teal-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Officer Override</h2>
              <p className="text-slate-400 text-sm mt-2">Biometric auth required to close case</p>
            </div>

            <button
              onClick={handleInitiateProtocol}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 transition-all active:scale-95"
            >
              Start Closure Protocol
            </button>
          </motion.div>
        )}

        {/* --- STATE 2: SCANNING (ANIMATION) --- */}
        {status === 'SCANNING' && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 z-10">
              <BiometricScanner isScanning={true} />
              <p className="mt-8 text-teal-400 font-mono text-sm tracking-widest animate-pulse">
                AUTHENTICATING OFFICER...
              </p>
          </motion.div>
        )}

        {/* --- STATE 3: OTP INPUT --- */}
        {(status === 'OTP_SENT' || status === 'VERIFYING') && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm z-10"
          >
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                <div className="relative w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-amber-500/50 shadow-lg">
                  <Lock className="w-10 h-10 text-amber-400" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Awaiting Authorization</h3>
            <p className="text-slate-400 text-sm mb-8">Enter the 6-digit code sent to the Citizen.</p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur transition-all group-hover:blur-md" />
                <div className="relative bg-slate-950 border border-slate-700 rounded-xl flex items-center px-4">
                  <KeyRound className="w-5 h-5 text-slate-500 mr-3" />
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={status === 'VERIFYING'}
                    className="w-full bg-transparent text-center text-3xl font-mono tracking-[0.5em] text-white py-4 outline-none placeholder:text-slate-800 placeholder:tracking-normal"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('IDLE')}
                  className="px-4 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'VERIFYING'}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
                >
                  {status === 'VERIFYING' ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin"/> Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> Verify & Close
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* --- STATE 4: SUCCESS --- */}
        {status === 'SUCCESS' && (
          <motion.div key="success" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="z-10">
            <div className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">RESOLVED</h2>
            <p className="text-slate-400 mt-2">Database Updated & Block Mined</p>
          </motion.div>
        )}

        {/* --- STATE 5: ERROR --- */}
        {status === 'ERROR' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
               <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Connection Failed</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">Could not reach the secure server.</p>
            <button onClick={() => setStatus('IDLE')} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors">
              Try Again
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ResolutionConsole;
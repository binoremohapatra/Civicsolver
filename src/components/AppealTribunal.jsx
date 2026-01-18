import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, UserCheck, CheckCircle, XCircle, AlertTriangle, FileText, MapPin, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { assignModerator, moderateAppeal } from '../api/complaintService';

const AppealTribunal = ({ complaint, currentUserId }) => {
  const [moderatorAssigned, setModeratorAssigned] = useState(complaint?.moderatorId || null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState(null);

  const isAssignedToCurrentUser = moderatorAssigned === currentUserId;
  
  // ✅ LOGIC UPDATE: Check if appeal exists
  const isAppealActive = complaint.appealStatus === 'PENDING' || complaint.currentStatus === 'APPEAL_FILED';

  // 🛠️ HELPER: Handle Java Date Arrays [2025, 1, 16]
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day).toLocaleDateString();
    }
    return new Date(dateInput).toLocaleDateString();
  };

  const handleAssignModerator = async () => {
    setLoading(true);
    try {
      await assignModerator(complaint.id, currentUserId);
      setModeratorAssigned(currentUserId);
      toast.success("Moderator Assigned");
    } catch (err) {
      console.error(err);
      setError("Failed to assign moderator.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (action) => {
    if (!feedback.trim()) {
      setError('Please provide feedback for your decision');
      return;
    }
    setLoading(true);
    try {
      await moderateAppeal(complaint.id, action, feedback);
      setDecision({ action });
      toast.success("Decision Recorded");
    } catch (err) {
      console.error(err);
      setError("Failed to submit decision.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI: NO APPEAL
  if (!isAppealActive) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 rounded-2xl border border-slate-700/30">
        <Gavel className="w-16 h-16 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-400">No Active Appeals</h3>
        <p className="text-slate-500 mt-2">This case has not been flagged for tribunal review.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* LEFT: Original Complaint Details */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Original Complaint</h3>
            <p className="text-sm text-slate-400">Read-only details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Title</p>
            <p className="text-lg font-semibold text-white">{complaint.title}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-300 leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-slate-500" />
                <p className="text-xs text-slate-500">Citizen ID</p>
              </div>
              <p className="text-sm font-medium text-slate-300">{complaint.userId || 'Anonymous'}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <p className="text-xs text-slate-500">Date</p>
              </div>
              <p className="text-sm font-medium text-slate-300">{formatDate(complaint.createdAt)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT: Moderation Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <Gavel className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">Moderation Panel</h3>
            <p className="text-sm text-slate-400">Appeal decision center</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* No moderator assigned */}
          {!moderatorAssigned && (
            <motion.div
              key="assign"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-700/50 text-center space-y-4">
                <div className="inline-block p-4 rounded-full bg-blue-500/10">
                  <UserCheck className="w-10 h-10 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Moderator Assigned</h4>
                  <p className="text-sm text-slate-400">Claim this case to begin moderation</p>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                onClick={handleAssignModerator}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                {loading ? 'Assigning...' : <><UserCheck className="w-5 h-5"/> Assign to Me</>}
              </button>
            </motion.div>
          )}

          {/* Moderator Assigned & Decision Pending */}
          {moderatorAssigned && !decision && (
            <motion.div
              key="moderate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm text-purple-300">
                  <span className="font-semibold">Assigned to:</span> {moderatorAssigned}
                  {isAssignedToCurrentUser && <span className="ml-2 text-xs text-purple-400">(You)</span>}
                </p>
              </div>

              {isAssignedToCurrentUser ? (
                <>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter ruling feedback..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-purple-500/50"
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleDecision('ACCEPTED')} className="py-4 rounded-lg bg-green-600 text-white font-bold flex justify-center gap-2"><CheckCircle className="w-5 h-5" /> Uphold</button>
                    <button onClick={() => handleDecision('REJECTED')} className="py-4 rounded-lg bg-red-600 text-white font-bold flex justify-center gap-2"><XCircle className="w-5 h-5" /> Reject</button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-slate-400">Assigned to another moderator.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Decision Made */}
          {decision && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className={`p-6 rounded-full inline-block mb-4 ${decision.action === 'ACCEPTED' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {decision.action === 'ACCEPTED' ? <CheckCircle className="w-16 h-16 text-green-400" /> : <XCircle className="w-16 h-16 text-red-400" />}
              </div>
              <h3 className="text-2xl font-bold text-white">Appeal {decision.action === 'ACCEPTED' ? 'Upheld' : 'Rejected'}</h3>
              <p className="text-slate-400 mt-2">Decision recorded on blockchain.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AppealTribunal;
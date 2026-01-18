import { motion } from 'motion/react';
import { Fingerprint } from 'lucide-react';

const BiometricScanner = ({ isScanning, onComplete }) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-teal-500/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-teal-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-cyan-500/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 translate-y-1/2" />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute inset-8 rounded-full border-2 border-purple-500/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute left-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute right-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {/* Center fingerprint */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: isScanning ? [1, 1.2, 1] : 1,
            rotate: isScanning ? 360 : 0,
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
          className="relative"
        >
          <Fingerprint className="w-24 h-24 text-teal-400" />
          
          {/* Scanning line */}
          {isScanning && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent blur-sm" />
            </motion.div>
          )}

          {/* Pulse effect */}
          {isScanning && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 2, 2],
                opacity: [0.5, 0, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)',
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Scanning rays */}
      {isScanning && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-32 origin-bottom"
              style={{
                rotate: `${i * 45}deg`,
                background: 'linear-gradient(to top, rgba(20, 184, 166, 0.5), transparent)',
              }}
              animate={{
                scaleY: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}

      {/* Corner brackets */}
      {[
        'top-0 left-0 border-l-2 border-t-2',
        'top-0 right-0 border-r-2 border-t-2',
        'bottom-0 left-0 border-l-2 border-b-2',
        'bottom-0 right-0 border-r-2 border-b-2',
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 ${pos} border-teal-400`}
          animate={{
            opacity: isScanning ? [0.3, 1, 0.3] : 0.3,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

export default BiometricScanner;
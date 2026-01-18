import { motion } from 'motion/react';

const VoiceWaveform = ({ isActive = false }) => {
  // Generate 20 bars for the waveform
  const bars = Array.from({ length: 20 });

  return (
    <div className="flex items-center justify-center gap-1 h-16 w-full overflow-hidden">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${
            isActive 
              ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
              : 'bg-slate-700'
          }`}
          initial={{ height: 4 }}
          animate={{
            height: isActive
              ? [8, Math.random() * 40 + 10, 8] // Random height between 10px and 50px
              : 4,
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: i * 0.05, // Stagger the animation across the bars
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
import { motion } from 'motion/react';

const DNAHelix = ({ className = '' }) => {
  const points = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.5))' }}
      >
        {/* Left strand */}
        {points.map((i) => {
          const y = i * 20;
          const x = 50 + Math.sin((i * Math.PI) / 5) * 30;
          return (
            <motion.circle
              key={`left-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="#14b8a6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          );
        })}

        {/* Right strand */}
        {points.map((i) => {
          const y = i * 20;
          const x = 150 + Math.sin((i * Math.PI) / 5) * 30;
          return (
            <motion.circle
              key={`right-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="#8b5cf6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1 + 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          );
        })}

        {/* Connecting bars */}
        {points.map((i) => {
          const y = i * 20;
          const x1 = 50 + Math.sin((i * Math.PI) / 5) * 30;
          const x2 = 150 + Math.sin((i * Math.PI) / 5) * 30;
          return (
            <motion.line
              key={`bar-${i}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="url(#gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default DNAHelix;
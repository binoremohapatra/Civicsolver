import { useRef, useState } from 'react';
import { motion } from 'motion/react';

const HolographicCard = ({ children, className = '', intensity = 1 }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle tilt effect
    const rotateX = ((y - centerY) / centerY) * 10 * intensity;
    const rotateY = ((x - centerX) / centerX) * 10 * intensity;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Animation variants for the corners
  const cornerVariants = {
    idle: { 
      scale: 1, 
      opacity: 0.5,
      borderColor: 'rgba(45, 212, 191, 0.3)', // Teal dim
      boxShadow: 'none'
    },
    hover: { 
      scale: 1.2, 
      opacity: 1,
      borderColor: '#2dd4bf', // Teal bright
      boxShadow: '0 0 15px rgba(45, 212, 191, 0.6)' // Glow effect
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Glass Background (Clean, no lines crossing text) */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl" />

      {/* 2. The Four Corner Brackets (The "Rectangles") */}
      
      {/* Top Left */}
      <motion.div
        className="absolute -top-[1px] -left-[1px] w-6 h-6 border-l-2 border-t-2 rounded-tl-xl z-20 pointer-events-none"
        variants={cornerVariants}
        initial="idle"
        animate={isHovered ? "hover" : "idle"}
        transition={{ duration: 0.3 }}
      />

      {/* Top Right */}
      <motion.div
        className="absolute -top-[1px] -right-[1px] w-6 h-6 border-r-2 border-t-2 rounded-tr-xl z-20 pointer-events-none"
        variants={cornerVariants}
        initial="idle"
        animate={isHovered ? "hover" : "idle"}
        transition={{ duration: 0.3 }}
      />

      {/* Bottom Left */}
      <motion.div
        className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-l-2 border-b-2 rounded-bl-xl z-20 pointer-events-none"
        variants={cornerVariants}
        initial="idle"
        animate={isHovered ? "hover" : "idle"}
        transition={{ duration: 0.3 }}
      />

      {/* Bottom Right */}
      <motion.div
        className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-r-2 border-b-2 rounded-br-xl z-20 pointer-events-none"
        variants={cornerVariants}
        initial="idle"
        animate={isHovered ? "hover" : "idle"}
        transition={{ duration: 0.3 }}
      />

      {/* 3. Subtle Scanline (Optional, very faint background only) */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #2dd4bf 2px, #2dd4bf 3px)',
        }}
      />

      {/* 4. Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default HolographicCard;
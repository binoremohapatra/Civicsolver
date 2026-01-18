import { useEffect, useRef } from 'react';

const MatrixRain = ({ opacity = 0.3 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sanskrit / Devanagari characters
    const chars = '०१२३४५६७८९अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह';
    
    // State to track drops
    let drops = [];

    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const columns = Math.floor(canvas.width / 20);
      // Reset drops array to match new screen width
      drops = Array(columns).fill(1);
    };

    // Initialize on mount
    initialize();

    const draw = () => {
      // Create a fading trail effect
      ctx.fillStyle = `rgba(15, 23, 42, ${0.05})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 20;
        const y = drops[i] * 20;

        // Gradient (Teal to Transparent)
        const gradient = ctx.createLinearGradient(x, y - 20, x, y);
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
        gradient.addColorStop(1, `rgba(20, 184, 166, ${opacity})`);
        
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    // Handle Resize: Re-calculate columns so rain covers the new area
    const handleResize = () => {
      initialize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }} // Ensures it stays behind everything
    />
  );
};

export default MatrixRain;
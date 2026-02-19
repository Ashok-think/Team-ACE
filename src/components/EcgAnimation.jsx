import React, { useEffect, useRef } from 'react';

// ECG path points — a realistic heartbeat waveform
const ECG_PATH = [
  [0, 0], [0.05, 0], [0.1, -0.05], [0.15, 0], [0.2, 0],
  [0.22, 0], [0.25, -0.8], [0.28, 1.2], [0.31, -0.4], [0.34, 0],
  [0.38, 0.15], [0.42, 0], [0.5, 0],
  [0.55, 0], [0.6, -0.05], [0.65, 0], [0.7, 0],
  [0.72, 0], [0.75, -0.8], [0.78, 1.2], [0.81, -0.4], [0.84, 0],
  [0.88, 0.15], [0.92, 0], [1.0, 0],
];

const EcgAnimation = ({ color = '#2dd4bf', width = 600, height = 80, speed = 2 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;
    const amplitude = H * 0.38;

    // Build full path points
    const pts = ECG_PATH.map(([x, y]) => [x * W, midY - y * amplitude]);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Scrolling effect: draw path offset by animOffset
      const offset = offsetRef.current % W;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw two copies side by side for seamless loop
      for (let copy = -1; copy <= 1; copy++) {
        ctx.beginPath();
        pts.forEach(([x, y], i) => {
          const px = ((x + copy * W - offset + W * 2) % (W * 2));
          if (px > W) return;
          if (i === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        });
        ctx.stroke();
      }

      // Fade mask on right side (leading edge glow)
      const grad = ctx.createLinearGradient(W * 0.7, 0, W, 0);
      grad.addColorStop(0, 'rgba(5,10,24,0)');
      grad.addColorStop(1, 'rgba(5,10,24,1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Fade mask on left side
      const gradL = ctx.createLinearGradient(0, 0, W * 0.15, 0);
      gradL.addColorStop(0, 'rgba(5,10,24,1)');
      gradL.addColorStop(1, 'rgba(5,10,24,0)');
      ctx.fillStyle = gradL;
      ctx.fillRect(0, 0, W, H);

      ctx.restore();

      offsetRef.current += speed;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: `${height}px`, display: 'block', opacity: 0.85 }}
    />
  );
};

export default EcgAnimation;

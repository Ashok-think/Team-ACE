import React from 'react';
import bgVideo from '../assets/background.mp4.mp4';

const Hero3D = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
    }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark overlay — lighter so video is clearly visible */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(5, 10, 24, 0.65) 0%, rgba(5, 10, 24, 0.50) 50%, rgba(5, 10, 24, 0.70) 100%)',
      }} />

      {/* Teal brand tint at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(15, 118, 110, 0.12), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Subtle top vignette for navbar readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '25%',
        background: 'linear-gradient(to bottom, rgba(5, 10, 24, 0.6), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default Hero3D;

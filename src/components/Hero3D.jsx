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

      {/* Dark overlay so text stays readable — adjust opacity for more/less darkness */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.82) 0%, rgba(10, 20, 40, 0.75) 100%)',
      }} />

      {/* Teal color tint at bottom for brand consistency */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, rgba(15, 118, 110, 0.12), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default Hero3D;

import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Define options statically outside to maintain reference identity and prevent canvas restarts
const particlesOptions = {
  fullScreen: { enable: false },
  background: {
    color: { value: 'transparent' },
  },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 50,
      density: { enable: true, area: 900 },
    },
    color: {
      value: ['#2563eb', '#06b6d4'],
    },
    links: {
      enable: true,
      distance: 140,
      color: '#3b82f6',
      opacity: 0.22,
      width: 1,
      triangles: { enable: false },
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none',
      random: false,
      straight: false,
      outModes: { default: 'out' },
    },
    opacity: {
      value: 0.7,
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      resize: { enable: true },
    },
    modes: {
      repulse: {
        distance: 90,
        duration: 0.4,
      },
    },
  },
};

export const NetworkBackground = React.memo(function NetworkBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="enginow-network-bg"
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={particlesOptions}
    />
  );
});

export default NetworkBackground;
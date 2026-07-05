import React from 'react';
import { motion } from 'framer-motion';

const nodes = [
  { id: 1, label: 'IIT Bombay', x: 120, y: 100, radius: 4 },
  { id: 2, label: 'COEP Pune', x: 280, y: 70, radius: 3 },
  { id: 3, label: 'BITS Pilani', x: 70, y: 220, radius: 4 },
  { id: 4, label: 'DTU Delhi', x: 340, y: 190, radius: 3.5 },
  { id: 5, label: 'NIT Trichy', x: 150, y: 320, radius: 4 },
  { id: 6, label: 'VIT Vellore', x: 300, y: 310, radius: 3 },
  { id: 7, label: 'RVCE Bangalore', x: 240, y: 230, radius: 4.5 },
];

const connections = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 7 },
  { from: 5, to: 7 },
  { from: 6, to: 7 },
  { from: 1, to: 7 },
];

export default function EcosystemNetwork() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.2] dark:opacity-[0.12] transition-opacity duration-300">
      <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
        {/* Draw Connection Lines */}
        {connections.map((conn, idx) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`conn-${idx}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="var(--color-primary)"
              strokeWidth="0.75"
              strokeDasharray="4 4"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{
                duration: 8 + idx * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          );
        })}

        {/* Draw Pulsing Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Pulsing outer ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.radius * 2.5}
              fill="var(--color-primary)"
              opacity="0.15"
              animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0.03, 0.15] }}
              transition={{
                duration: 3 + (node.id % 3),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Inner solid node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill="var(--color-primary)"
              opacity="0.8"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

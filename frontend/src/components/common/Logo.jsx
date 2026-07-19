import React from 'react';
import engShape from '../../assets/eng_shape.png';

export function Logo({ className = '', imageClassName = '', textClassName = '', isDarkBg = false }) {
  return (
    <div className={`inline-flex shrink-0 items-center ${className}`}>
      <img
        src={engShape}
        alt=""
        className={`block h-11 w-auto shrink-0 object-contain transition-transform duration-200 m-1.5 ${imageClassName}`}
      />
      <span
        className={`font-outfit font-bold text-[26px] leading-none tracking-tight whitespace-nowrap ${
          isDarkBg ? 'text-white' : 'text-slate-950 dark:text-white'
        } ${textClassName}`}
      >
        Enginow Ignite
      </span>
    </div>
  );
}

export default Logo;


import React from 'react';
import enginowIcon from '../../assets/enginow_icon.png';

export function Logo({ className = '', imageClassName = '', textClassName = '', isDarkBg = false }) {
  return (
    <div className={`inline-flex shrink-0 items-center ${className}`}>
      <img
        src={enginowIcon}
        alt=""
        className={`block h-9 w-auto shrink-0 object-contain transition-transform duration-200 ${imageClassName}`}
      />
      <span
        className={`font-outfit font-bold text-[26px] leading-none tracking-tight whitespace-nowrap ${
          isDarkBg ? 'text-white' : 'text-slate-950 dark:text-white'
        } ${textClassName}`}
      >
        nginow Ignite
      </span>
    </div>
  );
}

export default Logo;

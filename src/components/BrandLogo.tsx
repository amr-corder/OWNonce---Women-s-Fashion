import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/own_once_logo_1787511837501.jpg';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
  withCard?: boolean;
  useImage?: boolean;
  showTextName?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  light = false,
  withCard = false,
  useImage = true,
  showTextName = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Height mappings for the image logo
  const imgHeightMap = {
    sm: 'h-9 w-9 sm:h-10 sm:w-10',
    md: 'h-11 w-11 sm:h-12 sm:w-12',
    lg: 'h-14 w-14 sm:h-16 sm:w-16',
    xl: 'h-20 w-20 sm:h-24 sm:w-24',
  };

  // Typography scaling settings
  const scaleMap = {
    sm: {
      own: 'text-lg sm:text-xl',
      once: 'text-[8.5px] sm:text-[9px] tracking-[0.32em]',
      womenswear: 'text-[6px] sm:text-[7px] tracking-[0.4em]',
      lineW: 'w-3 sm:w-4',
      py: 'py-0.5',
      cardPad: 'p-1.5',
    },
    md: {
      own: 'text-xl sm:text-2xl',
      once: 'text-[9.5px] sm:text-[10.5px] tracking-[0.35em]',
      womenswear: 'text-[7px] sm:text-[8px] tracking-[0.44em]',
      lineW: 'w-4 sm:w-6',
      py: 'py-0.5',
      cardPad: 'p-2 sm:p-2.5',
    },
    lg: {
      own: 'text-2xl sm:text-3xl lg:text-4xl',
      once: 'text-xs sm:text-sm tracking-[0.4em]',
      womenswear: 'text-[8.5px] sm:text-[9.5px] tracking-[0.48em]',
      lineW: 'w-6 sm:w-8',
      py: 'py-1',
      cardPad: 'p-3.5 sm:p-4',
    },
    xl: {
      own: 'text-4xl sm:text-5xl lg:text-6xl',
      once: 'text-sm sm:text-base tracking-[0.44em]',
      womenswear: 'text-[10px] sm:text-xs tracking-[0.52em]',
      lineW: 'w-8 sm:w-12',
      py: 'py-1.5',
      cardPad: 'p-6 sm:p-8',
    },
  };

  const currentScale = scaleMap[size] || scaleMap.md;

  // Colors based on variant
  const ownColor = withCard
    ? 'text-[#141210]'
    : light
    ? 'text-[#FFFDF9]'
    : 'text-[#1E1610]';

  const onceColor = withCard
    ? 'text-[#B48B57]'
    : light
    ? 'text-[#E8CDAE]'
    : 'text-[#B48B57]';

  const lineColor = withCard
    ? 'bg-[#B48B57]'
    : light
    ? 'bg-[#E8CDAE]'
    : 'bg-[#B48B57]';

  const womenswearColor = withCard
    ? 'text-[#857C73]'
    : light
    ? 'text-[#F5E6D3]/85'
    : 'text-[#7D7369]';

  const cardClasses = withCard
    ? `bg-[#FAF7F2] border border-[#E6DCCF] shadow-xs rounded-sm ${currentScale.cardPad}`
    : '';

  return (
    <Link
      to="/"
      id="brand-logo-link"
      className={`inline-flex items-center gap-3 select-none transition-all duration-200 hover:opacity-90 ${cardClasses} ${className}`}
      title="OWN ONCE Womenswear"
    >
      {/* 1. Official Logo Graphic Icon */}
      {useImage && !imgError ? (
        <div className="relative shrink-0 flex items-center justify-center p-1 bg-[#FAF7F2] rounded-full border border-[#E6DCCF]/80 shadow-xs overflow-hidden">
          <img
            src={logoImg}
            alt="OWN ONCE Womenswear Logo"
            className={`${imgHeightMap[size] || imgHeightMap.md} object-cover rounded-full aspect-square`}
            onError={() => setImgError(true)}
          />
        </div>
      ) : null}

      {/* 2. Text Brand Name Next to Logo */}
      {showTextName && (
        <div className="flex flex-col items-center justify-center text-center">
          {/* Top "OWN" */}
          <span
            className={`font-serif font-bold leading-none ${ownColor} ${currentScale.own}`}
            style={{
              fontFamily: "'Bodoni Moda', 'Playfair Display', Georgia, serif",
              letterSpacing: '0.04em',
            }}
          >
            OWN
          </span>

          {/* Middle "— ONCE —" */}
          <div className={`flex items-center justify-center gap-1.5 sm:gap-2 ${currentScale.py} w-full`}>
            <span className={`h-[1px] ${currentScale.lineW} ${lineColor} opacity-90 block shrink-0`} />
            <span
              className={`font-serif uppercase leading-none font-medium ${onceColor} ${currentScale.once} px-0.5`}
              style={{
                fontFamily: "'Bodoni Moda', 'Playfair Display', Georgia, serif",
              }}
            >
              ONCE
            </span>
            <span className={`h-[1px] ${currentScale.lineW} ${lineColor} opacity-90 block shrink-0`} />
          </div>

          {/* Bottom "WOMENSWEAR" */}
          <span
            className={`font-serif uppercase leading-none ${womenswearColor} ${currentScale.womenswear} tracking-[0.4em] pl-[0.2em]`}
            style={{
              fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif",
              fontWeight: 400,
            }}
          >
            WOMENSWEAR
          </span>
        </div>
      )}
    </Link>
  );
};

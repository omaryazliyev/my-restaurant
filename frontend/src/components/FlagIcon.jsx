import React from 'react';

export default function FlagIcon({ code, width = 22, height = 15 }) {
  if (code === 'uz') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 500 250"
        style={{
          borderRadius: '3px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          verticalAlign: 'middle',
          display: 'inline-block',
          flexShrink: 0,
        }}
      >
        {/* Sky Blue */}
        <rect width="500" height="80" fill="#0099b5" />
        {/* Red stripe 1 */}
        <rect y="80" width="500" height="5" fill="#ce1126" />
        {/* White */}
        <rect y="85" width="500" height="80" fill="#ffffff" />
        {/* Red stripe 2 */}
        <rect y="165" width="500" height="5" fill="#ce1126" />
        {/* Green */}
        <rect y="170" width="500" height="80" fill="#1eb53a" />
        {/* Crescent */}
        <circle cx="54" cy="40" r="26" fill="#ffffff" />
        <circle cx="63" cy="40" r="22" fill="#0099b5" />
        {/* 12 Stars */}
        <g fill="#ffffff">
          {/* Row 1: 3 stars */}
          <circle cx="106" cy="20" r="4.5" />
          <circle cx="128" cy="20" r="4.5" />
          <circle cx="150" cy="20" r="4.5" />
          {/* Row 2: 4 stars */}
          <circle cx="84" cy="40" r="4.5" />
          <circle cx="106" cy="40" r="4.5" />
          <circle cx="128" cy="40" r="4.5" />
          <circle cx="150" cy="40" r="4.5" />
          {/* Row 3: 5 stars */}
          <circle cx="62" cy="60" r="4.5" />
          <circle cx="84" cy="60" r="4.5" />
          <circle cx="106" cy="60" r="4.5" />
          <circle cx="128" cy="60" r="4.5" />
          <circle cx="150" cy="60" r="4.5" />
        </g>
        {/* Subtle border */}
        <rect width="500" height="250" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="4" />
      </svg>
    );
  }

  if (code === 'ru') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 300 200"
        style={{
          borderRadius: '3px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          verticalAlign: 'middle',
          display: 'inline-block',
          flexShrink: 0,
        }}
      >
        <rect width="300" height="66.7" fill="#ffffff" />
        <rect y="66.7" width="300" height="66.7" fill="#0039a6" />
        <rect y="133.4" width="300" height="66.7" fill="#d52b1e" />
        {/* Subtle border */}
        <rect width="300" height="200" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="4" />
      </svg>
    );
  }

  if (code === 'en') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 60 30"
        style={{
          borderRadius: '3px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          verticalAlign: 'middle',
          display: 'inline-block',
          flexShrink: 0,
        }}
      >
        <clipPath id="uk-flag-clip">
          <rect width="60" height="30" rx="3" />
        </clipPath>
        <g clipPath="url(#uk-flag-clip)">
          <path d="M0 0v30h60V0z" fill="#012169" />
          <path d="M0 0l60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
          <path d="M0 0l60 30m0-30L0 30" stroke="#c8102e" strokeWidth="2" />
          <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
          <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
        </g>
        {/* Subtle border */}
        <rect width="60" height="30" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      </svg>
    );
  }

  return null;
}

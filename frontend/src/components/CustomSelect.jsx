import React, { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect — Loyiha dizayniga mos premium dropdown komponent.
 * 
 * Props:
 *   value         — tanlangan qiymat
 *   onChange      — (value) => void funksiyasi (e.target.value emas, to'g'ridan qiymat)
 *   options       — [{ value, label }] massivi
 *   placeholder   — placeholder text
 *   variant       — 'light' (bronirovanie/light bg) | 'dark' (cart drawer/dark bg)
 *   fullWidth     — boolean, default true
 *   name          — form name attribute (ixtiyoriy)
 *   required      — boolean
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Выберите...',
  variant = 'light',
  fullWidth = true,
  name,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Tashqarini bosib yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => String(o.value) === String(value))?.label || '';

  const isLight = variant === 'light';

  // Styles
  const triggerStyle = {
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    ...(isLight ? {
      background: 'transparent',
      border: 'none',
      borderBottom: `1.5px solid ${isOpen ? '#000' : '#9e9e9e'}`,
      borderRadius: 0,
      padding: '13px 4px 13px 0',
      color: value ? '#000' : '#9e9e9e',
      fontSize: '15px',
      fontWeight: value ? '500' : '400',
    } : {
      background: isOpen ? '#1a1c28' : '#272932',
      border: `1.5px solid ${isOpen ? '#ffb703' : '#3b3e4d'}`,
      borderRadius: '12px',
      padding: '10px 14px',
      color: value ? '#fff' : '#a0a5b5',
      fontSize: '14px',
      fontWeight: value ? '500' : '400',
      transition: 'border-color 0.2s, background 0.2s',
    }),
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    zIndex: 9000,
    borderRadius: isLight ? '16px' : '14px',
    overflow: 'hidden',
    boxShadow: isLight
      ? '0 20px 50px rgba(0,0,0,0.14), 0 6px 20px rgba(0,0,0,0.08)'
      : '0 20px 50px rgba(0,0,0,0.5)',
    border: isLight
      ? '1px solid rgba(255,255,255,0.8)'
      : '1px solid #3b3e4d',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    background: isLight
      ? 'rgba(255,255,255,0.92)'
      : '#1e1f25',
    animation: 'selectDropdown 0.18s cubic-bezier(0.16,1,0.3,1)',
  };

  const optionStyle = (optVal, idx) => ({
    padding: isLight ? '13px 20px' : '11px 16px',
    cursor: 'pointer',
    fontSize: isLight ? '15px' : '14px',
    fontWeight: String(optVal) === String(value) ? '700' : '400',
    color: isLight
      ? (String(optVal) === String(value) ? '#000' : '#333')
      : (String(optVal) === String(value) ? '#ffb703' : '#e0e0e0'),
    background: String(optVal) === String(value)
      ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,183,3,0.08)')
      : 'transparent',
    borderBottom: isLight
      ? (idx < options.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none')
      : (idx < options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'),
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.15s',
  });

  return (
    <>
      {/* Global animation keyframe — birinchi render'da qo'shiladi */}
      <style>{`
        @keyframes selectDropdown {
          from { opacity: 0; transform: translateY(-8px) scaleY(0.95); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        .cs-option:hover {
          background: ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,183,3,0.1)'} !important;
        }
      `}</style>

      <div
        ref={ref}
        style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}
      >
        {/* Hidden native input for form submit compatibility */}
        {name && (
          <input type="hidden" name={name} value={value || ''} required={required && !value} />
        )}

        {/* Trigger Button */}
        <div
          style={triggerStyle}
          onClick={() => setIsOpen((o) => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen((o) => !o); }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {selectedLabel || placeholder}
          </span>

          {/* Animated chevron */}
          <svg
            viewBox="0 0 24 24"
            width={isLight ? 18 : 16}
            height={isLight ? 18 : 16}
            fill="none"
            stroke={isLight ? (isOpen ? '#000' : '#9e9e9e') : (isOpen ? '#ffb703' : '#a0a5b5')}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              marginLeft: '8px',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div style={dropdownStyle} role="listbox">
            {options.map((opt, idx) => (
              <div
                key={opt.value}
                className="cs-option"
                role="option"
                aria-selected={String(opt.value) === String(value)}
                style={optionStyle(opt.value, idx)}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {/* Checkmark for selected */}
                {String(opt.value) === String(value) && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={isLight ? '#000' : '#ffb703'} strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

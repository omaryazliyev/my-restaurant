import React from 'react';

/**
 * RestaurantFloorPlan — Interactive visual floor plan for table selection.
 * Matches the Figma screenshot exactly:
 *  - Left: 2 vertical pill-shaped booths
 *  - Center: 3×3 grid of round tables
 *  - Right: window slots labeled "Окна"
 *  - Bottom: entrance labeled "Вход"
 *  - Legend: green=free, red=occupied this hour, yellow=occupied today
 */

// Full floor plan table data
// status: 'free' | 'occupied_hour' | 'occupied_day'
export const FLOOR_TABLES = [
  // ─── LEFT BOOTHS ───────────────────────────────────────────
  { id: 10, label: 'VIP', seats: '6–10', type: 'booth', status: 'occupied_hour',
    style: { left: '6%', top: '12%', width: '80px', height: '170px', borderRadius: '50px' } },
  { id: 11, label: 'Кабинет', seats: '4–6', type: 'booth', status: 'free',
    style: { left: '6%', top: '54%', width: '80px', height: '170px', borderRadius: '50px' } },

  // ─── CENTER ROUND TABLES (3×3) ─────────────────────────────
  // Row 0
  { id: 1, label: '1', seats: '2–4', type: 'circle', status: 'free',        gridRow: 0, gridCol: 0 },
  { id: 2, label: '2', seats: '2–4', type: 'circle', status: 'free',        gridRow: 0, gridCol: 1 },
  { id: 3, label: '3', seats: '2–4', type: 'circle', status: 'occupied_hour', gridRow: 0, gridCol: 2 },
  // Row 1
  { id: 4, label: '4', seats: '2–4', type: 'circle', status: 'free',        gridRow: 1, gridCol: 0 },
  { id: 5, label: '5', seats: '2–4', type: 'circle', status: 'occupied_hour', gridRow: 1, gridCol: 1 },
  { id: 6, label: '6', seats: '2–4', type: 'circle', status: 'occupied_day', gridRow: 1, gridCol: 2 },
  // Row 2
  { id: 7, label: '7', seats: '2–4', type: 'circle', status: 'occupied_day', gridRow: 2, gridCol: 0 },
  { id: 8, label: '8', seats: '2–4', type: 'circle', status: 'free',        gridRow: 2, gridCol: 1 },
  { id: 9, label: '9', seats: '2–4', type: 'circle', status: 'free',        gridRow: 2, gridCol: 2 },
];

// Color map
const STATUS_COLOR = {
  free:          { bg: '#27ae60', hover: '#2ecc71', label: 'Место свободно' },
  occupied_hour: { bg: '#c0392b', hover: '#e74c3c', label: 'Занято в этот час' },
  occupied_day:  { bg: '#f39c12', hover: '#f1c40f', label: 'Занято сегодня' },
};

// Grid geometry for circle tables inside the center zone
const CIRCLE_DIAMETER = 82;
const CIRCLE_GAP      = 30;
const CIRCLE_START_X  = 310; // px from left of the floor plan container
const CIRCLE_START_Y  = 80;  // px from top

export default function RestaurantFloorPlan({ selectedTableId, onSelect }) {
  const isFree = (tbl) => tbl.status === 'free';

  const getCirclePosition = (row, col) => ({
    left: CIRCLE_START_X + col * (CIRCLE_DIAMETER + CIRCLE_GAP),
    top:  CIRCLE_START_Y + row * (CIRCLE_DIAMETER + CIRCLE_GAP),
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {/* ── Floor Plan Canvas ─────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '720px',
          height: '440px',
          background: '#ffffff',
          border: '2.5px solid #111',
          borderRadius: '10px',
          margin: '0 auto',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {/* ── Window slots on the RIGHT ─────────────────── */}
        {['16px', '162px', '308px'].map((top, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', right: 0, top,
              width: '55px', height: '120px',
              background: '#d0d0d0',
              borderLeft: '2px solid #999',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {i === 1 && (
              <span style={{
                writingMode: 'vertical-rl', textOrientation: 'mixed',
                fontSize: '15px', fontWeight: '700', color: '#444',
                letterSpacing: '3px',
              }}>
                Окна
              </span>
            )}
          </div>
        ))}

        {/* ── Entrance at the BOTTOM ─────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '120px', height: '50px',
            background: '#c8c8c8',
            border: '2px solid #888',
            borderBottom: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#333' }}>Вход</span>
        </div>

        {/* ── BOOTHS (pill shapes on the left) ──────────── */}
        {FLOOR_TABLES.filter((t) => t.type === 'booth').map((tbl) => {
          const isSelected = String(selectedTableId) === String(tbl.id);
          const color      = STATUS_COLOR[tbl.status];
          const canSelect  = isFree(tbl);

          return (
            <div
              key={tbl.id}
              onClick={() => canSelect && onSelect(tbl)}
              title={canSelect ? `${tbl.label} — нажмите чтобы выбрать` : color.label}
              style={{
                position: 'absolute',
                ...tbl.style,
                background: isSelected ? '#2980b9' : color.bg,
                boxShadow: isSelected
                  ? '0 0 0 4px #2980b9, 0 0 20px rgba(41,128,185,0.5)'
                  : `0 6px 20px rgba(0,0,0,0.2)`,
                cursor: canSelect ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '4px',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>
                {tbl.label}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>
                {tbl.seats}ч
              </span>
              {isSelected && (
                <span style={{ color: '#fff', fontSize: '16px', marginTop: '2px' }}>✓</span>
              )}
            </div>
          );
        })}

        {/* ── CIRCLE TABLES (3×3 center grid) ───────────── */}
        {FLOOR_TABLES.filter((t) => t.type === 'circle').map((tbl) => {
          const { left, top } = getCirclePosition(tbl.gridRow, tbl.gridCol);
          const isSelected    = String(selectedTableId) === String(tbl.id);
          const color         = STATUS_COLOR[tbl.status];
          const canSelect     = isFree(tbl);

          return (
            <div
              key={tbl.id}
              onClick={() => canSelect && onSelect(tbl)}
              title={canSelect ? `Стол ${tbl.label} — нажмите` : color.label}
              style={{
                position: 'absolute',
                left, top,
                width:  CIRCLE_DIAMETER,
                height: CIRCLE_DIAMETER,
                borderRadius: '50%',
                background: isSelected ? '#2980b9' : color.bg,
                boxShadow: isSelected
                  ? '0 0 0 5px #2980b9, 0 0 24px rgba(41,128,185,0.6)'
                  : '0 6px 18px rgba(0,0,0,0.18)',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '2px',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', lineHeight: 1 }}>
                {isSelected ? '✓' : tbl.label}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>
                {tbl.seats}ч
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: '8px',
          marginTop: '18px', paddingLeft: '8px',
          alignItems: 'flex-end',
        }}
      >
        {Object.entries(STATUS_COLOR).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: val.bg, flexShrink: 0,
            }} />
            <span style={{
              fontSize: '13px', color: '#333', fontWeight: '500',
              textDecoration: key === 'free' ? 'underline' : 'none',
              color: key === 'free' ? '#2980b9' : '#444',
            }}>
              {val.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

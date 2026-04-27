import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Tangry Spices — Taste of Home';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #f97316, #ef4444, #f97316)',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          marginBottom: 32,
          fontSize: 56,
          fontWeight: 900,
          color: 'white',
        }}
      >
        T
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: 'white',
          letterSpacing: '-2px',
          marginBottom: 8,
        }}
      >
        Tangry Spices
      </div>
      <div
        style={{
          fontSize: 28,
          color: '#f97316',
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        Taste of Home
      </div>
      <div
        style={{
          fontSize: 22,
          color: '#a3a3a3',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.4,
        }}
      >
        Authentic Rajasthani Masalas &amp; Pickles from Jhotwara, Jaipur
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: 32,
          fontSize: 16,
          color: '#737373',
        }}
      >
        <span>FSSAI Licensed</span>
        <span>•</span>
        <span>ISO 22000 Certified</span>
        <span>•</span>
        <span>tangryspices.com</span>
      </div>
    </div>,
    { ...size },
  );
}

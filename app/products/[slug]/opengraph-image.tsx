import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/db/queries';

export const runtime = 'edge';
export const alt = 'Tangry Spices Product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const name = product?.name ?? 'Product';
  const category = product?.category ?? 'Spices';
  const price = product?.variants?.[0]?.price ? `₹${product.variants[0].price}` : '';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
        fontFamily: 'sans-serif',
        padding: 60,
      }}
    >
      {/* Top accent bar */}
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

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#f97316',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              background: 'rgba(249,115,22,0.1)',
              padding: '8px 20px',
              borderRadius: 8,
            }}
          >
            {category}
          </span>
        </div>

        {/* Product name */}
        <div
          style={{
            fontSize: name.length > 30 ? 48 : 60,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          {name}
        </div>

        {/* Price */}
        {price && (
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#f97316',
              marginBottom: 16,
            }}
          >
            Starting at {price}
          </div>
        )}

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#a3a3a3',
          }}
        >
          Authentic Rajasthani spices from Tangry, Jaipur
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: 'white',
            }}
          >
            T
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>Tangry Spices</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 24,
            fontSize: 15,
            color: '#737373',
          }}
        >
          <span>FSSAI Licensed</span>
          <span>•</span>
          <span>tangryspices.com</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}

import Image from 'next/image';

export type PaymentBrandId =
  | 'upi'
  | 'gpay'
  | 'phonepe'
  | 'paytm'
  | 'visa'
  | 'mastercard'
  | 'rupay'
  | 'cod'
  | 'razorpay';

type BrandAsset = {
  label: string;
  shortLabel: string;
  src: string;
  /** Display height in pixels inside a pill */
  height: number;
  /** Optional max width so wide wordmarks fit */
  maxWidth: number;
};

const BRAND_ASSETS: Record<PaymentBrandId, BrandAsset> = {
  upi: {
    label: 'UPI',
    shortLabel: 'UPI',
    src: '/images/payments/upi.svg',
    height: 18,
    maxWidth: 52,
  },
  gpay: {
    label: 'Google Pay',
    shortLabel: 'GPay',
    src: '/images/payments/googlepay.svg',
    height: 16,
    maxWidth: 48,
  },
  phonepe: {
    label: 'PhonePe',
    shortLabel: 'PhonePe',
    src: '/images/payments/phonepe.svg',
    height: 20,
    maxWidth: 72,
  },
  paytm: {
    label: 'Paytm',
    shortLabel: 'Paytm',
    src: '/images/payments/paytm.svg',
    height: 14,
    maxWidth: 44,
  },
  visa: {
    label: 'Visa',
    shortLabel: 'Visa',
    src: '/images/payments/visa.svg',
    height: 14,
    maxWidth: 40,
  },
  mastercard: {
    label: 'Mastercard',
    shortLabel: 'MC',
    src: '/images/payments/mastercard.svg',
    height: 18,
    maxWidth: 28,
  },
  rupay: {
    label: 'RuPay',
    shortLabel: 'RuPay',
    src: '/images/payments/rupay.svg',
    height: 16,
    maxWidth: 44,
  },
  cod: {
    label: 'Cash on Delivery',
    shortLabel: 'COD',
    src: '/images/payments/cod.svg',
    height: 28,
    maxWidth: 36,
  },
  razorpay: {
    label: 'Razorpay',
    shortLabel: 'Razorpay',
    src: '/images/payments/razorpay.svg',
    height: 16,
    maxWidth: 72,
  },
};

export function PaymentBrandIcon({
  brand,
  size = 'md',
}: {
  brand: PaymentBrandId;
  size?: 'sm' | 'md';
}) {
  const asset = BRAND_ASSETS[brand];
  const scale = size === 'sm' ? 0.85 : 1;
  const height = Math.round(asset.height * scale);

  return (
    <Image
      src={asset.src}
      alt=""
      width={asset.maxWidth}
      height={height}
      aria-hidden
      className="object-contain object-center"
      style={{ height: 'auto', width: 'auto', maxHeight: height, maxWidth: asset.maxWidth * scale }}
      unoptimized
    />
  );
}

export function PaymentLogoStrip({
  brands,
  size = 'md',
  className = '',
}: {
  brands: PaymentBrandId[];
  size?: 'sm' | 'md';
  className?: string;
}) {
  const pillHeight = size === 'sm' ? 'h-10' : 'h-11';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {brands.map((brand) => {
        const asset = BRAND_ASSETS[brand];
        return (
          <div
            key={brand}
            title={asset.label}
            className={`inline-flex items-center justify-center rounded-xl border border-gray-200/90 bg-white px-2.5 shadow-sm ${pillHeight} min-w-[3.75rem]`}
          >
            <PaymentBrandIcon brand={brand} size={size} />
          </div>
        );
      })}
    </div>
  );
}

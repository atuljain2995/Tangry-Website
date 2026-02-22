'use client';

import Script from 'next/script';

const PLACEHOLDERS = {
  GA: 'G-XXXXXXXXXX',
  FB_PIXEL: 'YOUR_PIXEL_ID',
  HOTJAR: 'YOUR_HOTJAR_ID',
};

const isSet = (value: string | undefined, placeholder: string) =>
  value != null && value.trim() !== '' && value !== placeholder;

export const Analytics = () => {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? '';
  const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID ?? '';

  const hasGA = isSet(GA_TRACKING_ID, PLACEHOLDERS.GA);
  const hasFBPixel = isSet(FB_PIXEL_ID, PLACEHOLDERS.FB_PIXEL);
  const hasHotjar = isSet(HOTJAR_ID, PLACEHOLDERS.HOTJAR);

  return (
    <>
      {/* Google Analytics 4 - only load when configured */}
      {hasGA && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel (Facebook) - only load when configured */}
      {hasFBPixel && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Hotjar - only load when configured (ID injected as number to avoid ReferenceError) */}
      {hasHotjar && (() => {
        const numericId = parseInt(String(HOTJAR_ID).trim(), 10);
        if (Number.isNaN(numericId)) return null;
        return (
          <Script id="hotjar" strategy="afterInteractive">
            {`
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${numericId},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>
        );
      })()}

      {/* Google Tag Manager (optional - if you prefer GTM over direct GA4) */}
      {/* Uncomment if using GTM
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');
        `}
      </Script>
      */}
    </>
  );
};

// Tracking helper functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

export const trackPurchase = (value: number, currency: string = 'INR', orderId: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: currency,
    });
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      value: value,
      currency: currency,
    });
  }
};

export const trackAddToCart = (productId: string, productName: string, value: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      items: [{
        item_id: productId,
        item_name: productName,
        price: value,
      }]
    });
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'AddToCart', {
      content_ids: [productId],
      content_name: productName,
      value: value,
      currency: 'INR',
    });
  }
};


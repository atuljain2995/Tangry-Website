import Script from 'next/script';

const CLARITY_PROJECT_ID = 'wbf3ycynms';
const LOAD_DELAY_MS = 3500;

export default function MicrosoftClarity() {
  return (
    <Script
      id="microsoft-clarity"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          window.requestIdleCallback = window.requestIdleCallback || function(cb){ return setTimeout(cb, 1); };
          window.requestIdleCallback(function(){
            setTimeout(function(){
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            }, ${LOAD_DELAY_MS});
          });
        `,
      }}
    />
  );
}

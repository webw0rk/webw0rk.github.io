/* Googleアナリティクス */
(() => {
  const id = 'G-GX5CF824RP';

  const google_analytics_elem = $Id('google-analytics-elem');
  const script_elem = document.createElement('script');
  script_elem.async = true;
  script_elem.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  google_analytics_elem.insertAdjacentElement('afterend', script_elem);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id);
})();

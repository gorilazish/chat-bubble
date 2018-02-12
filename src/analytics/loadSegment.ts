const segmentEnvKeys = {
  production: 'mt9q6Rzdy9ZaETdcdVeQmKD9SEtMGenn',
  staging: '0sLzx7H3fYk5HIhUrstu4iNobhGAQ31w',
  development: '0sLzx7H3fYk5HIhUrstu4iNobhGAQ31w',
};

const isProd = process.env.NODE_ENV === 'production'

const segmentKey = isProd ? segmentEnvKeys.production : segmentEnvKeys.staging

export default function loadSegment() {
    !(function () {
      const analytics = (window as any).analytics = (window as any).analytics || []; if (!analytics.initialize) {
        if (analytics.invoked)window.console && console.error && console.error('Segment snippet included twice.'); else {
          // @ts-ignore
          analytics.invoked = !0; analytics.methods = ['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','reset','group','track','ready','alias','debug','page','once','off','on']; analytics.factory = function (t) { return function () { const e = Array.prototype.slice.call(arguments); e.unshift(t); analytics.push(e); return analytics } }; for (let t = 0; t < analytics.methods.length; t++) { const e = analytics.methods[t]; analytics[e] = analytics.factory(e) }analytics.load = function (t) { const e = document.createElement('script'); e.type = 'text/javascript'; e.async = !0; e.src = `${document.location.protocol === 'https:' ? 'https://' : 'http://'}cdn.segment.com/analytics.js/v1/${t}/analytics.min.js`; const n = document.getElementsByTagName('script')[0]; n.parentNode.insertBefore(e,n) }; analytics.SNIPPET_VERSION = '4.0.0'
  
          // first page tracking is handled by react component's lifecycle hooks
          // so we only need to load the library
          analytics.load(segmentKey)
        }
      }
    }())
  }
  